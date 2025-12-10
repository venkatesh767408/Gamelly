import { useEffect, useState } from "react";
import { useCreatePlayer } from "../../hooks/useCreatePlayer";
import { useCreateStaff } from "../../hooks/useCreateStaff";
import AddPlayerModel from "../../components/Models/AddPlayerModel";
import AddStaffModel from "../../components/Models/AddStaffModel";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiCheck,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

const TeamPage = ({ teamId, teamData }) => {
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState("players");

  const {
    players,
    isLoading: playersLoading,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getPlayersByTeam,
    clearPlayerError,
    clearCurrentPlayer,
    clearCreatedPlayer,
  } = useCreatePlayer();

  const {
    staff,
    isLoading: staffLoading,
    createStaff,
    updateStaff,
    deleteStaff,
    getStaffByTeam,
    clearStaffError,
    clearCurrentStaff,
    clearCreatedStaff,
  } = useCreateStaff();

  useEffect(() => {
    if (teamId) {
      getPlayersByTeam(teamId);
      getStaffByTeam(teamId);
    } else {
      console.error("No teamId provided to TeamPage");
    }
  }, [teamId, getPlayersByTeam, getStaffByTeam]);

  const handleAddPlayer = async (formData) => {
    try {
      console.log("🔍 TeamPage - Received formData:", formData);
      console.log("🔍 TeamPage - Is FormData?", formData instanceof FormData);

      if (formData instanceof FormData) {
        console.log("🔍 TeamPage - FormData contents:");
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }
      }

      // Create a new FormData and include ALL fields plus teamId
      const finalFormData = new FormData();

      // Copy all fields from the incoming FormData
      if (formData instanceof FormData) {
        for (let [key, value] of formData.entries()) {
          finalFormData.append(key, value);
        }
      } else {
        // If it's already an object (due to Redux serialization), copy the fields
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== undefined) {
            finalFormData.append(key, formData[key]);
          }
        });
      }

      // Add teamId
      finalFormData.append("teamId", teamId);

      console.log("🔍 TeamPage - Final FormData being sent to Redux:");
      for (let [key, value] of finalFormData.entries()) {
        console.log(`${key}:`, value);
      }

      await createPlayer(finalFormData);
      setShowAddPlayerModal(false);

      if (teamId) {
        getPlayersByTeam(teamId);
      }
    } catch (error) {
      console.error("Failed to add player:", error);
    }
  };

  const handleUpdatePlayer = async (playerData) => {
    try {
      await updatePlayer(editingPlayer._id, playerData);
      setEditingPlayer(null);
      setShowAddPlayerModal(false);
      clearCurrentPlayer();

      if (teamId) {
        getPlayersByTeam(teamId);
      }
    } catch (error) {
      console.error("Failed to update player:", error);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      await deletePlayer(playerId);
      setConfirmDeleteId(null);

      if (teamId) {
        getPlayersByTeam(teamId);
      }
    } catch (error) {
      console.error("Failed to delete player:", error);
    }
  };

  const handleAddStaff = async (newStaff) => {
    try {
      const staffData = {
        ...newStaff,
        teamId: teamId,
      };

      await createStaff(staffData);
      setShowAddStaffModal(false);
      clearCreatedStaff();

      if (teamId) {
        getStaffByTeam(teamId);
      }
    } catch (error) {
      console.error("Failed to add staff:", error);
    }
  };

  const handleUpdateStaff = async (staffData) => {
    try {
      await updateStaff(editingStaff._id, staffData);
      setEditingStaff(null);
      setShowAddStaffModal(false);
      clearCurrentStaff();

      if (teamId) {
        getStaffByTeam(teamId);
      }
    } catch (error) {
      console.error("Failed to update staff:", error);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      await deleteStaff(staffId);
      setConfirmDeleteId(null);

      if (teamId) {
        getStaffByTeam(teamId);
      }
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  const renderTeamHeader = () => (
    <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
      <h1 className="text-2xl font-bold text-gray-400 mb-2 uppercase">
        {teamData?.teamName || "Team"}
      </h1>
      <div className="flex flex-wrap gap-4 text-sm text-gray-300">
        <span className="text-[16px] uppercase font-semibold text-white">
          Sport:{" "}
          <span className="text-[14px] lowercase text-gray-400 ">
            {teamData?.sport || "Unknown"}
          </span>
        </span>
        <span className="text-[16px] uppercase font-semibold text-white">
          Age Group:{" "}
          <span className="text-[14px] lowercase text-gray-400 ">
            {teamData?.ageGroup || "Unknown"}
          </span>
        </span>
        <span className="text-[16px] uppercase font-semibold text-white">
          Type:{" "}
          <span className="text-[14px] lowercase text-gray-400 ">
            {teamData?.teamType || "Unknown"}
          </span>
        </span>
        {teamData?.season && (
          <span className="text-[16px] uppercase font-semibold text-white">
            Season:{" "}
            <span className="text-[14px] lowercase text-gray-400 ">
              {teamData.season}
            </span>
          </span>
        )}
      </div>
    </div>
  );

  const renderPlayersTab = () => (
    <>
      {renderTeamHeader()}
      {playersLoading ? (
        <div className="flex items-center justify-center min-h-[400px] bg-gray-800/50 rounded-2xl border border-gray-700">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9AEA62] mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading players...</p>
          </div>
        </div>
      ) : players && players.length > 0 ? (
        <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-300">Player</th>
                  <th className="py-3 px-4 text-left text-gray-300">
                    Position
                  </th>
                  <th className="py-3 px-4 text-center text-gray-300">
                    Jersey
                  </th>
                  <th className="py-3 px-4 text-left text-gray-300">Contact</th>
                  <th className="py-3 px-4 text-right text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr
                    key={player._id || player.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {player.playerimage ? (
                          <div>
                            <img src={player.playerimage} alt="" loading="lazy" className="h-10 w-10 rounded-full" />
                          </div>
                        ) : (
                          <div className="bg-violet-900/50 p-2 rounded-full">
                            <FiUser className="text-violet-400" />
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-white">
                            {player.firstName} {player.lastName}
                          </p>
                          <p className="text-sm text-gray-400">
                            {player.birthDate}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-900/50 text-blue-200 px-2 py-1 rounded-full text-xs">
                        {player.position || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {player.jerseyNumber ? (
                        <span className="bg-gray-700 px-2.5 py-1 rounded-full font-medium text-gray-200">
                          {player.jerseyNumber}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-300">
                        {player.parentEmail || "-"}
                      </p>
                      {player.parentPhone && (
                        <p className="text-sm text-gray-400">
                          {player.parentPhone}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {confirmDeleteId === (player._id || player.id) ? (
                          <div className="flex gap-1 bg-red-900/50 rounded-lg overflow-hidden border border-red-700">
                            <button
                              onClick={() =>
                                handleDeletePlayer(player._id || player.id)
                              }
                              className="p-2 text-red-400 hover:bg-red-800/50"
                              title="Confirm delete"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-2 text-gray-400 hover:bg-gray-800/50"
                              title="Cancel"
                            >
                              <FiX />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingPlayer(player);
                                setShowAddPlayerModal(true);
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-900/50 rounded-lg"
                              title="Edit player"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() =>
                                setConfirmDeleteId(player._id || player.id)
                              }
                              className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg"
                              title="Delete player"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#151E2E] rounded-2xl border border-gray-700">
          <p className="font-bold text-3xl text-gray-500 mt-4">
            No players added yet
          </p>
          <p className="text-gray-400">Add your first player to get started</p>
        </div>
      )}
    </>
  );

  const renderStaffTab = () => (
    <>
      {renderTeamHeader()}

      {staffLoading ? (
        <div className="flex items-center justify-center min-h-[400px] bg-gray-800/50 rounded-2xl border border-gray-700">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9AEA62] mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading staff...</p>
          </div>
        </div>
      ) : staff && staff.length > 0 ? (
        <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-300">
                    Staff Member
                  </th>
                  <th className="py-3 px-4 text-left text-gray-300">Email</th>
                  <th className="py-3 px-4 text-left text-gray-300">Role</th>
                  <th className="py-3 px-4 text-right text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {staff.map((staffMember) => (
                  <tr
                    key={staffMember._id || staffMember.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-violet-900/50 p-2 rounded-full">
                          <FiUser className="text-violet-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {staffMember.firstName} {staffMember.lastName}
                          </p>
                          <p className="text-sm text-gray-400">
                            Staff ID: {staffMember._id || staffMember.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-300">
                        {staffMember.staffEmail || "-"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-green-900/50 text-green-200 px-2 py-1 rounded-full text-xs">
                        {staffMember.role || "Staff"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {confirmDeleteId ===
                        (staffMember._id || staffMember.id) ? (
                          <div className="flex gap-1 bg-red-900/50 rounded-lg overflow-hidden border border-red-700">
                            <button
                              onClick={() =>
                                handleDeleteStaff(
                                  staffMember._id || staffMember.id
                                )
                              }
                              className="p-2 text-red-400 hover:bg-red-800/50"
                              title="Confirm delete"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-2 text-gray-400 hover:bg-gray-800/50"
                              title="Cancel"
                            >
                              <FiX />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingStaff(staffMember);
                                setShowAddStaffModal(true);
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-900/50 rounded-lg"
                              title="Edit staff"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() =>
                                setConfirmDeleteId(
                                  staffMember._id || staffMember.id
                                )
                              }
                              className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg"
                              title="Delete staff"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#151E2E] rounded-2xl border border-gray-700">
          <p className="font-bold text-3xl text-gray-500 mt-4">
            No staff members added yet
          </p>
          <p className="text-gray-400">
            Add your first staff member to get started
          </p>
        </div>
      )}
    </>
  );

  return (
    <div className="mbackdrop-blur-sm min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Team Roster</h2>
            <div className="flex gap-4 mt-2">
              <button
                className={`${
                  activeTab === "players"
                    ? "text-gray-100 font-medium border-b-2 border-[#9AEA62]"
                    : "text-gray-400 hover:text-white"
                } pb-1`}
                onClick={() => setActiveTab("players")}
              >
                Players
              </button>
              <button
                className={`${
                  activeTab === "staff"
                    ? "text-gray-100 font-medium border-b-2 border-[#9AEA62]"
                    : "text-gray-400 hover:text-white"
                } pb-1`}
                onClick={() => setActiveTab("staff")}
              >
                Staff
              </button>
            </div>
          </div>
          <motion.button
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (activeTab === "players") {
                setEditingPlayer(null);
                setShowAddPlayerModal(true);
              } else {
                setEditingStaff(null);
                setShowAddStaffModal(true);
              }
            }}
          >
            <FiPlus />
            <span>Add {activeTab === "players" ? "Player" : "Staff"}</span>
          </motion.button>
        </div>
        {activeTab === "players" ? renderPlayersTab() : renderStaffTab()}

        <AnimatePresence>
          {showAddPlayerModal && (
            <AddPlayerModel
              isOpen={showAddPlayerModal}
              onClose={() => {
                setShowAddPlayerModal(false);
                setEditingPlayer(null);
                clearPlayerError();
              }}
              onAddPlayer={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
              player={editingPlayer}
              isLoading={playersLoading}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddStaffModal && (
            <AddStaffModel
              isOpen={showAddStaffModal}
              onClose={() => {
                setShowAddStaffModal(false);
                setEditingStaff(null);
                clearStaffError();
              }}
              onAddStaff={editingStaff ? handleUpdateStaff : handleAddStaff}
              staff={editingStaff}
              isLoading={staffLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeamPage;
