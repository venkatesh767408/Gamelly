import { FaAngleRight, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from "react";

const TeamCard = ({ team, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  
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

  const sport = sports.find((s) => s.name === team.sport);
  const sportIcon = sport ? sport.icon : "/g2.svg";


  const coachName = auth.user?.username || auth.user?.name || "Coach";

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(team);
  };



  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(team._id);
  };

  const handleTeamClick = () => {
    console.log('Current user:', auth.user);
    console.log('Coach name to pass:', coachName);
    
 
    navigate(`/team/${team._id}`, { 
      state: { 
        teamData: {
          ...team,
          createdBy: { 
            name: coachName,
            username: auth.user?.username 
          }
        },
        sportIcon: sportIcon 
      } 
    });
  };

  return (
    <div
      className="border border-gray-800 rounded-xl mt-4 sm:mt-6 p-3 sm:p-4 flex items-center justify-between hover:bg-[#19202C]/20 cursor-pointer transition-colors duration-200 group"
      onClick={handleTeamClick}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src={team.teamlogo}
          alt={team?.teamlogo}
          className="h-10 sm:h-12 md:h-15 border-2 sm:border-3 rounded-full border-gray-700 bg-white"
        />
        
        <div>
          <p className="font-semibold text-sm sm:text-base md:text-[17px] text-white">
            {team.teamName}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">
            {team.sport} • {team.teamType} • {team.ageGroup}
          </p>
          <p className="text-gray-500 text-xs">
            {team.location} • Coach: {coachName}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Edit and Delete buttons - visible on hover */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
            title="Edit Team"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Delete Team"
          >
            <FaTrash size={14} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 text-gray-300">
          <p className="text-sm sm:text-base">View</p>
          <FaAngleRight className="size-4 sm:size-5" />
        </div>
      </div>
    </div>
  );
};

export default TeamCard;