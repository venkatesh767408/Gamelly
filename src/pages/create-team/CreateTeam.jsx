import { IoIosAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useCreateTeam } from "../../hooks/useCreateTeam";
import Loader from "../../components/common/Loader";
import TeamCard from "./TeamCard";
import TeamCreationModal from "./TeamCreationModal";

const seasons = [
  { name: "Summer 2025", icon: "IoSunnyOutline" },
  { name: "Fall 2025", icon: "LuLeaf" },
  { name: "Winter 2025-26", icon: "FaRegSnowflake" },
  { name: "Spring-2026", icon: "LuFlower2" },
  { name: "Summer 2026", icon: "IoSunnyOutline" },
  { name: "Fall 2026", icon: "LuLeaf" },
];

const CreateTeam = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTeam, setEditingTeam] = useState(null);

  const {
    teams,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeams,
    clearTeamError,
    clearCreatedTeam,
  } = useCreateTeam();

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  const filteredTeams = searchQuery
    ? teams.filter(
        (team) =>
          team.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.sport?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : teams;

  const closeModal = () => {
    setShowModal(false);
    setEditingTeam(null);
    clearTeamError();
    clearCreatedTeam();
  };
  const handleTeamCreated = async (teamData) => {
    try {
      console.log("Team data being sent:", teamData);

      if (editingTeam) {
        const teamId = editingTeam._id || editingTeam.id;

        if (!teamId) {
          console.error("No team ID found for editing:", editingTeam);
          throw new Error("No team ID available for update");
        }

        await updateTeam(teamId, teamData);
      } else {
        // Wait for the team creation and get the response
        const createdTeam = await createTeam(teamData);
        console.log("Team created successfully:", createdTeam);

        // Verify the team has an ID before proceeding
        if (!createdTeam._id && !createdTeam.id) {
          throw new Error("Team created but no ID returned");
        }

        // Refresh teams list to ensure consistency
        setTimeout(() => {
          getTeams();
        }, 1000);
      }
      closeModal();
    } catch (error) {
      console.error("Team operation failed:", error);
      // Show error to user
      alert(
        `Failed to ${editingTeam ? "update" : "create"} team: ${error.message}`
      );
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowModal(true);
  };

  const handleDeleteTeam = async (teamId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ) {
      try {
        await deleteTeam(teamId);
      } catch (error) {
        console.error("Failed to delete team:", error);
      }
    }
  };

  const groupedTeams = filteredTeams.reduce((acc, team) => {
    const season = team.season || "Unknown Season";
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(team);
    return acc;
  }, {});

  // Sort seasons to ensure consistent order
  const sortedSeasons = Object.keys(groupedTeams).sort((a, b) => {
    const seasonOrder = seasons.map((s) => s.name);
    return seasonOrder.indexOf(a) - seasonOrder.indexOf(b);
  });
  return (
    <div
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      className="max-w-7xl mt-10 flex flex-col items-center justify-center mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-10 sm:pt-15 md:pt-30 py-8 sm:py-12 md:py-16 lg:py-30 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-0">
        <h1 className="font-bold text-2xl sm:text-[28px] md:text-[30px] text-white">
          My Teams
        </h1>
        <div
          className="flex items-center gap-2 font-semibold border border-white rounded-full px-4 sm:px-5 py-2 w-fit cursor-pointer text-sm sm:text-base hover:bg-white/10 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <IoIosAdd size={20} className="sm:size-[25px]" />
          <p>Create Team</p>
        </div>
      </div>

      <div className="flex items-center bg-[#19202C] rounded-lg p-3 mt-6 sm:mt-7 w-full">
        <CiSearch className="text-gray-100 mr-2 size-5 sm:size-6" />
        <input
          type="text"
          placeholder="Find a Team, League or Tournament"
          className="bg-transparent outline-none text-sm sm:text-[15px] text-gray-100 placeholder:text-white/20 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center">
          <Loader />
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Loading teams...
          </p>
        </div>
      )}

      {/* Teams List */}
      <div className="mt-8 sm:mt-10 w-full">
        {sortedSeasons.map((season) => (
          <div key={season} className="mb-6 sm:mb-8">
            <h1 className="font-bold text-lg sm:text-xl md:text-[22px] text-gray-100 mb-4">
              {season}
            </h1>
            {groupedTeams[season].map((team) => (
              <TeamCard
                key={team._id || team.id}
                team={team}
                onEdit={handleEditTeam}
                onDelete={handleDeleteTeam}
              />
            ))}
          </div>
        ))}
        {sortedSeasons.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-700 font-extrabold text-4xl sm:text-6xl md:text-8xl font-sans mb-4">
              No Teams Found.
            </p>
            {searchQuery && (
              <p className="text-gray-500 text-lg">
                Try adjusting your search terms
              </p>
            )}
            {!searchQuery && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 px-6 py-3 bg-[#9AEA62] text-gray-800 font-semibold rounded-full hover:bg-[#8CD95B] transition-colors"
              >
                Create Your First Team
              </button>
            )}
          </div>
        )}
      </div>

      <TeamCreationModal
        showModal={showModal}
        onClose={closeModal}
        onTeamCreated={handleTeamCreated}
        isLoading={isLoading}
        error={error}
        editingTeam={editingTeam}
      />
    </div>
  );
};

export default CreateTeam;
