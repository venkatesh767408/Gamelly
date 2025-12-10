import { motion } from "framer-motion";

const PlayersTab = ({ 
  getUserTeamName,
  getUserTeamPlayers,
  getPlayerStats,
  getUserTeamStats,
  getOpponentTeamName,
  getOpponentTeamPlayers,
  getOpponentTeamStats,
  teamSelection // Added for baseball context
}) => {
  
  // Debug function to see what data we're working with
  const debugStats = (teamType, players, stats) => {
    console.log(`${teamType} Players:`, players);
    console.log(`${teamType} Stats:`, stats);
    if (stats.length > 0) {
      console.log(`${teamType} Sample stat:`, stats[0]);
      console.log(`${teamType} Stat playerIds:`, stats.map(s => s.playerId));
      if (stats[0].batting) {
        console.log(`${teamType} Batting stats:`, stats[0].batting);
      }
      if (stats[0].pitching) {
        console.log(`${teamType} Pitching stats:`, stats[0].pitching);
      }
    }
  };

  const renderPlayerStats = (player, teamStats, teamType) => {
    console.log(`Checking stats for player ${player._id} in ${teamType}`);
    
    const playerStats = teamStats.filter((stat) => {
      const match = stat.playerId === player._id;
      if (match) {
        console.log(`Found stat for player ${player._id}:`, stat);
      }
      return match;
    });
    
    console.log(`Found ${playerStats.length} stats for player ${player.firstName} ${player.lastName}`);

    if (playerStats.length === 0) {
      return { 
        // General stats
        totalPoints: 0, 
        totalGoals: 0, 
        totalRuns: 0, 
        totalAssists: 0,
        totalRebounds: 0,
        totalSteals: 0,
        totalBlocks: 0,
        // Baseball specific
        battingAverage: 0,
        era: 0,
        strikeouts: 0,
        homeRuns: 0,
        rbi: 0,
        hits: 0,
        inningsPitched: 0,
        whip: 0
      };
    }

    // For multiple stat entries, sum them up
    const totals = playerStats.reduce((acc, stat) => {
      const newTotals = {
        // General sports stats
        totalPoints: acc.totalPoints + (stat.points || 0),
        totalGoals: acc.totalGoals + (stat.goals || 0),
        totalRuns: acc.totalRuns + (stat.runs || 0),
        totalAssists: acc.totalAssists + (stat.assists || 0),
        totalRebounds: acc.totalRebounds + (stat.rebounds || 0),
        totalSteals: acc.totalSteals + (stat.steals || 0),
        totalBlocks: acc.totalBlocks + (stat.blocks || 0),
        
        // Baseball batting stats
        battingAverage: stat.batting?.battingAverage || acc.battingAverage,
        homeRuns: acc.homeRuns + (stat.batting?.homeRuns || 0),
        rbi: acc.rbi + (stat.batting?.rbi || 0),
        hits: acc.hits + (stat.batting?.hits || 0),
        strikeouts: acc.strikeouts + (stat.batting?.strikeouts || 0),
        walks: acc.walks + (stat.batting?.walks || 0),
        
        // Baseball pitching stats
        era: stat.pitching?.earnedRunAverage || acc.era,
        pitchingStrikeouts: acc.pitchingStrikeouts + (stat.pitching?.strikeouts || 0),
        inningsPitched: acc.inningsPitched + (stat.pitching?.inningsPitched || 0),
        whip: stat.pitching?.whip || acc.whip,
        wins: acc.wins + (stat.pitching?.wins || 0),
        saves: acc.saves + (stat.pitching?.saves || 0),
        
        // Baseball fielding stats
        errors: acc.errors + (stat.fielding?.errors || 0),
        putouts: acc.putouts + (stat.fielding?.putouts || 0),
        assists: acc.assists + (stat.fielding?.assists || 0)
      };
      console.log(`Adding stat:`, stat, `New totals:`, newTotals);
      return newTotals;
    }, {
      // General sports stats
      totalPoints: 0,
      totalGoals: 0,
      totalRuns: 0,
      totalAssists: 0,
      totalRebounds: 0,
      totalSteals: 0,
      totalBlocks: 0,
      
      // Baseball batting stats
      battingAverage: 0,
      homeRuns: 0,
      rbi: 0,
      hits: 0,
      strikeouts: 0,
      walks: 0,
      
      // Baseball pitching stats
      era: 0,
      pitchingStrikeouts: 0,
      inningsPitched: 0,
      whip: 0,
      wins: 0,
      saves: 0,
      
      // Baseball fielding stats
      errors: 0,
      putouts: 0,
      assists: 0
    });

    console.log(`Final totals for ${player.firstName}:`, totals);
    return totals;
  };

  const renderStatDisplay = (stats, isUserTeam = true, playerPosition = "") => {
    const colorClass = isUserTeam ? "text-green-400" : "text-red-400";
    const isPitcher = playerPosition === "P";
    const isBatter = !isPitcher && playerPosition !== "P";

    return (
      <div className="text-right space-y-1 min-w-[120px]">
        {/* Baseball Pitching Stats */}
        {isPitcher && stats.inningsPitched > 0 && (
          <>
            <div className={`${colorClass} font-bold text-sm`}>
              {stats.pitchingStrikeouts} K
            </div>
            <div className="text-blue-400 font-bold text-sm">
              {stats.era.toFixed(2)} ERA
            </div>
            <div className="text-yellow-400 font-bold text-sm">
              {stats.whip.toFixed(2)} WHIP
            </div>
            <div className="text-purple-400 font-bold text-sm">
              {stats.inningsPitched.toFixed(1)} IP
            </div>
            {stats.wins > 0 && (
              <div className="text-green-400 font-bold text-sm">
                {stats.wins} W
              </div>
            )}
            {stats.saves > 0 && (
              <div className="text-orange-400 font-bold text-sm">
                {stats.saves} SV
              </div>
            )}
          </>
        )}

        {/* Baseball Batting Stats */}
        {isBatter && stats.hits > 0 && (
          <>
            <div className={`${colorClass} font-bold text-sm`}>
              {stats.hits} H
            </div>
            {stats.homeRuns > 0 && (
              <div className="text-red-400 font-bold text-sm">
                {stats.homeRuns} HR
              </div>
            )}
            {stats.rbi > 0 && (
              <div className="text-blue-400 font-bold text-sm">
                {stats.rbi} RBI
              </div>
            )}
            <div className="text-yellow-400 font-bold text-sm">
              {stats.battingAverage > 0 ? stats.battingAverage.toFixed(3) : '.000'} AVG
            </div>
            {stats.strikeouts > 0 && (
              <div className="text-gray-400 font-bold text-sm">
                {stats.strikeouts} K
              </div>
            )}
          </>
        )}

        {/* Baseball Fielding Stats (for non-pitchers) */}
        {!isPitcher && (stats.putouts > 0 || stats.assists > 0) && (
          <div className="text-gray-400 text-xs">
            {stats.putouts} PO / {stats.assists} A
          </div>
        )}

        {/* General Sports Stats (Fallback) */}
        {stats.totalPoints > 0 && (
          <div className={`${colorClass} font-bold text-sm`}>
            {stats.totalPoints} PTS
          </div>
        )}
        {stats.totalGoals > 0 && (
          <div className={`${colorClass} font-bold text-sm`}>
            {stats.totalGoals} G
          </div>
        )}
        {stats.totalRuns > 0 && !isBatter && (
          <div className={`${colorClass} font-bold text-sm`}>
            {stats.totalRuns} R
          </div>
        )}
        {stats.totalAssists > 0 && (
          <div className="text-blue-400 font-bold text-sm">
            {stats.totalAssists} A
          </div>
        )}
        {stats.totalRebounds > 0 && (
          <div className="text-yellow-400 font-bold text-sm">
            {stats.totalRebounds} REB
          </div>
        )}
        {stats.totalSteals > 0 && (
          <div className="text-purple-400 font-bold text-sm">
            {stats.totalSteals} STL
          </div>
        )}
        {stats.totalBlocks > 0 && (
          <div className="text-orange-400 font-bold text-sm">
            {stats.totalBlocks} BLK
          </div>
        )}

        {/* Show zero if no stats */}
        {Object.values(stats).every(val => val === 0) && (
          <div className="text-gray-400 text-sm">0</div>
        )}
      </div>
    );
  };

  const renderBaseballPositionBadge = (position) => {
    const positionColors = {
      'P': 'bg-red-500/20 text-red-400 border-red-500/30',
      'C': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      '1B': 'bg-green-500/20 text-green-400 border-green-500/30',
      '2B': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      '3B': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'SS': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'LF': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      'CF': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'RF': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      'DH': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
        positionColors[position] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      }`}>
        {position}
      </span>
    );
  };

  // Get the actual stats data
  const userTeamStats = getPlayerStats(getUserTeamStats());
  const opponentTeamStats = getPlayerStats(getOpponentTeamStats());
  
  // Debug the data
  console.log("=== PLAYERS TAB DEBUG ===");
  debugStats("USER", getUserTeamPlayers(), userTeamStats);
  debugStats("OPPONENT", getOpponentTeamPlayers(), opponentTeamStats);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold mb-4">Player Statistics</h3>

      <div className="grid grid-cols-2 gap-8">
        {/* Your Team Players */}
        <div>
          <h4 className="text-lg font-bold text-green-400 mb-4">
            {getUserTeamName()} Players
          </h4>
          <div className="space-y-3">
            {getUserTeamPlayers().length === 0 ? (
              <p className="text-gray-400 text-center py-4">No players found</p>
            ) : (
              getUserTeamPlayers().map((player) => {
                const stats = renderPlayerStats(player, userTeamStats, "user");
                const playerPosition = player.position || '';
                
                return (
                  <div key={player._id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-semibold">
                            {player.firstName} {player.lastName}
                          </div>
                          {playerPosition && renderBaseballPositionBadge(playerPosition)}
                        </div>
                        <div className="text-gray-400 text-sm">
                          #{player.jerseyNumber || 'N/A'} • {player.position || 'Player'}
                        </div>
                        
                        {/* Additional baseball stats inline */}
                        {(stats.hits > 0 || stats.pitchingStrikeouts > 0) && (
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            {stats.hits > 0 && (
                              <div>
                                <span className="text-green-400">{stats.hits}-{stats.strikeouts}</span> 
                                {stats.battingAverage > 0 && ` • ${stats.battingAverage.toFixed(3)}`}
                                {stats.homeRuns > 0 && ` • ${stats.homeRuns} HR`}
                                {stats.rbi > 0 && ` • ${stats.rbi} RBI`}
                              </div>
                            )}
                            {stats.pitchingStrikeouts > 0 && (
                              <div>
                                <span className="text-red-400">{stats.pitchingStrikeouts} K</span>
                                {stats.era > 0 && ` • ${stats.era.toFixed(2)} ERA`}
                                {stats.whip > 0 && ` • ${stats.whip.toFixed(2)} WHIP`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {renderStatDisplay(stats, true, playerPosition)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Opponent Team Players */}
        <div>
          <h4 className="text-lg font-bold text-red-400 mb-4">
            {getOpponentTeamName()} Players
          </h4>
          <div className="space-y-3">
            {getOpponentTeamPlayers().length === 0 ? (
              <p className="text-gray-400 text-center py-4">No players found</p>
            ) : (
              getOpponentTeamPlayers().map((player) => {
                const stats = renderPlayerStats(player, opponentTeamStats, "opponent");
                const playerPosition = player.position || '';
                
                return (
                  <div key={player._id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-semibold">
                            {player.firstName} {player.lastName}
                          </div>
                          {playerPosition && renderBaseballPositionBadge(playerPosition)}
                        </div>
                        <div className="text-gray-400 text-sm">
                          #{player.jerseyNumber || 'N/A'} • {player.position || 'Player'}
                        </div>
                        
                        {/* Additional baseball stats inline */}
                        {(stats.hits > 0 || stats.pitchingStrikeouts > 0) && (
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            {stats.hits > 0 && (
                              <div>
                                <span className="text-green-400">{stats.hits}-{stats.strikeouts}</span> 
                                {stats.battingAverage > 0 && ` • ${stats.battingAverage.toFixed(3)}`}
                                {stats.homeRuns > 0 && ` • ${stats.homeRuns} HR`}
                                {stats.rbi > 0 && ` • ${stats.rbi} RBI`}
                              </div>
                            )}
                            {stats.pitchingStrikeouts > 0 && (
                              <div>
                                <span className="text-red-400">{stats.pitchingStrikeouts} K</span>
                                {stats.era > 0 && ` • ${stats.era.toFixed(2)} ERA`}
                                {stats.whip > 0 && ` • ${stats.whip.toFixed(2)} WHIP`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {renderStatDisplay(stats, false, playerPosition)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Baseball Legend */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <h5 className="text-sm font-semibold text-gray-400 mb-2">Baseball Stat Legend</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div><span className="text-green-400 font-semibold">H</span> - Hits</div>
          <div><span className="text-red-400 font-semibold">HR</span> - Home Runs</div>
          <div><span className="text-blue-400 font-semibold">RBI</span> - Runs Batted In</div>
          <div><span className="text-yellow-400 font-semibold">AVG</span> - Batting Average</div>
          <div><span className="text-red-400 font-semibold">K</span> - Strikeouts</div>
          <div><span className="text-blue-400 font-semibold">ERA</span> - Earned Run Average</div>
          <div><span className="text-yellow-400 font-semibold">WHIP</span> - Walks + Hits / Inning</div>
          <div><span className="text-purple-400 font-semibold">IP</span> - Innings Pitched</div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayersTab;