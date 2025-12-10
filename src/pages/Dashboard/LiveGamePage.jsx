import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGame } from "../../hooks/useGame";
import { useCreatePlayer } from "../../hooks/useCreatePlayer";
import { useCreateTeam } from "../../hooks/useCreateTeam";
import { useSocket } from "../../hooks/useSocket";
import { getSportConfig } from "../../utils/sportConfig";
import { motion, AnimatePresence } from "framer-motion";
import CelebrationScreen from "../../utils/CelebrationScreen";
import { calculateAnalytics as calculateGameAnalytics } from "../../utils/analyticsCalculator";

import {
  FiPlay,
  FiPause,
  FiSquare,
  FiUsers,
  FiClock,
  FiPlus,
  FiMinus,
  FiHome,
  FiArrowLeft,
  FiRefreshCw,
  FiUser,
  FiTarget,
  FiAward,
  FiFlag,
  FiAlertTriangle,
  FiBarChart2,
  FiTrendingUp,
  FiPieChart,
  FiActivity,
  FiShare2,
  FiDownload,
  FiStar,
  FiVolume2,
  FiVolumeX,
  FiShuffle,
  FiArrowRight,
} from "react-icons/fi";
import StatsTab from "../../components/GameTabs/StatsTab";
import AnalyticsTab from "../../components/GameTabs/AnalyticsTab";
import ScoringTab from "../../components/GameTabs/ScoringTab";
import EventsTab from "../../components/GameTabs/EventsTab";
import PlayersTab from "../../components/GameTabs/PlayersTab";

const LiveGamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef();

  const [userTeam, setUserTeam] = useState(null);
  const [isHomeTeam, setIsHomeTeam] = useState(true);
  const [currentUserTeamId, setCurrentUserTeamId] = useState(null);
  const [teamNames, setTeamNames] = useState({
    home: "",
    away: "",
  });

  const [teamSelection, setTeamSelection] = useState({
    showSelection: false,
    attackingTeam: null, // 'home' or 'away'
    defendingTeam: null,
    kickoffTeam: null,
    isSelected: false,
  });

  const [loadingTeamNames, setLoadingTeamNames] = useState(false);

  const {
    currentGame,
    getGameById,
    addGameEvent,
    startGame,
    endGame,
    isLoading,
    error,
    clearError,
    refreshGame,
    updateGameProgress,
  } = useGame();
  const { getPlayersByTeam } = useCreatePlayer();
  const { getTeamById } = useCreateTeam();
  const { socket, isConnected, joinRoom, leaveRoom } = useSocket();

  const [activeTab, setActiveTab] = useState("stats");
  const [isUpdating, setIsUpdating] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  const [players, setPlayers] = useState({
    home: [],
    away: [],
  });

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerSelect, setShowPlayerSelect] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [gameAnalytics, setGameAnalytics] = useState({
    home: [],
    away: [],
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [winner, setWinner] = useState(null);
  const [finalScore, setFinalScore] = useState({ home: 0, away: 0 });

  const [commentaryEnabled, setCommentaryEnabled] = useState(true);
  const [currentCommentary, setCurrentCommentary] = useState("");
  const [showCommentaryToast, setShowCommentaryToast] = useState(false);
  const [commentaryHistory, setCommentaryHistory] = useState([]);

  const [gameTime, setGameTime] = useState({
    minutes: 0,
    seconds: 0,
    isRunning: false,
  });

  const [overlayIcon, setOverlayIcon] = useState(null);

  const sportConfig = getSportConfig(currentGame?.base?.sport);

  const fetchTeamNames = useCallback(
    async (homeTeamId, awayTeamId) => {
      setLoadingTeamNames(true);

      try {
        const homeTeamResponse = await getTeamById(homeTeamId);
        const homeTeamName = homeTeamResponse?.data?.teamName || "Home Team";

        const awayTeamResponse = await getTeamById(awayTeamId);
        const awayTeamName = awayTeamResponse?.data?.teamName || "Away Team";

        setTeamNames({
          home: homeTeamName,
          away: awayTeamName,
        });

        if (currentGame?.sport?.matchConfig?.kickoffTeam) {
          const kickoffTeam = currentGame.sport.matchConfig.kickoffTeam;
          setTeamSelection({
            showSelection: false,
            attackingTeam: kickoffTeam,
            defendingTeam: kickoffTeam === "home" ? "away" : "home",
            kickoffTeam: kickoffTeam,
            isSelected: true,
          });
        } else if (currentGame?.base?.status === "scheduled") {
          // Show selection modal for new games
          setTeamSelection((prev) => ({
            ...prev,
            showSelection: true,
          }));
        }
      } catch (error) {
        console.error("❌ Failed to fetch team names:", error);
        setTeamNames({
          home: "Home Team",
          away: "Away Team",
        });
      } finally {
        setLoadingTeamNames(false);
      }
    },
    [getTeamById, currentGame]
  );

  const handleTeamSelection = useCallback(
    async (selectedTeam) => {
      try {
        const attackingTeam = selectedTeam; // 'home' or 'away'
        const defendingTeam = selectedTeam === "home" ? "away" : "home";

        setTeamSelection({
          showSelection: false,
          attackingTeam,
          defendingTeam,
          kickoffTeam: attackingTeam,
          isSelected: true,
        });

        // Save team selection to game data
        if (gameId) {
          await updateGameProgress(gameId, {
            matchConfig: {
              kickoffTeam: attackingTeam,
              attackingTeam,
              defendingTeam,
              selectionTimestamp: new Date().toISOString(),
            },
          });
        }

        console.log(`✅ Team selected: ${attackingTeam} starts attacking`);
      } catch (error) {
        console.error("❌ Failed to save team selection:", error);
      }
    },
    [gameId, updateGameProgress]
  );

  const swapTeams = useCallback(async () => {
    if (!teamSelection.attackingTeam) return;

    const newAttackingTeam =
      teamSelection.attackingTeam === "home" ? "away" : "home";
    const newDefendingTeam =
      teamSelection.defendingTeam === "home" ? "away" : "home";

    setTeamSelection((prev) => ({
      ...prev,
      attackingTeam: newAttackingTeam,
      defendingTeam: newDefendingTeam,
    }));

    // Update in game data
    if (gameId) {
      await updateGameProgress(gameId, {
        matchConfig: {
          ...currentGame?.sport?.matchConfig,
          attackingTeam: newAttackingTeam,
          defendingTeam: newDefendingTeam,
          lastSwap: new Date().toISOString(),
        },
      });
    }

    console.log(`🔄 Teams swapped: ${newAttackingTeam} now attacking`);
  }, [teamSelection, gameId, updateGameProgress, currentGame]);

  useEffect(() => {
    if (currentGame?.base) {
      const getUserTeamId = () => {
        const stateTeamId = location.state?.currentTeamId;
        const storedTeamId = localStorage.getItem("currentTeamId");
        const urlParams = new URLSearchParams(window.location?.search);
        const urlTeamId = urlParams.get("teamId");

        return (
          stateTeamId || storedTeamId || urlTeamId || currentGame.base.teamId
        );
      };

      const userTeamId = getUserTeamId();
      setCurrentUserTeamId(userTeamId);

      const homeTeamId = currentGame.base.teamId;
      const awayTeamId = currentGame.base.opponentTeamId;

      // Check if user is home team or away team
      const userIsHome = userTeamId === homeTeamId;
      const userIsAway = userTeamId === awayTeamId;

      setUserTeam(userIsHome ? "home" : userIsAway ? "away" : "spectator");
      setIsHomeTeam(userIsHome);

      fetchTeamNames(homeTeamId, awayTeamId);
    }
  }, [currentGame, location, fetchTeamNames]);

  const getUserTeamName = () => {
    if (loadingTeamNames) return "Loading...";
    const baseName = isHomeTeam ? teamNames.home : teamNames.away;

    // Add role indicator if team selection is made
    if (teamSelection.isSelected && currentGame?.base?.status === "live") {
      const role =
        teamSelection.attackingTeam === (isHomeTeam ? "home" : "away")
          ? " 🟢"
          : " 🔴";
      return baseName + role;
    }

    return baseName;
  };

  const getOpponentTeamName = () => {
    if (loadingTeamNames) return "Loading...";
    const baseName = isHomeTeam ? teamNames.away : teamNames.home;

    // Add role indicator if team selection is made
    if (teamSelection.isSelected && currentGame?.base?.status === "live") {
      const role =
        teamSelection.attackingTeam === (isHomeTeam ? "away" : "home")
          ? " 🟢"
          : " 🔴";
      return baseName + role;
    }

    return baseName;
  };

  const getTeamRoles = () => {
    if (!teamSelection.isSelected)
      return { userRole: null, opponentRole: null };

    const userIsAttacking =
      teamSelection.attackingTeam === (isHomeTeam ? "home" : "away");
    return {
      userRole: userIsAttacking ? "Attacking" : "Defending",
      opponentRole: userIsAttacking ? "Defending" : "Attacking",
    };
  };

  const getUserTeamScore = () => {
    return isHomeTeam
      ? currentGame?.sport?.score?.home || 0
      : currentGame?.sport?.score?.away || 0;
  };

  const getOpponentTeamScore = () => {
    return isHomeTeam
      ? currentGame?.sport?.score?.away || 0
      : currentGame?.sport?.score?.home || 0;
  };

  const getUserTeamPlayers = () => {
    return isHomeTeam ? players.home : players.away;
  };

  const getOpponentTeamPlayers = () => {
    return isHomeTeam ? players.away : players.home;
  };

  const getUserTeamStats = () => {
    return isHomeTeam ? "home" : "away";
  };

  const getOpponentTeamStats = () => {
    return isHomeTeam ? "away" : "home";
  };

  const getTeamStatsByRole = (team) => {
    if (!teamSelection.isSelected || currentGame?.base?.sport !== "Football") {
      return sportConfig?.stats?.map((stat) => stat.type) || [];
    }

    const isAttacking = teamSelection.attackingTeam === team;

    if (isAttacking) {
      return [
        "goal",
        "assist",
        "shot",
        "shot_on_target",
        "pass",
        "cross",
        "through_ball",
        "free_kick",
        "corner",
      ];
    } else {
      return [
        "tackle",
        "interception",
        "clearance",
        "save",
        "block",
        "foul",
        "offside",
      ];
    }
  };

  useEffect(() => {
    if (currentGame?.base?.status === "finished" && !showCelebration) {
      const homeScore = currentGame?.sport?.score?.home || 0;
      const awayScore = currentGame?.sport?.score?.away || 0;

      let gameWinner = "draw";
      if (homeScore > awayScore) {
        gameWinner = "home";
      } else if (awayScore > homeScore) {
        gameWinner = "away";
      }

      setWinner(gameWinner);
      setFinalScore({ home: homeScore, away: awayScore });
      setShowCelebration(true);
      playCelebrationSound();
    }
  }, [currentGame?.base?.status, showCelebration]);

  const playCelebrationSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
    } catch (error) {
      console.log("Sound error:", error);
    }
  };

  // ====================
  // fetch game data
  // ========================
  useEffect(() => {
    if (gameId) {
      getGameById(gameId);
    }
  }, [gameId, getGameById]);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (currentGame?.base) {
        try {
          const homePlayers = await getPlayersByTeam(currentGame.base.teamId);
          const awayPlayers = await getPlayersByTeam(
            currentGame.base.opponentTeamId
          );

          setPlayers({
            home: homePlayers?.data?.players || homePlayers?.data || [],
            away: awayPlayers?.data?.players || awayPlayers?.data || [],
          });
        } catch (error) {
          console.error("Failed to fetch players:", error);
        }
      }
    };
    fetchPlayers();
  }, [currentGame, getPlayersByTeam]);

  const updateGameAnalytics = useCallback(() => {
    if (currentGame?.sport?.playerStats) {
      const analytics = calculateGameAnalytics(currentGame);
      if (analytics) {
        setGameAnalytics(analytics);
      }
    }
  }, [currentGame]);

  useEffect(() => {
    updateGameAnalytics();
  }, [updateGameAnalytics]);

  useEffect(() => {
    if (gameId && isConnected) {
      joinRoom(gameId);
    }

    return () => {
      if (gameId) {
        leaveRoom(gameId);
      }
    };
  }, [gameId, isConnected, joinRoom, leaveRoom]);

  const playAudioFromBuffer = useCallback((audioBuffer) => {
    try {
      console.log("🔊 Starting audio playback...");

      // Simple base64 to blob conversion
      const base64Data = audioBuffer;
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.oncanplaythrough = () => {
        console.log("✅ Audio ready to play");
        audio.play().catch((e) => {
          console.error("❌ Audio play failed:", e);
          // Show play button for user interaction
          showAudioPlayButton(url);
        });
      };

      audio.onerror = (e) => {
        console.error("❌ Audio error:", e);
      };

      audio.onended = () => {
        URL.revokeObjectURL(url);
        console.log("🔇 Audio finished");
      };
    } catch (error) {
      console.error("❌ Error playing audio:", error);
    }
  }, []);

  const showAudioPlayButton = (audioUrl) => {
    const existingButton = document.getElementById("audio-fallback-button");
    if (existingButton) existingButton.remove();

    const button = document.createElement("button");
    button.id = "audio-fallback-button";
    button.textContent = "🔊 Play Commentary";
    button.style.position = "fixed";
    button.style.top = "100px";
    button.style.right = "10px";
    button.style.zIndex = "10000";
    button.style.background = "#9AEA62";
    button.style.color = "black";
    button.style.padding = "10px";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    button.onclick = () => {
      const audio = new Audio(audioUrl);
      audio.play();
      button.remove();
    };

    document.body.appendChild(button);
  };

  useEffect(() => {
    if (!socket) return;

    const handleCommentaryUpdate = (data) => {
      if (commentaryEnabled && data.commentary) {
        setCurrentCommentary(data.commentary);
        setCommentaryHistory((prev) => [data, ...prev.slice(0, 9)]);

        setShowCommentaryToast(true);
        setTimeout(() => setShowCommentaryToast(false), 5000);

        if (
          data.audioData &&
          data.audioData.success &&
          data.audioData.audioBuffer
        ) {
          playAudioFromBuffer(data.audioData.audioBuffer);
        } else {
          console.log(
            "⚠️ [COMMENTARY] No valid audio data, using fallback TTS"
          );
          // Fallback: Use browser TTS
          if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(data.commentary);
            utterance.rate = 1.1;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
          }
        }
      }
    };

    socket.on("commentary-update", handleCommentaryUpdate);

    return () => {
      socket.off("commentary-update", handleCommentaryUpdate);
    };
  }, [socket, commentaryEnabled, playAudioFromBuffer]);

  // Refresh data
  useEffect(() => {
    if (!socket) return;

    const handleGameUpdate = (data) => {
      console.log("🎮 Game update received:", data);

      // Only refresh for important game state changes, not scores
      const shouldRefresh = [
        "game_started",
        "game_ended",
        "period_changed",
        "status_changed",
      ].includes(data.type);

      if (shouldRefresh) {
        refreshGame(gameId);
      }
    };

    const handleGameEvent = (data) => {
      console.log("⚡ Game event received:", data);

      // Also update local events list
      setLiveEvents((prev) => [
        {
          ...data,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 49),
      ]);
    };

    // Listen to all events
    socket.on("game-update", handleGameUpdate);
    socket.on("game-event", handleGameEvent);

    return () => {
      socket.off("game-update", handleGameUpdate);
      socket.off("game-event", handleGameEvent);
    };
  }, [socket, gameId, refreshGame]);

  // Game timer
  useEffect(() => {
    let interval;
    if (gameTime.isRunning && currentGame?.base?.status === "live") {
      interval = setInterval(() => {
        setGameTime((prev) => {
          const newSeconds = prev.seconds + 1;
          if (newSeconds >= 60) {
            return { ...prev, minutes: prev.minutes + 1, seconds: 0 };
          }
          return { ...prev, seconds: newSeconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameTime.isRunning, currentGame?.base?.status]);

  // Game control functions
  const handleStartGame = async () => {
    try {
      await startGame(gameId);
      setGameTime((prev) => ({ ...prev, isRunning: true }));
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  const handlePauseResume = () => {
    setGameTime((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleEndGame = async () => {
    try {
      const homeScore = currentGame?.sport?.score?.home || 0;
      const awayScore = currentGame?.sport?.score?.away || 0;

      const winner =
        homeScore > awayScore
          ? "home"
          : awayScore > homeScore
          ? "away"
          : "draw";

      await endGame(gameId, {
        winner,
        resultType: "completed",
        margin: Math.abs(homeScore - awayScore),
      });
      setGameTime((prev) => ({ ...prev, isRunning: false }));
    } catch (error) {
      console.error("Failed to end game:", error);
    }
  };

  // Handle player selection
  const handlePlayerSelect = (playerId) => {
    if (pendingAction) {
      executeAddStat(pendingAction.statType, pendingAction.team, playerId);
      setPendingAction(null);
    }
    setSelectedPlayer(playerId);
    setShowPlayerSelect(false);
  };

  // Get player name by ID
  const getPlayerName = (playerId, team) => {
    const teamPlayers = players[team] || [];
    const player = teamPlayers.find((p) => p._id === playerId);
    return player ? `${player.firstName} ${player.lastName}` : "Unknown Player";
  };

  // Handle stat addition with player selection
  const handleAddStat = async (statType, team) => {
    if (!currentGame) return;

    setPendingAction({ statType, team });
    setShowPlayerSelect(true);
  };

  // Execute the actual stat addition with AI commentary
// In your LiveGamePage component - update the executeAddStat function

const executeAddStat = async (statType, team, playerId) => {
  setIsUpdating(true);
  try {
    const sport = currentGame.base.sport;
    const player = players[team].find((p) => p._id === playerId);
    const playerName = player
      ? `${player.firstName} ${player.lastName}`
      : "Unknown Player";
    const teamName = team === "home" ? teamNames.home : teamNames.away;
    const teamRole =
      teamSelection.attackingTeam === team ? "attacking" : "defending";

    // Get current game state for baseball
    const currentInning = currentGame.sport?.currentInning || 1;
    const currentInningHalf = currentGame.sport?.inningHalf || "top";
    const currentOuts = currentGame.sport?.outs || 0;
    const currentBases = currentGame.sport?.bases || {
      first: false,
      second: false,
      third: false
    };
    const currentCount = currentGame.sport?.currentCount || {
      balls: 0,
      strikes: 0
    };

    let eventPayload = {
      eventType: statType,
      playerId: playerId,
      teamId:
        team === "home"
          ? currentGame.base.teamId
          : currentGame.base.opponentTeamId,
      playerName: playerName,
      teamName: teamName,
      homeTeamName: teamNames.home,
      awayTeamName: teamNames.away,
      gameTime: gameTime,
      teamRole: teamRole,
      teamSide: team,
    };

    // Add sport-specific required fields
    switch (sport) {
      case "Football":
        eventPayload.minute = gameTime.minutes;
        eventPayload.period = currentGame.sport?.currentPeriod || 1;
        break;
      case "Basketball":
        eventPayload.quarter = currentGame.sport?.currentQuarter || 1;
        eventPayload.gameTime = `${String(gameTime.minutes).padStart(
          2,
          "0"
        )}:${String(gameTime.seconds).padStart(2, "0")}`;
        if (
          statType === "point_2" ||
          statType === "point_3" ||
          statType === "free_throw"
        ) {
          eventPayload.points =
            sportConfig.stats.find((s) => s.type === statType)?.points || 1;
        }
        break;
      case "Baseball":
        // 🔥 FIX: Add ALL required baseball fields for ALL baseball events
        eventPayload.inning = currentInning;
        eventPayload.inningHalf = currentInningHalf;
        eventPayload.outs = currentOuts;
        
        // Add base states
        eventPayload.basesBefore = currentBases;
        eventPayload.basesAfter = currentBases; // Same as before for most events
        
        // Add count situation
        eventPayload.countBefore = currentCount;
        
        // Add runs for scoring events
        if (statType === "run" || statType === "home_run") {
          eventPayload.runs = 1;
        }
        
        // Add position for player stats
        const playerPosition = player?.position || "DH";
        eventPayload.position = playerPosition;
        eventPayload.jerseyNumber = player?.jerseyNumber || 0;
        break;
    }

    console.log("🎯 Adding game event with team role:", eventPayload);
    await addGameEvent(gameId, eventPayload);
    console.log("✅ Stat added successfully with team context");

    // Trigger overlay effect
    const statConfig = sportConfig.stats.find((s) => s.type === statType);
    if (statConfig) {
      triggerIconFlash(statConfig.icon);
    }
  } catch (error) {
    console.error("❌ Failed to add stat:", error);
  } finally {
    setIsUpdating(false);
  }
};

  // Trigger icon flash overlay
  const triggerIconFlash = (icon) => {
    setOverlayIcon(icon);
    setTimeout(() => {
      setOverlayIcon(null);
    }, 700);
  };

  // Toggle commentary
  const toggleCommentary = () => {
    setCommentaryEnabled(!commentaryEnabled);
  };

  // Get player stats for display
  const getPlayerStats = (team) => {
    if (!currentGame?.sport?.playerStats) return [];

    const teamId =
      team === "home"
        ? currentGame.base.teamId
        : currentGame.base.opponentTeamId;

    const teamStats = currentGame.sport.playerStats.filter(
      (stat) => stat.teamId === teamId
    );

    return teamStats;
  };

  // Get detailed scoring events with timestamps
  const getScoringEvents = () => {
    if (!currentGame?.sport?.events) return [];

    return currentGame.sport.events
      .filter(
        (event) =>
          event.eventType.includes("goal") ||
          event.eventType.includes("point") ||
          event.eventType.includes("run")
      )
      .map((event) => ({
        ...event,
        playerName: getPlayerName(
          event.playerId,
          event.teamId === currentGame.base.teamId ? "home" : "away"
        ),
        team: event.teamId === currentGame.base.teamId ? "home" : "away",
        teamName:
          event.teamId === currentGame.base.teamId
            ? teamNames.home
            : teamNames.away,
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Analytics display components
  const AnalyticsDisplay = () => {
    const sport = currentGame?.base?.sport;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiBarChart2 />
          Game Analytics
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {/* Your Team Analytics */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-lg font-bold text-green-400 mb-4">
              {getUserTeamName()} Analytics
            </h4>
            {renderAnalyticsBySport(sport, getUserTeamStats())}
          </div>

          {/* Opponent Team Analytics */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-lg font-bold text-red-400 mb-4">
              {getOpponentTeamName()} Analytics
            </h4>
            {renderAnalyticsBySport(sport, getOpponentTeamStats())}
          </div>
        </div>

        {/* Comparative Analytics */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiTrendingUp />
            Comparative Analysis
          </h4>
          {renderComparativeAnalytics(sport)}
        </div>
      </div>
    );
  };

  const renderAnalyticsBySport = (sport, team) => {
    const analytics = gameAnalytics[team] || {};

    switch (sport) {
      case "Basketball":
        return (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <StatItem label="Points" value={analytics.totalPoints} />
            <StatItem label="Rebounds" value={analytics.totalRebounds} />
            <StatItem label="Assists" value={analytics.totalAssists} />
            <StatItem label="Steals" value={analytics.totalSteals} />
            <StatItem label="Blocks" value={analytics.totalBlocks} />
            <StatItem label="Turnovers" value={analytics.totalTurnovers} />
            <StatItem label="FG%" value={analytics.fgPercentage} />
            <StatItem label="3P%" value={analytics.threePtPercentage} />
            <StatItem label="FT%" value={analytics.ftPercentage} />
            <StatItem label="Efficiency" value={analytics.efficiency} />
          </div>
        );
      case "Football":
        return (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <StatItem label="Goals" value={analytics.totalGoals} />
            <StatItem label="Assists" value={analytics.totalAssists} />
            <StatItem label="Shots" value={analytics.totalShots} />
            <StatItem
              label="Shots on Target"
              value={analytics.totalShotsOnTarget}
            />
            <StatItem label="Shot Accuracy" value={analytics.shotAccuracy} />
            <StatItem label="Passes" value={analytics.totalPasses} />
            <StatItem label="Tackles" value={analytics.totalTackles} />
            <StatItem label="Fouls" value={analytics.totalFouls} />
            <StatItem label="Corners" value={analytics.corners} />
            <StatItem label="Possession" value={analytics.possession} />
          </div>
        );
      case "Baseball":
        return (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <StatItem label="Runs" value={analytics.totalRuns} />
            <StatItem label="Hits" value={analytics.totalHits} />
            <StatItem label="Home Runs" value={analytics.totalHomeRuns} />
            <StatItem label="RBI" value={analytics.totalRBI} />
            <StatItem label="Batting Avg" value={analytics.battingAverage} />
            <StatItem label="Strikeouts" value={analytics.totalStrikeouts} />
            <StatItem label="Walks" value={analytics.totalWalks} />
            <StatItem label="Errors" value={analytics.totalErrors} />
            <StatItem
              label="Pitching K's"
              value={analytics.totalPitchingStrikeouts}
            />
            <StatItem label="ERA" value={analytics.era} />
          </div>
        );
      default:
        return <div>No analytics available</div>;
    }
  };

  const renderComparativeAnalytics = (sport) => {
    const home = gameAnalytics.home || {};
    const away = gameAnalytics.away || {};

    switch (sport) {
      case "Basketball":
        return (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <ComparativeStat
              label="Points"
              home={home.totalPoints}
              away={away.totalPoints}
            />
            <ComparativeStat
              label="Rebounds"
              home={home.totalRebounds}
              away={away.totalRebounds}
            />
            <ComparativeStat
              label="Assists"
              home={home.totalAssists}
              away={away.totalAssists}
            />
            <ComparativeStat
              label="Field Goal %"
              home={home.fgPercentage}
              away={away.fgPercentage}
            />
            <ComparativeStat
              label="3 Point %"
              home={home.threePtPercentage}
              away={away.threePtPercentage}
            />
            <ComparativeStat
              label="Free Throw %"
              home={home.ftPercentage}
              away={away.ftPercentage}
            />
          </div>
        );
      default:
        return <div>Comparative analytics not available for this sport</div>;
    }
  };

  const StatItem = ({ label, value }) => (
    <div className="flex justify-between items-center p-2 bg-black/20 rounded">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold">{value || 0}</span>
    </div>
  );

  const ComparativeStat = ({ label, home, away }) => {
    const homeVal = parseFloat(home) || 0;
    const awayVal = parseFloat(away) || 0;
    const maxVal = Math.max(homeVal, awayVal, 1);

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-blue-400">{getUserTeamName()}</span>
          <span className="text-gray-400">{label}</span>
          <span className="text-red-400">{getOpponentTeamName()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(homeVal / maxVal) * 100}%` }}
            />
          </div>
          <div className="text-xs font-semibold w-12 text-center">
            {homeVal}-{awayVal}
          </div>
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${(awayVal / maxVal) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Player selection modal
  const PlayerSelectionModal = () => {
    if (!showPlayerSelect || !pendingAction) return null;

    const teamPlayers = players[pendingAction.team] || [];
    const statConfig = sportConfig.stats.find(
      (s) => s.type === pendingAction.statType
    );

    const teamName =
      pendingAction.team === "home" ? teamNames.home : teamNames.away;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/40 backdrop-blur-3xl border border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4"
        >
          <h3 className="text-xl font-bold score mb-2">Select Player</h3>
          <p className="text-gray-400 mb-4">
            Choose a player for {statConfig?.name} ({teamName})
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {teamPlayers.map((player) => (
              <button
                key={player._id}
                onClick={() => handlePlayerSelect(player._id)}
                className="w-full bg-white/5 cursor-pointer hover:bg-white/10 p-3 rounded-lg text-left flex items-center gap-3 transition-colors"
              >
                <div className="bg-gray-300 p-2 rounded-full">
                  <FiUser size={20} className="text-gray-800" />
                </div>
                <div>
                  <div className="font-semibold">
                    {player.firstName} {player.lastName}
                  </div>
                  {player.position && (
                    <div className="text-gray-400 text-sm">
                      #{player.jerseyNumber} • {player.position}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowPlayerSelect(false)}
            className="w-full mt-4 bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    );
  };

  // Commentary Toast Component
  const CommentaryToast = () => {
    if (!showCommentaryToast || !currentCommentary) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4 max-w-md w-full mx-4 z-50"
      >
        <div className="flex items-start gap-3">
          <div className="bg-yellow-500/20 p-2 rounded-full">
            <FiVolume2 className="text-yellow-400" size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400 font-semibold text-sm">
                LIVE COMMENTARY
              </span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-white text-sm">{currentCommentary}</p>
          </div>
          <button
            onClick={() => setShowCommentaryToast(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      </motion.div>
    );
  };

  const TeamSelectionModal = () => {
    if (
      !teamSelection.showSelection ||
      currentGame?.base?.status !== "scheduled"
    )
      return null;

    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">⚽</div>
            <h2 className="text-2xl font-bold mb-2">Choose Starting Team</h2>
            <p className="text-gray-400">
              Which team will start with possession?
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleTeamSelection("home")}
              className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 p-4 rounded-xl transition-all hover:scale-105"
            >
              <div className="text-lg font-semibold">{teamNames.home}</div>
              <div className="text-sm text-green-400">Starts Attacking</div>
            </button>

            <button
              onClick={() => handleTeamSelection("away")}
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 p-4 rounded-xl transition-all hover:scale-105"
            >
              <div className="text-lg font-semibold">{teamNames.away}</div>
              <div className="text-sm text-blue-400">Starts Attacking</div>
            </button>

            <div className="text-center text-gray-500 text-sm mt-4">
              <p>You can swap teams later during the game</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const TeamRoleDisplay = () => {
    if (!teamSelection.isSelected || currentGame?.base?.status !== "live")
      return null;

    const roles = getTeamRoles();

    return (
      <div className="flex justify-center items-center gap-6 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Your Team</div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              roles.userRole === "Attacking"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {roles.userRole}
          </div>
        </div>

        <button
          onClick={swapTeams}
          className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full transition-colors"
          title="Swap attacking/defending teams"
        >
          <FiShuffle size={16} />
        </button>

        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Opponent</div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              roles.opponentRole === "Attacking"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {roles.opponentRole}
          </div>
        </div>
      </div>
    );
  };

  // Loading component
  if (isLoading && !currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9AEA62] border-t-transparent mb-4"></div>
          <p className="text-gray-400">Loading game data...</p>
        </div>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400">Game not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#9AEA62] text-gray-900 px-6 py-2 rounded-lg font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { base: baseGame, sport: sportGame } = currentGame;
  const scoringEvents = getScoringEvents();
  const teamRoles = getTeamRoles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Team Selection Modal */}
      <TeamSelectionModal />

      {/* Celebration Screen */}
      <CelebrationScreen
        showCelebration={showCelebration}
        setShowCelebration={setShowCelebration}
        winner={winner}
        finalScore={finalScore}
        teamNames={teamNames}
        teamId={currentUserTeamId}
      />

      {/* Commentary Toast */}
      <CommentaryToast />

      {/* Icon Overlay */}
      <AnimatePresence>
        {overlayIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-40"
          >
            <div className="text-8xl text-yellow-400 bg-black/50 rounded-full p-8 backdrop-blur-sm">
              {overlayIcon}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-black/50 border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex score items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiArrowLeft />
                Back
              </button>
              <div className="bungee hidden lg:block">
                <h1 className="text-2xl font-bold">Live Game</h1>
                <p className="text-gray-400 text-sm">
                  {baseGame.sport} • {baseGame.venue}
                </p>
              </div>
            </div>

            <div className="flex bungee items-center gap-4">
              {/* Team Role Display */}
              {teamSelection.isSelected && baseGame.status === "live" && (
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      teamRoles.userRole === "Attacking"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm">{teamRoles.userRole}</span>
                </div>
              )}

              {/* Commentary Toggle */}
              <button
                onClick={toggleCommentary}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  commentaryEnabled
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                }`}
              >
                {commentaryEnabled ? <FiVolume2 /> : <FiVolumeX />}
                <span className="text-sm">
                  {commentaryEnabled ? "Commentary ON" : "Commentary OFF"}
                </span>
              </button>

              <div
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  baseGame.status === "live"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : baseGame.status === "finished"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                }`}
              >
                {baseGame.status === "live"
                  ? "🔴 LIVE"
                  : baseGame.status === "finished"
                  ? "🏁 FINISHED"
                  : "⏳ SCHEDULED"}
              </div>

              <div className="flex score items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                <FiClock className="text-gray-400" />
                <span className="">
                  {String(gameTime.minutes).padStart(2, "0")}:
                  {String(gameTime.seconds).padStart(2, "0")}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-400">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Team Role Display */}
        <TeamRoleDisplay />

        {/* Scoreboard */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10 mb-6">
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Your Team - Always on left */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h2 className="text-4xl scorenames font-bold">
                  {getUserTeamName()}
                </h2>
              </div>
              <div className="text-[90px] score font-extrabold text-white">
                {getUserTeamScore()}
              </div>
            </div>

            {/* Game Info - Always in middle */}
            <div className="text-center">
              <div className="text-6xl mb-4">
                {baseGame.sport === "Football" && "⚽"}
                {baseGame.sport === "Basketball" && "🏀"}
                {baseGame.sport === "Baseball" && "⚾"}
              </div>
              <div className="text-xl scorenames font-bold mb-2">
                {baseGame.sport}
              </div>
              <div className="text-gray-400 scorenames text-sm">
                {sportConfig.periodName}{" "}
                {sportGame?.currentPeriod ||
                  sportGame?.currentQuarter ||
                  sportGame?.currentInning ||
                  1}
              </div>

              {/* Game Controls - Only show if user is home team */}
              {baseGame.status === "scheduled" &&
                isHomeTeam &&
                !teamSelection.showSelection && (
                  <button
                    onClick={handleStartGame}
                    disabled={isLoading}
                    className="mt-4 bg-[#9AEA62] hover:bg-green-500 text-gray-900 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                  >
                    <FiPlay className="inline mr-2" />
                    Start Game
                  </button>
                )}

              {baseGame.status === "live" && isHomeTeam && (
                <div className="flex gap-2 justify-center mt-4">
                  <button
                    onClick={handlePauseResume}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    {gameTime.isRunning ? <FiPause /> : <FiPlay />}
                  </button>
                  <button
                    onClick={swapTeams}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                    title="Swap attacking/defending teams"
                  >
                    <FiShuffle />
                  </button>
                  <button
                    onClick={handleEndGame}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    <FiSquare />
                  </button>
                </div>
              )}

              {baseGame.status === "finished" && (
                <button
                  onClick={() => setShowCelebration(true)}
                  className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 justify-center"
                >
                  View Celebration
                </button>
              )}
            </div>

            {/* Opponent Team */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h2 className="text-4xl scorenames font-bold">
                  {getOpponentTeamName()}
                </h2>
              </div>
              <div className="text-[90px] score font-extrabold text-white">
                {getOpponentTeamScore()}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bungee gap-4 mb-6 overflow-x-auto">
          {["stats", "analytics", "scoring", "events", "players"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#9AEA62] text-gray-900"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br score from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
          <AnimatePresence mode="wait">
            {/* Stats Tab */}
            {activeTab === "stats" && baseGame.status === "live" && (
              <StatsTab
                baseGame={baseGame}
                sportConfig={sportConfig}
                isUpdating={isUpdating}
                handleAddStat={handleAddStat}
                getUserTeamName={getUserTeamName}
                getUserTeamStats={getUserTeamStats}
                getOpponentTeamName={getOpponentTeamName}
                getOpponentTeamStats={getOpponentTeamStats}
                overlayIcon={overlayIcon}
                teamSelection={teamSelection} 
                getTeamStatsByRole={getTeamStatsByRole} 
                currentAnalytics={gameAnalytics}
              />
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <AnalyticsTab
                AnalyticsDisplay={AnalyticsDisplay}
                gameAnalytics={gameAnalytics}
                currentGame={currentGame}
                teamNames={teamNames}
                getUserTeamName={getUserTeamName}
                getOpponentTeamName={getOpponentTeamName}
                getUserTeamStats={getUserTeamStats}
                getOpponentTeamStats={getOpponentTeamStats}
              />
            )}

            {/* Scoring Tab */}
            {activeTab === "scoring" && (
              <ScoringTab
                scoringEvents={scoringEvents}
                baseGame={baseGame}
                teamNames={teamNames}
              />
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <EventsTab
                liveEvents={liveEvents}
                currentGame={currentGame}
                teamNames={teamNames}
                commentaryHistory={commentaryHistory}
              />
            )}

            {/* Players Tab */}
            {activeTab === "players" && (
              <PlayersTab
                getUserTeamName={getUserTeamName}
                getUserTeamPlayers={getUserTeamPlayers}
                getPlayerStats={getPlayerStats}
                getUserTeamStats={getUserTeamStats}
                getOpponentTeamName={getOpponentTeamName}
                getOpponentTeamPlayers={getOpponentTeamPlayers}
                getOpponentTeamStats={getOpponentTeamStats}
                teamSelection={teamSelection} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Player Selection Modal */}
      <PlayerSelectionModal />

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-w-sm">
          <p className="text-red-400">{error}</p>
          <button
            onClick={clearError}
            className="text-red-400/80 text-sm mt-1 hover:text-red-300"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveGamePage;
