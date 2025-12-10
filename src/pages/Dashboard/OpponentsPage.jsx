import { useState, useMemo, useCallback, useEffect } from "react";
import { FiSearch, FiX, FiMapPin, FiCalendar } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { useCreateTeam } from "../../hooks/useCreateTeam";
import { useCreatePlayer } from "../../hooks/useCreatePlayer";

const CURRENT_YEAR = new Date().getFullYear();

// Updated PlayerAvatar component to display real images or first letters
const PlayerAvatar = ({ player, size = 8, index = 0 }) => {
  const { firstName, lastName, playerimage } = player || {};
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();
  const firstLetter = fullName ? fullName.charAt(0).toUpperCase() : "?";

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const colorClass = colors[index % colors.length];

  // If player has an image, display it
  if (playerimage) {
    return (
      <img
        src={playerimage}
        alt={fullName}
        className="w-8 h-8 rounded-full object-cover border-2 border-gray-800"
        title={fullName}
        onError={(e) => {
          // If image fails to load, hide the broken image and show fallback
          e.target.style.display = "none";
        }}
      />
    );
  }

  // Fallback to colored circle with first letter
  return (
    <div
      className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-white text-xs font-bold border-2 border-gray-800`}
      title={fullName}
    >
      {firstLetter}
    </div>
  );
};

// Updated TeamMembersAvatars component with image support
const TeamMembersAvatars = ({ players = [], maxDisplay = 5 }) => {
  // Ensure players is always an array
  const safePlayers = Array.isArray(players) ? players : [];
  const membersToShow = safePlayers.slice(0, maxDisplay);
  const remainingCount = safePlayers.length - maxDisplay;

  if (safePlayers.length === 0) {
    return <div className="text-xs text-gray-400 italic">No players</div>;
  }

  return (
    <div className="flex -space-x-3">
      {membersToShow.map((player, index) => (
        <PlayerAvatar
          key={player._id || player.id || index}
          player={player}
          index={index}
        />
      ))}
      {remainingCount > 0 && (
        <div
          className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-800"
          title={`${remainingCount} more players`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

// Fallback component for when images fail to load
const FallbackAvatar = ({ name, index = 0 }) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const colorClass = colors[index % colors.length];

  return (
    <div
      className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-white text-xs font-bold border-2 border-gray-800`}
      title={name}
    >
      {firstLetter}
    </div>
  );
};

const OpponentsPage = ({ teamId: currentTeamId }) => {
  const [searchParams, setSearchParams] = useState({
    query: "",
    city: "",
    season: "",
    year: CURRENT_YEAR,
  });

  const sports = [
    { name: "Basketball", icon: "/sports-images/bb.svg" },
    { name: "Softball", icon: "/sports-images/g2.svg" },
    { name: "Ice Hockey", icon: "/sports-images/g3.svg" },
    { name: "Bowling", icon: "/sports-images/g4.svg" },
    { name: "Football", icon: "/sports-images/g5.svg" },
    { name: "Tennis & Raquetball", icon: "/sports-images/g6.svg" },
    { name: "Cheerleading", icon: "/sports-images/g7.svg" },
    { name: "Field Hockey", icon: "/sports-images/g8.svg" },
    { name: "Soccer", icon: "/sports-images/g9.svg" },
    { name: "Volleyball", icon: "/sports-images/g10.svg" },
    { name: "Baseball", icon: "/sports-images/g11.svg" },
    { name: "Swimming", icon: "/sports-images/g12.svg" },
  ];

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [processingOpponents, setProcessingOpponents] = useState(new Set());
  const [opponentPlayers, setOpponentPlayers] = useState({}); // Store players by team ID
  const [loadingPlayers, setLoadingPlayers] = useState({}); // Track loading state per team
  const [failedImages, setFailedImages] = useState(new Set()); // Track failed image loads

  const {
    opponents,
    getOpponents,
    addOpponent,
    deleteOpponent,
    getTeamById,
    team,
    isLoading,
    error,
  } = useCreateTeam();

  const { getPlayersByTeam } = useCreatePlayer();

  // Fetch current team data and opponents when component mounts
  useEffect(() => {
    if (currentTeamId) {
      console.log("Fetching team and opponents for:", currentTeamId);
      getTeamById(currentTeamId);
      getOpponents(currentTeamId);
    }
  }, [getTeamById, getOpponents, currentTeamId]);

  // Fetch players for each opponent team
  useEffect(() => {
    const fetchOpponentPlayers = async () => {
      if (!opponents || opponents.length === 0) return;

      const playersMap = {};
      const loadingMap = {};

      for (const opponent of opponents) {
        try {
          console.log("Fetching players for opponent:", opponent._id);
          loadingMap[opponent._id] = true;
          setLoadingPlayers((prev) => ({ ...prev, [opponent._id]: true }));

          // Assuming getPlayersByTeam returns a response object
          const response = await getPlayersByTeam(opponent._id);
          console.log("Players response for team", opponent._id, ":", response);

          // Extract players array from response - adjust this based on your API response structure
          const players =
            response?.data?.players ||
            response?.data ||
            response?.players ||
            [];
          playersMap[opponent._id] = Array.isArray(players) ? players : [];
          console.log("opponents fetched:", opponents);
        } catch (error) {
          console.error(
            `Failed to fetch players for team ${opponent._id}:`,
            error
          );
          playersMap[opponent._id] = [];
        } finally {
          loadingMap[opponent._id] = false;
          setLoadingPlayers((prev) => ({ ...prev, [opponent._id]: false }));
        }
      }

      setOpponentPlayers(playersMap);
    };

    fetchOpponentPlayers();
  }, [opponents, getPlayersByTeam]);

  // Use a derived state for added opponents from the actual team data
  const addedOpponents = useMemo(() => {
    if (team && team.opponents) {
      console.log("Team opponents:", team.opponents);
      const opponentIds = team.opponents
        .map((opp) => {
          // Extract the opponent ID - handle both object and string formats
          const id = opp.opponentTeamId || opp._id || opp.id;
          return id ? id.toString() : null;
        })
        .filter((id) => id && id !== "undefined" && id !== "null");

      console.log("Extracted opponent IDs:", opponentIds);
      return new Set(opponentIds);
    }
    console.log("No team data or opponents found");
    return new Set();
  }, [team]);

  // Get sport icon for opponent
  const getOpponentSportIcon = (opponent) => {
    const sport = sports.find((s) => s.name === opponent.sport);
    return sport ? sport.icon : "/default-sport-icon.png";
  };

  // Get default team logo if teamlogo is not available
  const getTeamLogo = (opponent) => {
    return opponent.teamlogo || "/default-team-logo.png";
  };

  // Handle image load errors
  // const handleImageError = useCallback((playerId) => {
  //   setFailedImages(prev => new Set([...prev, playerId]));
  // }, []);

  // Check if image failed to load for a player
  // const hasImageFailed = useCallback((playerId) => {
  //   return failedImages.has(playerId);
  // }, [failedImages]);

  // Season options
  const seasonOptions = useMemo(
    () => [
      { value: "", label: "All Seasons" },
      { value: "WINTER", label: `Winter ${CURRENT_YEAR}` },
      { value: "SPRING", label: `Spring ${CURRENT_YEAR}` },
      { value: "SUMMER", label: `Summer ${CURRENT_YEAR}` },
      { value: "FALL", label: `Fall ${CURRENT_YEAR}` },
    ],
    []
  );

  const clearSearch = () => {
    setSearchParams({
      query: "",
      city: "",
      season: "",
      year: CURRENT_YEAR,
    });
    setCitySuggestions([]);
  };

  const hasFilters =
    searchParams.query || searchParams.city || searchParams.season;

  // Filter opponents based on search parameters and exclude current team
  const filteredOpponents = useMemo(() => {
    if (!opponents || opponents.length === 0) return [];

    return opponents.filter((opponent) => {
      if (opponent._id === currentTeamId) {
        return false;
      }

      const matchesQuery =
        !searchParams.query ||
        opponent.teamName
          ?.toLowerCase()
          .includes(searchParams.query.toLowerCase()) ||
        opponent.sport
          ?.toLowerCase()
          .includes(searchParams.query.toLowerCase());

      const matchesCity =
        !searchParams.city ||
        opponent.location
          ?.toLowerCase()
          .includes(searchParams.city.toLowerCase());

      const matchesSeason =
        !searchParams.season ||
        opponent.season
          ?.toUpperCase()
          .includes(searchParams.season.toUpperCase());

      return matchesQuery && matchesCity && matchesSeason;
    });
  }, [opponents, searchParams, currentTeamId]);

  const handleAddOpponent = async (opponentId) => {
    try {
      console.log(
        "Adding opponent - Team ID:",
        currentTeamId,
        "Opponent ID:",
        opponentId
      );

      // Prevent multiple clicks
      if (processingOpponents.has(opponentId)) {
        console.log("Already processing this opponent");
        return;
      }

      // Validate IDs before making API call
      if (!currentTeamId || !opponentId) {
        console.error("Missing teamId or opponentId");
        return;
      }

      // Check if opponent is already added using the derived state
      const opponentIdStr = opponentId.toString();
      if (addedOpponents.has(opponentIdStr)) {
        console.log("Opponent already added to team");
        return;
      }

      console.log("Proceeding to add opponent...");
      setProcessingOpponents((prev) => new Set([...prev, opponentId]));

      await addOpponent(currentTeamId, opponentId);

      console.log("Add opponent successful, refreshing team data...");

      setTimeout(() => {
        getTeamById(currentTeamId);
        console.log("Team data refreshed after adding opponent");
      }, 800);
    } catch (error) {
      console.error("Failed to add opponent:", error);
    } finally {
      setProcessingOpponents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(opponentId);
        return newSet;
      });
    }
  };

  const handleRemoveOpponent = async (opponentId) => {
    try {
      console.log(
        "Removing opponent - Team ID:",
        currentTeamId,
        "Opponent ID:",
        opponentId
      );

      // Prevent multiple clicks
      if (processingOpponents.has(opponentId)) {
        console.log("Already processing this opponent");
        return;
      }

      // Validate IDs
      if (!currentTeamId || !opponentId) {
        console.error("Missing teamId or opponentId");
        return;
      }

      setProcessingOpponents((prev) => new Set([...prev, opponentId]));

      await deleteOpponent(currentTeamId, opponentId);

      console.log("Remove opponent successful, refreshing team data...");

      setTimeout(() => {
        getTeamById(currentTeamId);
        console.log("Team data refreshed after removing opponent");
      }, 800);
    } catch (error) {
      console.error("Failed to remove opponent:", error);
    } finally {
      setProcessingOpponents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(opponentId);
        return newSet;
      });
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  // Check if opponent is already added
  const isOpponentAdded = (opponentId) => {
    const opponentIdStr = opponentId.toString();
    const isAdded = addedOpponents.has(opponentIdStr);
    console.log(`Checking if opponent ${opponentIdStr} is added:`, isAdded);
    return isAdded;
  };

  // Check if opponent is currently being processed
  const isOpponentProcessing = (opponentId) => {
    return processingOpponents.has(opponentId);
  };

  return (
    <div className="md:p-8 backdrop-blur-sm min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Find Opponents</h2>

        {/* Search Form */}
        <form onSubmit={(e) => e.preventDefault()} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Find Opponent */}
            <div>
              <label
                htmlFor="query"
                className="block text-sm font-medium mb-1 flex items-center text-gray-300"
              >
                <FiSearch className="mr-2 text-gray-400" />
                Find or create opponent
              </label>
              <div className="relative">
                <input
                  id="query"
                  name="query"
                  type="text"
                  placeholder="Search by name or skill level"
                  className="w-full p-3 mt-2 rounded-xl pl-8 bg-gray-700 border border-gray-600 focus:outline-none text-white"
                  value={searchParams.query}
                  onChange={(e) => handleSearchChange("query", e.target.value)}
                />
                <FiSearch className="absolute left-2 top-6 text-gray-400" />
              </div>
            </div>

            {/* City Search */}
            <div className="relative">
              <label
                htmlFor="city"
                className="block text-sm font-medium mb-1 flex items-center text-gray-300"
              >
                <FiMapPin className="mr-2 text-gray-400" />
                City
              </label>
              <div className="relative">
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter city"
                  className="w-full p-3 pl-8 mt-2 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none text-white"
                  value={searchParams.city}
                  onChange={(e) => handleSearchChange("city", e.target.value)}
                  autoComplete="off"
                />
                <FiMapPin className="absolute left-2 top-6 text-gray-400" />
                {citySuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg">
                    {citySuggestions.map((city, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                        onClick={() => {
                          setSearchParams((prev) => ({ ...prev, city }));
                          setCitySuggestions([]);
                        }}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Season Selector */}
            <div>
              <label
                htmlFor="season"
                className="block text-sm font-medium mb-1 flex items-center text-gray-300"
              >
                <FiCalendar className="mr-2 text-gray-400" />
                Season
              </label>
              <div className="relative">
                <select
                  id="season"
                  name="season"
                  className="w-full p-3 mt-2 pl-8 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none text-white appearance-none"
                  value={searchParams.season}
                  onChange={(e) => handleSearchChange("season", e.target.value)}
                >
                  {seasonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiCalendar className="absolute left-2 top-6 text-gray-400" />
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current text-gray-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            {hasFilters && (
              <button
                type="button"
                onClick={clearSearch}
                className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="mr-1" />
                Clear filters
              </button>
            )}
            <button
              type="submit"
              className="ml-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading opponents...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 text-red-400">
            <p>Error loading opponents: {error}</p>
          </div>
        )}

        {/* Opponents List */}
        {!isLoading && !error && (
          <div className="mt-7 flex flex-col gap-5">
            {filteredOpponents.length > 0 ? (
              filteredOpponents.map((opponent) => {
                const isAdded = isOpponentAdded(opponent._id);
                const isProcessing = isOpponentProcessing(opponent._id);
                const players = opponentPlayers[opponent._id] || [];
                const isLoadingPlayers = loadingPlayers[opponent._id];
                const teamLogo = getTeamLogo(opponent);
                const sportIcon = getOpponentSportIcon(opponent);

                console.log(
                  `Opponent ${opponent.teamName} (${opponent._id}): isAdded=${isAdded}, isProcessing=${isProcessing}, players=${players.length}`
                );

                return (
                  <div
                    key={opponent._id}
                    className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center bg-white/10 p-5 rounded-xl"
                  >
                    {/* Team Info */}
                    <div className="flex items-center gap-4 lg:justify-start justify-center">
                      <div className="relative">
                        <div className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-gray-700 bg-blue-50 flex-shrink-0">
                          <img
                            src={teamLogo ? teamLogo : "/cat.webp"}
                            alt="Team logo"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <img
                          src={sportIcon}
                          alt={opponent.sport}
                          className="absolute -bottom-1 -right-1 h-6 w-6 md:h-7 md:w-7 rounded-full border-2 border-gray-800 bg-gray-800"
                        />
                      </div>

                      <div className="text-center lg:text-left min-w-0">
                        <div className="flex items-center gap-2 justify-center lg:justify-start">
                          <h1 className="font-bold text-lg md:text-xl lg:text-[25px] text-gray-300 truncate">
                            {opponent.teamName}
                          </h1>
                        </div>
                        <p className="font-semibold text-sm md:text-[15px] text-gray-600 truncate">
                          {opponent.sport} • {opponent.teamType}
                        </p>
                      </div>
                    </div>

                    {/* Season */}
                    <div className="flex flex-col items-center lg:items-start gap-2">
                      <h3 className="font-bold text-lg md:text-xl lg:text-[22px] text-gray-500 text-center lg:text-left whitespace-nowrap">
                        {opponent.season || "All Seasons"}
                      </h3>
                      <div className="flex justify-center lg:justify-start">
                        {/* Show team member avatars or loading state */}
                        {isLoadingPlayers ? (
                          <div className="text-xs text-gray-400">
                            Loading players...
                          </div>
                        ) : (
                          <TeamMembersAvatars
                            players={players}
                            maxDisplay={5}
                          />
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                      <FaLocationDot
                        size={20}
                        className="text-gray-600 flex-shrink-0"
                      />
                      <h2 className="text-[17px] text-gray-300 whitespace-nowrap">
                        {opponent.location || "No location"}
                      </h2>
                    </div>

                    {/* Action Button - Toggle between ADD/REMOVE */}
                    <div className="flex justify-center lg:justify-end">
                      <button
                        disabled={isProcessing}
                        className={`px-4 py-2 md:px-5 md:py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                          isAdded
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-[#9AEA62] text-black hover:bg-[#8ad452]"
                        } ${
                          isProcessing ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() =>
                          isAdded
                            ? handleRemoveOpponent(opponent._id)
                            : handleAddOpponent(opponent._id)
                        }
                      >
                        {isProcessing ? "..." : isAdded ? "REMOVE" : "ADD"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                {opponents.length === 0
                  ? "No opponents found"
                  : "No opponents match your search criteria"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpponentsPage;
