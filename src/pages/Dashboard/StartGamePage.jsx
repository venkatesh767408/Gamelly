import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPlay, 
  FiClock, 
  FiUsers, 
  FiMapPin, 
  FiCalendar,
  FiAward,
  FiSettings,
  FiArrowLeft,
  FiPlus
} from "react-icons/fi";
import { useGame } from "../../hooks/useGame";
import { useCreateTeam } from "../../hooks/useCreateTeam";
import { getSpecificOpponentTeamAPI } from "../../services/createteam-api";
import { format } from 'date-fns';

const StartGamePage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  
  const { 
    createGame, 
    startGame, 
    startAndJoinGame,
    startSharedGame, // ✅ NEW: Use shared game function
    currentGame, 
    isLoading, 
    error,
    clearError,
    clearCurrentGame
  } = useGame();
  
  const { 
    team, 
    getTeamById, 
    isLoading: teamLoading 
  } = useCreateTeam();

  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [opponentDetails, setOpponentDetails] = useState({});
  const [gameSettings, setGameSettings] = useState({
    venue: "",
    startTime: new Date(),
    officials: [""],
    description: ""
  });
  const [step, setStep] = useState(1);
  const [creatingGame, setCreatingGame] = useState(false);
  const [loadingOpponents, setLoadingOpponents] = useState(false);

  // Sports configuration
  const sportConfigs = {
    Football: {
      duration: 90,
      periods: 2,
      periodName: "half",
      icon: "⚽",
      color: "from-brown-500 to-amber-500"
    },
    Baseball: {
      duration: 180,
      periods: 9,
      periodName: "inning",
      icon: "⚾",
      color: "from-blue-600 to-indigo-500"
    },
    Basketball: {
      duration: 48,
      periods: 4,
      periodName: "quarter",
      icon: "🏀",
      color: "from-orange-500 to-red-500"
    }
  };

  // Fetch team data
  useEffect(() => {
    if (teamId) {
      getTeamById(teamId);
    }
  }, [teamId, getTeamById]);

  // Fetch opponent details when team is loaded
  useEffect(() => {
    const fetchOpponentDetails = async () => {
      if (!team || !team.opponents || team.opponents.length === 0) {
        return;
      }

      setLoadingOpponents(true);
      const detailsMap = {};

      try {
        for (const opponent of team.opponents) {
          const opponentId = opponent.opponentTeamId;
          
          try {
            const response = await getSpecificOpponentTeamAPI(opponentId);
            
            if (response && response.data) {
              detailsMap[opponentId] = response.data;
            }
          } catch (error) {
            console.error(`Failed to fetch opponent ${opponentId}:`, error);
            detailsMap[opponentId] = {
              _id: opponentId,
              teamName: "Unknown Team",
              sport: "Unknown",
              teamType: "Unknown"
            };
          }
        }

        setOpponentDetails(detailsMap);
      } catch (error) {
        console.error("Error in fetchOpponentDetails:", error);
      } finally {
        setLoadingOpponents(false);
      }
    };

    fetchOpponentDetails();
  }, [team]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
      clearCurrentGame();
    };
  }, [clearError, clearCurrentGame]);

  // Get current sport configuration
  const getSportConfig = (sportName) => {
    return sportConfigs[sportName] || {
      duration: 90,
      periods: 2,
      periodName: "period",
      icon: "🏆",
      color: "from-gray-500 to-gray-700"
    };
  };

  // Handle opponent selection
  const handleSelectOpponent = (opponent) => {
    const opponentDetail = opponentDetails[opponent.opponentTeamId] || opponent.details;
    setSelectedOpponent(opponentDetail);
    setStep(2);
    
    // Pre-fill venue if available
    if (team?.location) {
      setGameSettings(prev => ({
        ...prev,
        venue: `${team.location} Field`
      }));
    }
  };

  // Handle game configuration
  const handleGameConfig = (field, value) => {
    setGameSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add official
  const addOfficial = () => {
    setGameSettings(prev => ({
      ...prev,
      officials: [...prev.officials, ""]
    }));
  };

  // Remove official
  const removeOfficial = (index) => {
    setGameSettings(prev => ({
      ...prev,
      officials: prev.officials.filter((_, i) => i !== index)
    }));
  };

  // Update official
  const updateOfficial = (index, value) => {
    const newOfficials = [...gameSettings.officials];
    newOfficials[index] = value;
    setGameSettings(prev => ({
      ...prev,
      officials: newOfficials
    }));
  };

const handleStartGame = async () => {
  if (!team || !selectedOpponent) return;

  setCreatingGame(true);
  clearError();
  
  try {
    const officials = gameSettings.officials.filter(official => official.trim() !== "");

    console.log("🎮 Starting SHARED game between teams:", {
      teamId: team._id,
      opponentId: selectedOpponent._id,
      sport: team.sport
    });

    // ✅ Use the shared game function
    const gameId = await startSharedGame(
      team._id,
      selectedOpponent._id,
      team.sport,
      gameSettings.venue || `${team.location} Field`
    );

    console.log("✅ Shared game started successfully, ID:", gameId);
    
    // Store current team ID
    localStorage.setItem('currentTeamId', team._id);
    
    navigate(`/game/${gameId}/live`, { 
      state: { currentTeamId: team._id } 
    });

  } catch (error) {
    console.error("❌ Failed to start shared game:", error);
  } finally {
    setCreatingGame(false);
  }
};

const handleQuickStart = async (opponent) => {
  if (!team || !opponent) return;

  setCreatingGame(true);
  clearError();
  
  try {
    const opponentDetail = opponentDetails[opponent.opponentTeamId] || opponent.details;
    
    console.log("🎮 Quick starting SHARED game:", {
      teamId: team._id,
      opponentId: opponentDetail._id,
      sport: team.sport
    });

    // ✅ Use the shared game function
    const gameId = await startSharedGame(
      team._id,
      opponentDetail._id,
      team.sport,
      `${team.location} Field`
    );

    console.log("✅ Quick start successful, game ID:", gameId);
    
    // Store current team ID
    localStorage.setItem('currentTeamId', team._id);
    
    navigate(`/game/${gameId}/live`, { 
      state: { currentTeamId: team._id } 
    });

  } catch (error) {
    console.error("❌ Quick start failed:", error);
  } finally {
    setCreatingGame(false);
  }
};



  // Loading component
  const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9AEA62] border-t-transparent mb-4"></div>
      <p className="text-gray-400">{message}</p>
    </div>
  );

  // Get opponents with details
  const getOpponentsWithDetails = () => {
    if (!team || !team.opponents) return [];

    return team.opponents
      .map((opponent) => {
        const opponentId = opponent.opponentTeamId;
        const details = opponentDetails[opponentId];

        if (details) {
          return {
            ...opponent,
            details: {
              _id: opponentId,
              teamName: details.teamName || "Unknown Team",
              sport: details.sport || "Unknown Sport",
              teamType: details.teamType || "Unknown Type",
              location: details.location || "Unknown Location"
            }
          };
        }

        return {
          ...opponent,
          details: {
            _id: opponentId,
            teamName: "Loading...",
            sport: "Loading...",
            teamType: "Loading..."
          }
        };
      })
      .filter((opp) => opp.details._id);
  };

  // Step 1: Select Opponent
  const RenderOpponentSelection = () => {
    const opponents = getOpponentsWithDetails();

    if (loadingOpponents) {
      return <LoadingSpinner message="Loading opponents..." />;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Select Opponent
          </h2>
          <p className="text-gray-400">
            Choose which team you want to play against
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opponents.map((opponent, index) => (
            <motion.div
              key={opponent.opponentTeamId || index}
              className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-[#9AEA62] transition-all duration-300 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectOpponent(opponent)}
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  🏆
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {opponent.details.teamName}
                </h3>
                <p className="text-gray-400 text-sm capitalize">
                  {team.sport} • {opponent.details.teamType}
                </p>
                {opponent.details.location && (
                  <p className="text-gray-500 text-sm mt-1">
                    📍 {opponent.details.location}
                  </p>
                )}
                
                {/* Quick Start Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickStart(opponent);
                  }}
                  className="mt-4 w-full bg-[#9AEA62] text-gray-900 py-2 px-4 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlay />
                  Quick Start
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {opponents.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-xl font-bold text-gray-300 mb-2">
              No opponents available
            </p>
            <p className="text-gray-400">
              Add opponents to your team first to start a game
            </p>
            <button
              onClick={() => navigate(`/team/${teamId}/opponents`)}
              className="mt-4 bg-[#9AEA62] text-gray-900 px-6 py-2 rounded-lg font-semibold"
            >
              Add Opponents
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  // Step 2: Game Configuration
  const RenderGameConfiguration = () => {
    const sportConfig = getSportConfig(team.sport);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Game Configuration
          </h2>
          <p className="text-gray-400">
            Configure settings for your {team.sport} game
          </p>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
          {/* Teams Info */}
          <div className="mb-6 p-4 bg-black/20 rounded-lg">
            <h4 className="text-lg font-bold text-white mb-3">Matchup</h4>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="font-semibold text-blue-400">{team.teamName}</div>
                <div className="text-sm text-gray-400">Home</div>
              </div>
              <div className="text-2xl font-bold text-gray-300">VS</div>
              <div className="text-center">
                <div className="font-semibold text-red-400">
                  {selectedOpponent?.teamName || "Opponent"}
                </div>
                <div className="text-sm text-gray-400">Away</div>
              </div>
            </div>
          </div>

          {/* Sport Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-black/20 rounded-lg">
            <div className="text-3xl">{sportConfig.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-white">{team.sport}</h3>
              <p className="text-gray-400 text-sm">
                {sportConfig.periods} {sportConfig.periodName}s • {sportConfig.duration} minutes
              </p>
            </div>
          </div>

          {/* Venue */}
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 text-white font-semibold">
              <FiMapPin />
              Venue
            </label>
            <input
              type="text"
              value={gameSettings.venue}
              onChange={(e) => handleGameConfig('venue', e.target.value)}
              placeholder="Enter game venue..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#9AEA62] transition-colors"
            />
          </div>

          {/* Start Time */}
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 text-white font-semibold">
              <FiCalendar />
              Start Time
            </label>
            <input
              type="datetime-local"
              value={format(gameSettings.startTime, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => handleGameConfig('startTime', new Date(e.target.value))}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9AEA62] transition-colors"
            />
          </div>

          {/* Officials */}
          <div className="space-y-3 mb-4">
            <label className="flex items-center gap-2 text-white font-semibold">
              <FiUsers />
              Officials (Optional)
            </label>
            {gameSettings.officials.map((official, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={official}
                  onChange={(e) => updateOfficial(index, e.target.value)}
                  placeholder={`Official ${index + 1} name...`}
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#9AEA62] transition-colors"
                />
                {gameSettings.officials.length > 1 && (
                  <button
                    onClick={() => removeOfficial(index)}
                    className="bg-red-500/20 text-red-400 px-3 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOfficial}
              className="text-[#9AEA62] hover:text-green-400 transition-colors flex items-center gap-2"
            >
              <FiPlus />
              Add Official
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white font-semibold">
              <FiAward />
              Description (Optional)
            </label>
            <textarea
              value={gameSettings.description}
              onChange={(e) => handleGameConfig('description', e.target.value)}
              placeholder="Add any notes about this game..."
              rows="3"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#9AEA62] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <FiArrowLeft />
            Back
          </button>
          <button
            onClick={() => setStep(3)}
            disabled={!gameSettings.venue}
            className="flex items-center gap-2 bg-[#9AEA62] hover:bg-green-500 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlay />
            Review & Start
          </button>
        </div>
      </motion.div>
    );
  };

  // Step 3: Review and Start
  const RenderReviewAndStart = () => {
    const sportConfig = getSportConfig(team.sport);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Review Game
          </h2>
          <p className="text-gray-400">
            Confirm settings and start your game
          </p>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
          {/* Teams */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center p-4 bg-black/20 rounded-lg">
              <h3 className="font-bold text-white text-lg mb-2">{team.teamName}</h3>
              <p className="text-gray-400 text-sm">Home Team</p>
              <p className="text-gray-500 text-xs mt-1">{team.sport}</p>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg">
              <h3 className="font-bold text-white text-lg mb-2">
                {selectedOpponent?.teamName || "Opponent"}
              </h3>
              <p className="text-gray-400 text-sm">Away Team</p>
              <p className="text-gray-500 text-xs mt-1">{selectedOpponent?.sport || team.sport}</p>
            </div>
          </div>

          {/* Game Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
              <span className="text-gray-400">Sport</span>
              <span className="text-white font-semibold flex items-center gap-2">
                {sportConfig.icon} {team.sport}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
              <span className="text-gray-400">Venue</span>
              <span className="text-white font-semibold">{gameSettings.venue}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
              <span className="text-gray-400">Start Time</span>
              <span className="text-white font-semibold">
                {format(gameSettings.startTime, 'MMM d, yyyy h:mm a')}
              </span>
            </div>
            
            {gameSettings.officials.filter(o => o.trim()).length > 0 && (
              <div className="p-3 bg-black/20 rounded-lg">
                <span className="text-gray-400 block mb-2">Officials</span>
                <div className="space-y-1">
                  {gameSettings.officials.filter(o => o.trim()).map((official, index) => (
                    <div key={index} className="text-white text-sm">• {official}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <FiArrowLeft />
            Back
          </button>
          <button
            onClick={handleStartGame}
            disabled={creatingGame}
            className="flex items-center gap-2 bg-[#9AEA62] hover:bg-green-500 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingGame ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
                Starting Game...
              </>
            ) : (
              <>
                <FiPlay />
                Start Game Now
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  if (teamLoading || loadingOpponents) {
    return <LoadingSpinner message="Loading team data..." />;
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-400">Team not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <FiArrowLeft />
              Back
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Start New Game
            </h1>
            <p className="text-gray-400 mt-2">
              {team.teamName} • {team.sport}
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center gap-2 ${
                  step >= stepNumber ? 'text-[#9AEA62]' : 'text-gray-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= stepNumber
                      ? 'bg-[#9AEA62] border-[#9AEA62] text-gray-900'
                      : 'border-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-8 h-0.5 ${
                      step > stepNumber ? 'bg-[#9AEA62]' : 'bg-gray-500'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && <RenderOpponentSelection key="step1" />}
          {step === 2 && <RenderGameConfiguration key="step2" />}
          {step === 3 && <RenderReviewAndStart key="step3" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StartGamePage;
