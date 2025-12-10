import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateTeam } from "../../hooks/useCreateTeam";
import { useCreatePlayer } from "../../hooks/useCreatePlayer";
import { useCreateStaff } from "../../hooks/useCreateStaff";
import { useSchedule } from "../../hooks/useSchedule";
import { IoAddSharp } from "react-icons/io5";
import {
  FiUsers,
  FiFlag,
  FiCalendar,
  FiBarChart2,
  FiPlay,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiStar,
  FiArrowRight,
  FiUser,
  FiPlus,
  FiMail,
} from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";
import AddPlayerModel from "../../components/Models/AddPlayerModel";
import AddStaffModel from "../../components/Models/AddStaffModel";

const MainPage = ({ teamId, teamData }) => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [nextGame, setNextGame] = useState(null);
  const [currentTeamPlayers, setCurrentTeamPlayers] = useState([]);
  const [teamStaff, setTeamStaff] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState({});
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const [teamStats, setTeamStats] = useState({
    totalPlayers: 0,
    totalGames: 0,
    wins: 0,
    losses: 0,
    upcomingMatches: 0,
  });

  // Modal states
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  const { team, getTeamById, isLoading, error } = useCreateTeam();
  const { getPlayersByTeam, createPlayer } = useCreatePlayer();
  const { getStaffByTeam, createStaff } = useCreateStaff();
  const { schedules, getSchedulesByTeam } = useSchedule();

  // Fetch team data only once when component mounts or teamId changes
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamId) return;

      console.log("🔄 Fetching team data for:", teamId);

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

        // Fetch staff members
        setLoadingStaff(true);
        const staffResponse = await getStaffByTeam(teamId);
        const staffData = staffResponse?.data || [];
        setTeamStaff(Array.isArray(staffData) ? staffData : []);
        console.log("✅ Team staff:", staffData);
        setLoadingStaff(false);

        // Fetch schedules
        await getSchedulesByTeam(teamId);
      } catch (error) {
        console.error("❌ Failed to fetch team data:", error);
        setLoadingPlayers((prev) => ({ ...prev, current: false }));
        setLoadingStaff(false);
      }
    };

    fetchTeamData();
  }, [teamId]); // Removed unnecessary dependencies

  // Process schedules to get next game and all upcoming events
  useEffect(() => {
    if (schedules && Array.isArray(schedules)) {
      const now = new Date();
      const upcoming = schedules
        .filter(schedule => {
          if (!schedule || !schedule.startDate) return false;
          const eventDate = new Date(schedule.startDate);
          return eventDate >= now;
        })
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      console.log("📅 All upcoming events:", upcoming); // Debug log
      
      // Find the next game (first game in the sorted list)
      const nextGameEvent = upcoming.find(event => 
        event.eventType === 'game'
      );

      // All upcoming events including the next game
      setNextGame(nextGameEvent || null);
      setUpcomingEvents(upcoming);

      // Debug: Check event types
      const eventTypes = upcoming.map(event => event.eventType);
      console.log("🎯 Event types found:", eventTypes);

      // Update team stats
      const gameEvents = upcoming.filter(event => event.eventType === 'game');
      setTeamStats(prev => ({
        ...prev,
        upcomingMatches: gameEvents.length
      }));

      // Update recent activity with actual events
      updateRecentActivity(upcoming);
    } else {
      console.log("❌ No schedules or schedules is not an array:", schedules);
    }
  }, [schedules]);

  // Update recent activity based on actual events and data
  const updateRecentActivity = useCallback((upcomingEvents = []) => {
    const now = new Date();
    const recentActivities = [];

    // Add recent games (from last 7 days)
    const recentGames = upcomingEvents.filter(event => {
      if (event.eventType !== 'game') return false;
      const eventDate = new Date(event.startDate);
      const diffTime = Math.abs(now - eventDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && eventDate < now;
    }).slice(0, 2);

    recentGames.forEach(game => {
      recentActivities.push({
        id: game._id,
        type: "game",
        title: `Game: ${game.title || 'Upcoming Match'}`,
        result: "Upcoming",
        time: getTimeAgo(game.startDate),
        icon: <GiTrophy className="text-green-400" />,
      });
    });

    // Add player additions if any
    if (currentTeamPlayers.length > 0) {
      const newPlayers = currentTeamPlayers.slice(-2); // Get last 2 players
      newPlayers.forEach(player => {
        recentActivities.push({
          id: `player-${player._id}`,
          type: "player",
          title: "New player added",
          description: `${player.firstName} ${player.lastName} joined the team`,
          time: "Recently",
          icon: <FiUsers className="text-blue-400" />,
        });
      });
    }

    // Add staff additions if any
    if (teamStaff.length > 0) {
      const newStaff = teamStaff.slice(-1); // Get last staff member
      newStaff.forEach(staff => {
        recentActivities.push({
          id: `staff-${staff._id}`,
          type: "staff",
          title: "Staff member added",
          description: `${staff.firstName} ${staff.lastName} joined as ${staff.role || 'staff'}`,
          time: "Recently",
          icon: <FiUser className="text-purple-400" />,
        });
      });
    }

    // Add upcoming practices
    const upcomingPractices = upcomingEvents.filter(event => 
      event.eventType === 'practice'
    ).slice(0, 2);

    upcomingPractices.forEach(practice => {
      recentActivities.push({
        id: practice._id,
        type: "practice",
        title: "Practice scheduled",
        description: `${practice.title || 'Team practice'} at ${formatTime(practice.startDate)}`,
        time: getTimeUntil(practice.startDate),
        icon: <FiCalendar className="text-orange-400" />,
      });
    });

    // Fill with mock data if not enough real activities
    if (recentActivities.length < 3) {
      const mockActivities = [
        {
          id: "mock-1",
          type: "game",
          title: "Game vs Lakers",
          result: "W 98-95",
          time: "2 hours ago",
          icon: <GiTrophy className="text-green-400" />,
        },
        {
          id: "mock-2",
          type: "player",
          title: "New player added",
          description: "Michael Jordan joined the team",
          time: "1 day ago",
          icon: <FiUsers className="text-blue-400" />,
        },
        {
          id: "mock-3",
          type: "practice",
          title: "Practice scheduled",
          description: "Team practice at Main Gym",
          time: "Tomorrow",
          icon: <FiCalendar className="text-purple-400" />,
        },
      ].slice(0, 3 - recentActivities.length);

      setRecentActivity([...recentActivities, ...mockActivities]);
    } else {
      setRecentActivity(recentActivities.slice(0, 5)); // Max 5 activities
    }
  }, [currentTeamPlayers, teamStaff]);

  // Helper function to format time
  const formatTime = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  // Helper function to get time ago
  const getTimeAgo = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return 'Last week';
  }, []);

  // Helper function to get time until
  const getTimeUntil = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return 'Next week';
  }, []);

  // Countdown timer for the next game - isolated in its own component
  const CountdownTimer = useMemo(() => {
    if (!nextGame || !nextGame.startDate) return null;

    return <LiveCountdown gameDate={nextGame.startDate} />;
  }, [nextGame]);

  // Format date for display - memoized to prevent recreation
  const formatEventDate = useCallback((dateString) => {
    if (!dateString) return 'Date not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }, []);

  // Handle adding player - memoized callback
  const handleAddPlayer = useCallback(async (formData) => {
    try {
      console.log("🔍 MainPage - Adding player with formData:", formData);

      const finalFormData = new FormData();

      // Copy all fields from the incoming FormData
      if (formData instanceof FormData) {
        for (let [key, value] of formData.entries()) {
          finalFormData.append(key, value);
        }
      } else {
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== undefined) {
            finalFormData.append(key, formData[key]);
          }
        });
      }

      // Add teamId
      finalFormData.append("teamId", teamId);

      console.log("🔍 MainPage - Final FormData for player:");
      for (let [key, value] of finalFormData.entries()) {
        console.log(`${key}:`, value);
      }

      await createPlayer(finalFormData);
      setShowAddPlayerModal(false);

      // Refresh players list
      if (teamId) {
        const currentTeamResponse = await getPlayersByTeam(teamId);
        const currentPlayers =
          currentTeamResponse?.data?.players || currentTeamResponse?.data || [];
        setCurrentTeamPlayers(Array.isArray(currentPlayers) ? currentPlayers : []);
      }
    } catch (error) {
      console.error("Failed to add player:", error);
    }
  }, [teamId, createPlayer, getPlayersByTeam]);

  // Handle adding staff - memoized callback
  const handleAddStaff = useCallback(async (staffData) => {
    try {
      const finalStaffData = {
        ...staffData,
        teamId: teamId,
      };

      await createStaff(finalStaffData);
      setShowAddStaffModal(false);

      // Refresh staff list
      if (teamId) {
        const staffResponse = await getStaffByTeam(teamId);
        const staffData = staffResponse?.data || [];
        setTeamStaff(Array.isArray(staffData) ? staffData : []);
      }
    } catch (error) {
      console.error("Failed to add staff:", error);
    }
  }, [teamId, createStaff, getStaffByTeam]);

  // Handle image load errors
  const handleImageError = useCallback((imageId) => {
    setFailedImages((prev) => new Set([...prev, imageId]));
  }, []);

  // Check if image failed to load
  const hasImageFailed = useCallback((imageId) => {
    return failedImages.has(imageId);
  }, [failedImages]);

  // Player Avatar Component - memoized
  const PlayerAvatar = useCallback(({ player, index }) => {
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
    const fullName = `${player.firstName || ""} ${
      player.lastName || ""
    }`.trim();
    const firstLetter = fullName ? fullName.charAt(0).toUpperCase() : "?";
    const playerImageId = player._id || player.id;

    return (
      <div
        className={`relative ${
          index !== 0 ? "-ml-4" : ""
        } transition-transform hover:scale-110 hover:z-20`}
        style={{ zIndex: 10 - index }}
      >
        {player.playerimage && !hasImageFailed(playerImageId) ? (
          <img
            src={player.playerimage}
            alt={fullName}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
            onError={() => handleImageError(playerImageId)}
            title={fullName}
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center text-white font-bold border-2 border-white shadow-lg`}
            title={fullName}
          >
            {firstLetter}
          </div>
        )}
      </div>
    );
  }, [hasImageFailed, handleImageError]);

  // Overlapping Avatars Component - memoized
  const OverlappingAvatars = useCallback(({ players = [], maxDisplay = 5 }) => {
    const safePlayers = Array.isArray(players) ? players : [];
    const playersToShow = safePlayers.slice(0, maxDisplay);
    const remainingCount = safePlayers.length - maxDisplay;

    if (safePlayers.length === 0) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="text-gray-400 text-sm italic">No players</div>
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <div className="flex ">
          {playersToShow.map((player, index) => (
            <PlayerAvatar
              key={player._id || player.id || index}
              player={player}
              index={index}
            />
          ))}
          {remainingCount > 0 && (
            <div
              className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-lg relative -ml-4"
              title={`${remainingCount} more players`}
            >
              +{remainingCount}
            </div>
          )}
        </div>
      </div>
    );
  }, [PlayerAvatar]);

  const QuickActionCard = useCallback(({ icon, title, description, action, color }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 group backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
    >
      <div
        className={`w-12 h-12 rounded-xl  ${color} flex items-center justify-center mb-4`}
      >
   {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="flex items-center text-[#9AEA62] text-sm font-medium">
        {action}
        <FiArrowRight className="ml-1" size={14} />
      </div>
    </motion.div>
  ), []);

  // Sports icons mapping - memoized
  const sports = useMemo(() => [
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
  ], []);

  // Get sport data - memoized
  const getSportData = useCallback((sportName) => {
    const sport = sports.find((s) => s.name === sportName);
    return (
      sport || {
        name: sportName,
        icon: "/default-team-logo.png",
        color: "from-gray-500 to-gray-700",
      }
    );
  }, [sports]);

  useEffect(() => {
    if (teamId) {
      console.log("🔄 Fetching team data for:", teamId);
      getTeamById(teamId);
    }
  }, [getTeamById, teamId]);

  const getTeamLogo = useCallback((teamData) => {
    if (teamData?.teamlogo) {
      return teamData.teamlogo;
    }
    const sportData = getSportData(teamData?.sport);
    return sportData.icon;
  }, [getSportData]);

  const currentTeamLogo = team ? getTeamLogo(team) : "/default-team-logo.png";
  
  // Team Details Card - memoized component
  const TeamDetailsCard = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 relative h-fit lg:w-[50%] w-full backdrop-blur-sm border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-full">
            <img
              src={currentTeamLogo}
              alt={`${team?.teamName} logo`}
              className="h-[50px] w-auto object-cover  drop-shadow-xl"
              onError={(e) => {
                e.target.src = "/default-team-logo.png";
              }}
            />
          </div>
          <div>
            <div className="text-2xl uppercase text-gray-500">
              {teamData?.teamName || "Your Team"}
            </div>
            <div className="text-gray-400 text-sm font-normal">
              {teamData?.sport || "Sport"} • {teamData?.location || "Location"}
            </div>
          </div>
        </h2>

        <div className="text-right">
          <div className="text-[#9AEA62] font-bold text-lg">
            {currentTeamPlayers.length} Players
          </div>
          <div className="text-gray-400 text-sm">Active Roster</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-3">Team Players</h3>
        <OverlappingAvatars players={currentTeamPlayers} maxDisplay={6} />
        {currentTeamPlayers.length === 0 && (
          <p className="text-gray-400 text-sm italic mt-3">
            No players added yet
          </p>
        )}
      </div>

      <div 
        className="absolute -top-5 right-5 border-4 border-gray-700 cursor-pointer bg-[#9AEA62] p-1 rounded-full hover:bg-green-500 transition-colors"
        onClick={() => setShowAddPlayerModal(true)}
      >
        <IoAddSharp size={30} className="text-gray-800" />
      </div>
    </motion.div>
  ), [currentTeamLogo, team, teamData, currentTeamPlayers, OverlappingAvatars]);

  // Staff Card - memoized component
  const StaffCard = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 relative backdrop-blur-sm lg:w-[50%] w-full border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-500 uppercase flex items-center gap-2">
          <div className="p-2 bg-gray-600 rounded-full">
            <FiUsers className="text-white" />
          </div>
          Team Staff
        </h2>
        <span className="text-gray-400 text-sm">
          {teamStaff.length} {teamStaff.length === 1 ? "member" : "members"}
        </span>
      </div>

      {loadingStaff ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9AEA62]"></div>
          <span className="ml-3 text-gray-400">Loading staff...</span>
        </div>
      ) : teamStaff.length > 0 ? (
        <>
          {/* Staff List */}
          <div className="space-y-4 mb-4">
            {teamStaff.map((staffMember) => (
              <div
                key={staffMember._id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br uppercase from-gray-600 flex items-center justify-center text-white font-semibold border-2 border-white/20">
                  {staffMember.firstName?.charAt(0) || "S"}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">
                    {staffMember.firstName} {staffMember.lastName}
                  </div>
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <FiMail size={12} />
                    {staffMember.staffEmail || "No email"}
                  </div>
                  {staffMember.role && (
                    <div className="text-gray-500 text-xs mt-1">
                      {staffMember.role}
                    </div>
                  )}
                </div>
                <button className="text-[#9AEA62] hover:text-green-400 transition-colors">
                  <FiArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Empty State - Add Staff
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center border-2 border-dashed border-white/20">
            <FiPlus className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Staff Members
          </h3>
          <p className="text-gray-400 mb-6">
            Add coaching staff and team administrators to manage your team.
          </p>
          <button 
            className="bg-[#9AEA62] hover:bg-green-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            onClick={() => setShowAddStaffModal(true)}
          >
            <FiPlus size={18} />
            Add Staff Member
          </button>
        </div>
      )}
      
      <div 
        className="absolute -top-5 right-5 border-4 border-gray-700 cursor-pointer bg-[#9AEA62] p-1 rounded-full hover:bg-green-500 transition-colors"
        onClick={() => setShowAddStaffModal(true)}
      >
        <IoAddSharp size={30} className="text-gray-800" />
      </div>
    </motion.div>
  ), [teamStaff, loadingStaff]);

  // Get event title based on type
  const getEventTitle = useCallback((event) => {
    if (event.eventType === 'other' && event.title) {
      return event.title;
    }
    if (event.eventType === 'practice' && event.title) {
      return event.title;
    }
    if (event.eventType === 'game' && event.title) {
      return event.title;
    }
    return event.eventType?.charAt(0).toUpperCase() + event.eventType?.slice(1) || 'Event';
  }, []);

  // Get event icon color based on type
  const getEventColor = useCallback((eventType) => {
    switch (eventType) {
      case "game": 
        return "bg-red-400";
      case "practice": 
        return "bg-blue-400";
      case "other":
        return "bg-purple-400";
      default:
        return "bg-gray-400";
    }
  }, []);

  return (
    <div className="min-h-screen text-white p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-50  mb-2">
            Welcome back, Coach!
          </h1>
          <p className="text-gray-400 text-lg">
            Here's what's happening with{" "}
            <span className="text-[#9AEA62] font-semibold">
              {teamData?.teamName}
            </span>{" "}
            today.
          </p>
        </motion.div>

        <div className="lg:flex gap-5 justify-between">
          {TeamDetailsCard}
          {StaffCard}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              icon={<FiUsers size={24} className="text-white" />}
              title="Manage Team"
              description="Add players, update rosters, and manage team details"
              action="Go to Team"
              color="bg-blue-500/20"
            />
            <QuickActionCard
              icon={<FiUsers size={24} className="text-white" />}
              title="Manage Staff"
              description="Add and manage coaching staff and administrators"
              action="View Staff"
              color="bg-purple-500/20"
            />
            <QuickActionCard
              icon={<FiCalendar size={24} className="text-white" />}
              title="Schedule"
              description="View and manage upcoming games and practices"
              action="View Schedule"
              color="bg-green-500/20"
            />
            <QuickActionCard
              icon={<FiBarChart2 size={24} className="text-white" />}
              title="Team Stats"
              description="Analyze performance and player statistics"
              action="View Analytics"
              color="bg-orange-500/20"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FiClock className="text-[#9AEA62]" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-sm">
                      {activity.description || activity.result}
                    </p>
                  </div>
                  <div className="text-gray-500 text-sm">{activity.time}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FiCalendar className="text-[#9AEA62]" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <motion.div
                    key={event._id || event.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-3 h-3 rounded-full ${getEventColor(event.eventType)}`} />
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {getEventTitle(event)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {formatEventDate(event.startDate)}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {event.location || "Location not set"}
                      </p>
                    </div>
                    <button className="text-[#9AEA62] hover:text-green-400 transition-colors">
                      <FiArrowRight size={16} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FiCalendar className="text-4xl text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No upcoming events</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Add events to see them here
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Countdown Timer in Top Right */}
     <div>
        
         {CountdownTimer}
     </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddPlayerModal && (
          <AddPlayerModel
            isOpen={showAddPlayerModal}
            onClose={() => setShowAddPlayerModal(false)}
            onAddPlayer={handleAddPlayer}
            isLoading={loadingPlayers.current}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddStaffModal && (
          <AddStaffModel
            isOpen={showAddStaffModal}
            onClose={() => setShowAddStaffModal(false)}
            onAddStaff={handleAddStaff}
            isLoading={loadingStaff}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Separate component for countdown to isolate re-renders
const LiveCountdown = ({ gameDate }) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!gameDate) {
      setCountdown("");
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const gameTime = new Date(gameDate);
      const diffMs = gameTime - now;
      
      if (diffMs <= 0) {
        setCountdown("Game Started!");
        return;
      }
      
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setCountdown(`${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${seconds}s`);
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [gameDate]);

  if (!countdown) return null;

  return (
    <div className="absolute top-5 right-5">
      <div className="text-right">
        <div className="text-gray-400 text-sm mb-1">Next Game In</div>
       <div>
         <h1 className="text-gray-500 font-bold text-[40px]">{countdown}</h1>
       </div>
      </div>
    </div>
  );
};

export default MainPage;