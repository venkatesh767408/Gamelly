import { useState, useEffect, useMemo, useRef } from "react";
import { useCreateTeam } from "../../hooks/useCreateTeam";
import { useCreatePlayer } from "../../hooks/useCreatePlayer";
import { useSchedule } from "../../hooks/useSchedule";
import { getSpecificOpponentTeamAPI } from "../../services/createteam-api";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../hooks/useGame";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiCalendar,
  FiPlay,
  FiUser,
} from "react-icons/fi";
import { format } from "date-fns";
import AddEventModal from "../../components/Models/AddEventModel";
import { useNavigate } from "react-router-dom";
import { GiTrophy } from "react-icons/gi";

const TeamVsTeamPage = ({ teamId, teamData }) => {
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [opponentPlayers, setOpponentPlayers] = useState({});
  const [currentTeamPlayers, setCurrentTeamPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState({});
  const [opponentDetails, setOpponentDetails] = useState({});
  const [loadingOpponents, setLoadingOpponents] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [startingGame, setStartingGame] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set()); // Track failed image loads

  const { team, getTeamById, isLoading, error } = useCreateTeam();
  const { getPlayersByTeam } = useCreatePlayer();
  const {
    schedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesByTeam,
    isLoading: scheduleLoading,
  } = useSchedule();


  const { startSharedGame } = useGame();
  const fetchedOpponentsRef = useRef(new Set());
  const navigate = useNavigate();

  // Sports icons mapping
  const sports = [
    {
      name: "Basketball",
      icon: "/bb.svg",
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Softball",
      icon: "/g2.svg",
      color: "from-green-500 to-emerald-500",
    },
    { name: "Ice Hockey", icon: "/g3.svg", color: "from-blue-500 to-cyan-500" },
    { name: "Bowling", icon: "/g4.svg", color: "from-purple-500 to-pink-500" },
    { name: "Football", icon: "/g5.svg", color: "from-brown-500 to-amber-500" },
    {
      name: "Tennis & Raquetball",
      icon: "/g6.svg",
      color: "from-lime-500 to-green-500",
    },
    {
      name: "Cheerleading",
      icon: "/g7.svg",
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Field Hockey",
      icon: "/g8.svg",
      color: "from-teal-500 to-blue-500",
    },
    { name: "Soccer", icon: "/g9.svg", color: "from-emerald-500 to-green-500" },
    {
      name: "Volleyball",
      icon: "/g10.svg",
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Baseball",
      icon: "/g11.svg",
      color: "from-blue-600 to-indigo-500",
    },
    { name: "Swimming", icon: "/g12.svg", color: "from-cyan-500 to-blue-500" },
  ];

  // Get sport data
  const getSportData = (sportName) => {
    const sport = sports.find((s) => s.name === sportName);
    return (
      sport || {
        name: sportName,
        icon: "/default-team-logo.png",
        color: "from-gray-500 to-gray-700",
      }
    );
  };

  // Get team logo - fallback to sport icon if no team logo
  const getTeamLogo = (teamData) => {
    if (teamData?.teamlogo) {
      return teamData.teamlogo;
    }
    const sportData = getSportData(teamData?.sport);
    return sportData.icon;
  };

  // Handle image load errors
  const handleImageError = (imageId) => {
    setFailedImages(prev => new Set([...prev, imageId]));
  };

  // Check if image failed to load
  const hasImageFailed = (imageId) => {
    return failedImages.has(imageId);
  };

  // Fetch current team data
  useEffect(() => {
    if (teamId) {
      console.log("🔄 Fetching team data for:", teamId);
      getTeamById(teamId);
    }
  }, [getTeamById, teamId]);

  // Fetch schedules when team is loaded
  useEffect(() => {
    if (teamId) {
      getSchedulesByTeam(teamId);
    }
  }, [teamId, getSchedulesByTeam]);

  useEffect(() => {
    const fetchOpponentDetails = async () => {
      if (!team || !team.opponents || team.opponents.length === 0) {
        return;
      }

      const opponentsToFetch = team.opponents.filter(
        (opponent) => !fetchedOpponentsRef.current.has(opponent.opponentTeamId)
      );

      if (opponentsToFetch.length === 0) {
        return;
      }

      console.log("🔄 Fetching details for new opponents:", opponentsToFetch);
      setLoadingOpponents(true);

      const detailsMap = {};

      try {
        for (const opponent of opponentsToFetch) {
          const opponentId = opponent.opponentTeamId;

          try {
            const response = await getSpecificOpponentTeamAPI(opponentId);

            if (response && response.data) {
              detailsMap[opponentId] = response.data;
              fetchedOpponentsRef.current.add(opponentId);
            }
          } catch (error) {
            console.error(`Failed to fetch opponent ${opponentId}:`, error);
            detailsMap[opponentId] = {
              _id: opponentId,
              teamName: "Error Loading",
              sport: "Unknown",
              location: "Unknown",
              teamType: "Unknown",
              ageGroup: "Unknown",
              season: "Unknown",
            };
            fetchedOpponentsRef.current.add(opponentId);
          }
        }

        if (Object.keys(detailsMap).length > 0) {
          setOpponentDetails((prev) => ({ ...prev, ...detailsMap }));
        }

        // Auto-select first opponent only once
        const firstOpponentId = team.opponents[0]?.opponentTeamId;
        if (firstOpponentId && !selectedOpponent) {
          const firstOpponentDetails =
            detailsMap[firstOpponentId] || opponentDetails[firstOpponentId];
          if (firstOpponentDetails) {
            setSelectedOpponent(firstOpponentDetails);
          }
        }
      } catch (error) {
        console.error("Error in fetchOpponentDetails:", error);
      } finally {
        setLoadingOpponents(false);
      }
    };

    fetchOpponentDetails();
  }, [team]);

  // Fetch players for current team and all opponents
  useEffect(() => {
    const fetchAllPlayers = async () => {
      if (!teamId || !team?.opponents) return;

      console.log("🔄 Fetching players for team and opponents...");

      try {
        // Fetch current team players
        setLoadingPlayers((prev) => ({ ...prev, current: true }));
        const currentTeamResponse = await getPlayersByTeam(teamId);
        const currentPlayers =
          currentTeamResponse?.data?.players || currentTeamResponse?.data || [];
        setCurrentTeamPlayers(
          Array.isArray(currentPlayers) ? currentPlayers : []
        );
        console.log("✅ Current team players:", currentPlayers);
        setLoadingPlayers((prev) => ({ ...prev, current: false }));

        // Fetch players for each opponent
        const playersMap = {};
        for (const opponent of team.opponents) {
          try {
            const opponentId = opponent.opponentTeamId;
            if (opponentId) {
              console.log("🔄 Fetching players for opponent:", opponentId);
              setLoadingPlayers((prev) => ({ ...prev, [opponentId]: true }));

              const opponentResponse = await getPlayersByTeam(opponentId);
              const opponentPlayersData =
                opponentResponse?.data?.players || opponentResponse?.data || [];
              playersMap[opponentId] = Array.isArray(opponentPlayersData)
                ? opponentPlayersData
                : [];

              console.log(
                `✅ Players for opponent ${opponentId}:`,
                playersMap[opponentId]
              );
              setLoadingPlayers((prev) => ({ ...prev, [opponentId]: false }));
            }
          } catch (error) {
            console.error(`❌ Failed to fetch players for opponent:`, error);
            const opponentId = opponent.opponentTeamId;
            playersMap[opponentId] = [];
            setLoadingPlayers((prev) => ({ ...prev, [opponentId]: false }));
          }
        }
        setOpponentPlayers(playersMap);
        console.log("✅ All opponent players:", playersMap);
      } catch (error) {
        console.error("❌ Failed to fetch players:", error);
        setLoadingPlayers((prev) => ({ ...prev, current: false }));
      }
    };

    fetchAllPlayers();
  }, [team, teamId, getPlayersByTeam]);

  // Schedule functions
  const handleAddEvent = async (eventData) => {
    try {
      console.log("🔄 Creating new schedule...");
      await createSchedule({
        ...eventData,
        teamId: teamId,
        opponentId: selectedOpponent?._id,
      });

      console.log("✅ Schedule created, refetching schedules...");
      await getSchedulesByTeam(teamId);

      setShowScheduleModal(false);
      console.log("✅ Modal closed and schedules refreshed");
    } catch (error) {
      console.error("❌ Failed to create schedule:", error);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      console.log("🔄 Updating schedule...");
      await updateSchedule(editingEvent._id, eventData);

      console.log("✅ Schedule updated, refetching schedules...");
      await getSchedulesByTeam(teamId);

      setEditingEvent(null);
      setShowScheduleModal(false);
      console.log("✅ Modal closed and schedules refreshed");
    } catch (error) {
      console.error("❌ Failed to update schedule:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      console.log("🔄 Deleting schedule...");
      await deleteSchedule(eventId);

      console.log("✅ Schedule deleted, refetching schedules...");
      await getSchedulesByTeam(teamId);

      setConfirmDeleteId(null);
      console.log("✅ Schedules refreshed after deletion");
    } catch (error) {
      console.error("❌ Failed to delete schedule:", error);
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case "game":
        return "bg-[#151E2E] border-blue-500 text-blue-800";
      case "practice":
        return "bg-[#151E2E] border-green-500 text-green-800";
      default:
        return "bg-[#151E2E] border-purple-500 text-purple-800";
    }
  };

  // Get opponents with details
  const opponents = useMemo(() => {
    if (!team || !team.opponents) return [];

    return team.opponents
      .map((opponent) => {
        const opponentId = opponent.opponentTeamId;
        const details = opponentDetails[opponentId];

        if (details) {
          return {
            _id: opponentId,
            teamName: details.teamName || "Unknown Team",
            sport: details.sport || "Unknown Sport",
            location: details.location || "Unknown Location",
            teamType: details.teamType || "Unknown Type",
            ageGroup: details.ageGroup || "Unknown Age",
            season: details.season || "Unknown Season",
            teamlogo: details.teamlogo, // Include team logo
          };
        }

        return {
          _id: opponentId,
          teamName: "Loading...",
          sport: "Loading...",
          location: "Loading...",
          teamType: "Loading...",
          ageGroup: "Loading...",
          season: "Loading...",
        };
      })
      .filter((opp) => opp._id);
  }, [team, opponentDetails]);

  // Updated PlayerCard component with real images
  const PlayerCard = ({ player, index }) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-blue-600",
      "bg-gradient-to-r from-green-500 to-green-600",
      "bg-gradient-to-r from-yellow-500 to-yellow-600",
      "bg-gradient-to-r from-red-500 to-red-600",
      "bg-gradient-to-r from-purple-500 to-purple-600",
      "bg-gradient-to-r from-pink-500 to-pink-600",
      "bg-gradient-to-r from-indigo-500 to-indigo-600",
      "bg-gradient-to-r from-teal-500 to-teal-600",
    ];
    const colorClass = colors[index % colors.length];
    const fullName = `${player.firstName || ''} ${player.lastName || ''}`.trim();
    const firstLetter = fullName ? fullName.charAt(0).toUpperCase() : "?";
    const playerImageId = player._id || player.id;

    return (
      <div className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200">
        {/* Player Avatar - Real image or fallback */}
        {player.playerimage && !hasImageFailed(playerImageId) ? (
          <img 
            src={player.playerimage}
            alt={fullName}
            className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg"
            onError={() => handleImageError(playerImageId)}
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/20`}
          >
            {firstLetter}
          </div>
        )}

        {/* Player Details in one line */}
        <div className="flex-1 flex items-center justify-between">
          {/* Player Name */}
          <div className="flex items-center gap-4">
            <h4 className="text-gray-300 font-bold truncate">
              {player.firstName?.charAt(0).toUpperCase() + player.firstName?.slice(1) || 'Unknown'}{" "}
              {player.lastName?.charAt(0).toUpperCase() + player.lastName?.slice(1) || ''}
            </h4>
          </div>

          <div>
            {player.position && (
              <span className="bg-black/30 text-gray-300 text-[17px] px-2 py-1 rounded border border-white/10">
                {player.position}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Team players list component
  const TeamPlayersList = ({ players = [] }) => {
    const safePlayers = Array.isArray(players) ? players : [];

    if (safePlayers.length === 0) {
      return (
        <div className="text-sm text-gray-400 italic bg-white/5 rounded-lg p-4 text-center">
          No players available
        </div>
      );
    }

    return (
      <div className="space-y-2 overflow-y-auto">
        {safePlayers.map((player, index) => (
          <PlayerCard
            key={player._id || player.id || index}
            player={player}
            index={index}
          />
        ))}
      </div>
    );
  };

  // Schedule Events Component
  const ScheduleEvents = () => {
    const safeSchedules = Array.isArray(schedules)
      ? schedules.filter((schedule) => schedule && typeof schedule === "object")
      : [];

    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiCalendar className="text-[#9AEA62]" />
            Upcoming Events
          </h3>
          <motion.button
            onClick={() => {
              setEditingEvent(null);
              setShowScheduleModal(true);
            }}
            className="flex items-center gap-2 bg-[#9AEA62] px-4 py-2 rounded-lg text-gray-900 font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus />
            <span>Add Event</span>
          </motion.button>
        </div>

        {scheduleLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : safeSchedules.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
            {safeSchedules.map((event) => {
              if (!event || typeof event !== "object") {
                return null;
              }

              return (
                <motion.div
                  key={event._id || event.id || Math.random()}
                  className={`border-l-4 rounded-lg p-4 relative overflow-hidden ${getEventColor(
                    event.eventType
                  )}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold capitalize">
                          {event.eventType || "event"}
                        </h3>
                        {event.repeats && event.repeats !== "Never" && (
                          <span className="text-xs bg-gray-800 px-2 py-1 rounded-full text-white">
                            {event.repeats}
                          </span>
                        )}
                      </div>
                      {event.title && (
                        <p className="text-gray-400">{event.title}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {event.startDate
                          ? format(
                              new Date(event.startDate),
                              "MMMM d, yyyy h:mm a"
                            )
                          : "Date not set"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {event.location || "Location not set"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {confirmDeleteId === event._id ? (
                        <div className="flex gap-1 bg-red-100 rounded-lg overflow-hidden border border-red-300">
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-2 text-red-600 hover:bg-red-200"
                            title="Confirm delete"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-2 text-gray-600 hover:bg-gray-200"
                            title="Cancel"
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setShowScheduleModal(true);
                            }}
                            className="p-2 text-white hover:bg-gray-800 rounded-lg"
                            title="Edit event"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(event._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            title="Delete event"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
            <FiCalendar className="text-6xl text-gray-400 mb-4" />
            <p className="font-bold text-xl text-gray-300 mt-4">
              No scheduled events yet
            </p>
            <p className="text-gray-400">Add your first event to get started</p>
          </div>
        )}
      </div>
    );
  };

  // Loading component
  const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9AEA62] border-t-transparent mb-4"></div>
      <p className="text-gray-400">{message}</p>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading team data..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-xl font-bold text-white mb-2">
            Error loading team data
          </p>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }


  const handleStartSharedGame = async () => {
  if (!team || !selectedOpponent) {
    console.error("❌ Missing team or opponent data");
    return;
  }

  setStartingGame(true);
  
  try {
    console.log("🎯 Starting shared game between teams:", {
      teamId: team._id,
      opponentId: selectedOpponent._id,
      sport: team.sport
    });

    const gameId = await startSharedGame(
      team._id,
      selectedOpponent._id,
      team.sport,
      `${team.location || 'Home'} Field`
    );

    console.log("✅ Shared game started successfully, ID:", gameId);
    
    // Store current team ID in localStorage for the LiveGamePage to use
    localStorage.setItem('currentTeamId', team._id);
    
    // Navigate with team ID in state
    navigate(`/game/${gameId}/live`, { 
      state: { currentTeamId: team._id } 
    });

  } catch (error) {
    console.error("❌ Failed to start shared game:", error);
  } finally {
    setStartingGame(false);
  }
};

  const currentTeamLogo = team ? getTeamLogo(team) : "/default-team-logo.png";
  const opponentTeamLogo = selectedOpponent ? getTeamLogo(selectedOpponent) : "/default-team-logo.png";




  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Your Opponents Section */}
        <div>
          {loadingOpponents ? (
            <LoadingSpinner message="Loading opponent details..." />
          ) : opponents.length === 0 ? (
            <div className="text-center flex flex-col items-center py-12 rounded-2xl border-1 border-gray-700">
              <GiTrophy size={70} className="flex items-center cursor-pointer hover:rotate-2 justify-center text-center"/>
              <p className="text-gray-400 text-[50px] uppercase font-extrabold mb-2">
                No opponents added yet
              </p>
              <p className="text-gray-500 font-semibold text-lg">
                Go to the Opponents page to add teams to your opponents list.
              </p>
            </div>
          ) : (
            <>
              {/* Selected Opponent Comparison */}
              {selectedOpponent && (
                <div className="rounded-2xl">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-4 bg-black/30 rounded-lg px-6 py-3 border border-white/10">
                      <h3 className="text-4xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {/* {team.teamName.charAt(0).toUpperCase() +
                          team.teamName.slice(1)}{" "} */}
                        <span className="text-[70px] ">Vs</span>{" "}
                        {/* {selectedOpponent.teamName.charAt(0).toUpperCase() +
                          selectedOpponent.teamName.slice(1)} */}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Your Team */}
                    <div className="relative bg-gradient-to-br from-white/5 to-white/5 rounded-2xl p-6 border border-gray-700  overflow-visible">
                      <div className="absolute -top-45 left-1/2 transform -translate-x-1/2">
                        <img
                          src={currentTeamLogo}
                          alt={`${team.teamName} logo`}
                          className="h-[300px] w-auto object-cover  drop-shadow-xl"
                          onError={(e) => {
                            e.target.src = "/default-team-logo.png";
                          }}
                        />
                      </div>


                      <h1 className="bg-red-700 text-white font-semibold text-[20px] w-fit px-10  py-1 rounded-r-full  rotate-90 absolute top-10  left-5  ">2026</h1>

                      <div className="text-center mt-24">
                        <h4 className="font-extrabold text-4xl text-gray-500 mb-3 uppercase">
                          {team.teamName}
                        </h4>

                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                          <span className="bg-white/10 px-3 py-1 rounded-sm text-sm border border-white/20">
                            {team.sport}
                          </span>
                          <span className="bg-white/10 px-3 py-1 rounded-sm text-sm border border-white/20">
                            {team.teamType}
                          </span>
                        </div>

                        {/* Players List */}
                        <div className="mb-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-700 h-[1px] w-full" />
                            <h5 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
                              <FiUser className="text-[#9AEA62]" />
                              <span className="font-semibold">Players</span>
                            </h5>
                            <div className="bg-gray-700 h-[1px] w-full" />
                          </div>

                          {loadingPlayers.current ? (
                            <div className="space-y-2">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg animate-pulse"
                                >
                                  <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                                  <div className="flex-1">
                                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <TeamPlayersList players={currentTeamPlayers} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Opponent Team */}
                    <div className="relative bg-gradient-to-br from-white/5 to-white/5 rounded-2xl p-6 border border-gray-700 overflow-visible">
                      <div className="absolute -top-45 left-1/2 transform -translate-x-1/2">
                        <img
                          src={opponentTeamLogo}
                          alt={`${selectedOpponent.teamName} logo`}
                          className="h-[300px] w-auto object-cover drop-shadow-xl"
                          onError={(e) => {
                            e.target.src = "/default-team-logo.png";
                          }}
                        />
                      </div>

                                            <h1 className="bg-red-700 text-white font-semibold text-[20px] w-fit px-10  py-1 rounded-r-full  rotate-90 absolute top-10  left-5  ">2026</h1>

                      <div className="text-center mt-24">
                        <h4 className="font-extrabold text-4xl text-gray-500 mb-3 uppercase">
                          {selectedOpponent.teamName}
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                          <span className="bg-white/10 px-3 py-1 rounded-sm text-sm border border-white/20">
                            {selectedOpponent.sport}
                          </span>
                          <span className="bg-white/10 px-3 py-1 rounded-sm text-sm border border-white/20">
                            {selectedOpponent.teamType}
                          </span>
                        </div>

                        {/* Players List */}
                        <div className="mb-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-700 h-[1px] w-full" />
                            <h5 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
                              <FiUser className="text-[#9AEA62]" />
                              <span className="font-semibold">Players</span>
                            </h5>
                            <div className="bg-gray-700 h-[1px] w-full" />
                          </div>
                          {loadingPlayers[selectedOpponent._id] ? (
                            <div className="space-y-2">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg animate-pulse"
                                >
                                  <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                                  <div className="flex-1">
                                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <TeamPlayersList
                              players={
                                opponentPlayers[selectedOpponent._id] || []
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Events Section */}
                  <ScheduleEvents />

                       <motion.button
                    onClick={handleStartSharedGame}
                    disabled={startingGame || !team || !selectedOpponent}
                    className="flex absolute top-5  right-5 items-center gap-2 bg-[#9AEA62] px-6 py-3 rounded-lg text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: startingGame ? 1 : 1.05 }}
                    whileTap={{ scale: startingGame ? 1 : 0.95 }}
                  >
                    {startingGame ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
                        <span>Starting...</span>
                      </>
                    ) : (
                      <>
                        <FiPlay />
                        <span>Start Game</span>
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <AddEventModal
            isOpen={showScheduleModal}
            onClose={() => {
              setShowScheduleModal(false);
              setEditingEvent(null);
            }}
            onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
            event={editingEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamVsTeamPage;