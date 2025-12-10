import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiShield, FiTarget } from "react-icons/fi";

const StatsTab = ({
  baseGame,
  sportConfig,
  isUpdating,
  handleAddStat,
  getUserTeamName,
  getUserTeamStats,
  getOpponentTeamName,
  getOpponentTeamStats,
  overlayIcon,
  teamSelection, 
  getTeamStatsByRole, 
}) => {
  if (baseGame.status !== "live") return null;

  
  const getUserTeamFilteredStats = () => {
    if (!teamSelection?.isSelected || baseGame.sport !== "Football") {
      return sportConfig.stats;
    }
    
    const userTeamSide = getUserTeamStats();
    const allowedStats = getTeamStatsByRole?.(userTeamSide) || sportConfig.stats.map(stat => stat.type);
    
    return sportConfig.stats.filter(stat => 
      allowedStats.includes(stat.type)
    );
  };

  const getOpponentTeamFilteredStats = () => {
    if (!teamSelection?.isSelected || baseGame.sport !== "Football") {
      return sportConfig.stats;
    }
    
    const opponentTeamSide = getOpponentTeamStats();
    const allowedStats = getTeamStatsByRole?.(opponentTeamSide) || sportConfig.stats.map(stat => stat.type);
    
    return sportConfig.stats.filter(stat => 
      allowedStats.includes(stat.type)
    );
  };


  const getUserTeamRoleInfo = () => {
    if (!teamSelection?.isSelected || baseGame.sport !== "Football") {
      return { role: null, icon: null, color: "text-green-400" };
    }
    
    const isAttacking = teamSelection.attackingTeam === getUserTeamStats();
    return {
      role: isAttacking ? "Attacking" : "Defending",
      icon: isAttacking ? <FiTarget className="text-green-400" /> : <FiShield className="text-red-400" />,
      color: isAttacking ? "text-green-400" : "text-red-400",
      badgeColor: isAttacking ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"
    };
  };

  const getOpponentTeamRoleInfo = () => {
    if (!teamSelection?.isSelected || baseGame.sport !== "Football") {
      return { role: null, icon: null, color: "text-red-400" };
    }
    
    const isAttacking = teamSelection.attackingTeam === getOpponentTeamStats();
    return {
      role: isAttacking ? "Attacking" : "Defending",
      icon: isAttacking ? <FiTarget className="text-green-400" /> : <FiShield className="text-red-400" />,
      color: isAttacking ? "text-green-400" : "text-red-400",
      badgeColor: isAttacking ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"
    };
  };

  const userTeamRole = getUserTeamRoleInfo();
  const opponentTeamRole = getOpponentTeamRoleInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 md:space-y-8 relative"
    >
      
      <AnimatePresence>
        {overlayIcon && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 4, opacity: 0.15 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <span className="text-6xl md:text-[200px] text-white opacity-70">
              {overlayIcon}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-lg md:text-xl font-bold mb-4">Game Statistics</h3>

      {teamSelection?.isSelected && baseGame.sport === "Football" && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6"
        >
          <div className={`text-center p-3 md:p-4 rounded-xl border-2 ${userTeamRole.badgeColor}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {userTeamRole.icon}
              <span className="text-xs md:text-sm font-semibold text-green-400">🟢 Attacking Team</span>
            </div>
            <div className="text-sm md:text-lg font-bold truncate">
              {teamSelection.attackingTeam === 'home' ? getUserTeamName() : getOpponentTeamName()}
            </div>
          </div>
          <div className={`text-center p-3 md:p-4 rounded-xl border-2 ${opponentTeamRole.badgeColor}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {opponentTeamRole.icon}
              <span className="text-xs md:text-sm font-semibold text-red-400">🔴 Defending Team</span>
            </div>
            <div className="text-sm md:text-lg font-bold truncate">
              {teamSelection.defendingTeam === 'home' ? getUserTeamName() : getOpponentTeamName()}
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Your Team Stats */}
        <div>
          <h4 className={`text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 ${userTeamRole.color}`}>
            <FiHome className="flex-shrink-0" /> 
            <span className="truncate">{getUserTeamName()}</span>
            {userTeamRole.role && (
              <span className={`text-xs px-2 py-1 rounded-full ${userTeamRole.badgeColor} border flex-shrink-0`}>
                {userTeamRole.role}
              </span>
            )}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 md:gap-3">
            {getUserTeamFilteredStats().map((stat) => (
              <motion.button
                key={stat.type}
                onClick={() => handleAddStat(stat.type, getUserTeamStats())}
                disabled={isUpdating}
                className="bg-gray-800 border border-gray-700 hover:border-green-500 hover:bg-green-500/10 text-white p-2 md:p-4 rounded-lg flex flex-col items-center justify-center gap-1 md:gap-2 transition-all disabled:opacity-50 min-h-[80px] md:min-h-[100px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 w-full">
                  <div className="flex items-center gap-1 md:gap-3 w-full md:w-auto">
                    <span className="text-2xl md:text-4xl lg:text-5xl flex-shrink-0">{stat.icon}</span>
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-semibold text-xs md:text-sm truncate">{stat.name}</div>
                      {/* 🔥 NEW: Show role-specific hint for Football */}
                      {baseGame.sport === "Football" && teamSelection?.isSelected && (
                        <div className="text-[10px] md:text-xs text-gray-400 mt-0.5 hidden sm:block">
                          {getStatRoleHint(stat.type, userTeamRole.role)}
                        </div>
                      )}
                    </div>
                  </div>

                  {stat.points > 0 && (
                    <span className="text-lg md:text-2xl lg:text-3xl font-extrabold opacity-90 flex-shrink-0">
                      +{stat.points}
                    </span>
                  )}
                </div>
                
                {/* Mobile-only hint */}
                {baseGame.sport === "Football" && teamSelection?.isSelected && (
                  <div className="text-[10px] text-gray-400 mt-1 block sm:hidden">
                    {getStatRoleHint(stat.type, userTeamRole.role)}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Opponent Team Stats */}
        <div className="mt-6 lg:mt-0">
          <h4 className={`text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 ${opponentTeamRole.color}`}>
            <span className="truncate">{getOpponentTeamName()}</span>
            {opponentTeamRole.role && (
              <span className={`text-xs px-2 py-1 rounded-full ${opponentTeamRole.badgeColor} border flex-shrink-0`}>
                {opponentTeamRole.role}
              </span>
            )}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 md:gap-3">
            {getOpponentTeamFilteredStats().map((stat) => (
              <motion.button
                key={stat.type}
                onClick={() => handleAddStat(stat.type, getOpponentTeamStats())}
                disabled={isUpdating}
                className="bg-gray-800 border border-gray-700 hover:border-red-500 hover:bg-red-500/10 text-white p-2 md:p-4 rounded-lg flex flex-col items-center justify-center gap-1 md:gap-2 transition-all disabled:opacity-50 min-h-[80px] md:min-h-[100px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 w-full">
                  <div className="flex items-center gap-1 md:gap-3 w-full md:w-auto">
                    <span className="text-2xl md:text-4xl lg:text-5xl flex-shrink-0">{stat.icon}</span>
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-semibold text-xs md:text-sm truncate">{stat.name}</div>

                      {baseGame.sport === "Football" && teamSelection?.isSelected && (
                        <div className="text-[10px] md:text-xs text-gray-400 mt-0.5 hidden sm:block">
                          {getStatRoleHint(stat.type, opponentTeamRole.role)}
                        </div>
                      )}
                    </div>
                  </div>

                  {stat.points > 0 && (
                    <span className="text-lg md:text-2xl lg:text-3xl font-extrabold opacity-90 flex-shrink-0">
                      +{stat.points}
                    </span>
                  )}
                </div>
                
                {/* Mobile-only hint */}
                {baseGame.sport === "Football" && teamSelection?.isSelected && (
                  <div className="text-[10px] text-gray-400 mt-1 block sm:hidden">
                    {getStatRoleHint(stat.type, opponentTeamRole.role)}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

   
      {teamSelection?.isSelected && baseGame.sport === "Football" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 md:mt-8 p-3 md:p-4 bg-gray-800/50 rounded-lg border border-gray-700"
        >
          <h4 className="text-xs md:text-sm font-semibold text-gray-400 mb-2">Role-based Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs text-gray-500">
            <div>
              <span className="text-green-400 text-xs md:text-sm">🟢 Attacking Team:</span>
              <div className="mt-1 text-[10px] md:text-xs">Goals, Shots, Assists, Passes, Crosses</div>
            </div>
            <div>
              <span className="text-red-400 text-xs md:text-sm">🔴 Defending Team:</span>
              <div className="mt-1 text-[10px] md:text-xs">Tackles, Interceptions, Saves, Clearances, Blocks</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

//Helper function for role-based stat hints
const getStatRoleHint = (statType, role) => {
  if (role === "Attacking") {
    const attackingStats = {
      goal: "Scoring opportunity",
      shot: "Attempt on goal", 
      shot_on_target: "Quality chance",
      assist: "Creating chances",
      pass: "Build-up play",
      cross: "Wing delivery",
      through_ball: "Breaking defense"
    };
    return attackingStats[statType] || "";
  } else if (role === "Defending") {
    const defendingStats = {
      tackle: "Winning possession",
      interception: "Reading the game",
      clearance: "Defensive action", 
      save: "Goalkeeping",
      block: "Shot prevention",
      foul_committed: "Stopping attack"
    };
    return defendingStats[statType] || "";
  }
  return "";
};

export default StatsTab;