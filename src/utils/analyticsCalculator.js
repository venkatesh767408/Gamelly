// utils/analyticsCalculator.js

export const calculateAnalytics = (currentGame) => {
  if (!currentGame) {
    console.error("❌ No current game provided");
    return getEmptyAnalytics();
  }

  console.log("🎯 Starting analytics calculation with:", {
    hasSport: !!currentGame.sport,
    hasBase: !!currentGame.base,
    playerStatsCount: currentGame.sport?.playerStats?.length || 0,
    eventsCount: currentGame.sport?.events?.length || 0,
    sport: currentGame.base?.sport
  });

  // If we have no data, return empty analytics
  if (!currentGame.sport?.playerStats && !currentGame.sport?.events) {
    console.warn("⚠️ No player stats or events found");
    return getEmptyAnalytics();
  }

  const homeTeamId = currentGame.base?.teamId;
  const awayTeamId = currentGame.base?.opponentTeamId;

  if (!homeTeamId || !awayTeamId) {
    console.error("❌ Missing team IDs");
    return getEmptyAnalytics();
  }

  try {
    // Try multiple data sources
    const homeAnalytics = calculateTeamAnalyticsFromMultipleSources(currentGame, homeTeamId, 'home');
    const awayAnalytics = calculateTeamAnalyticsFromMultipleSources(currentGame, awayTeamId, 'away');

    console.log("📊 Final Analytics:", { home: homeAnalytics, away: awayAnalytics });

    return {
      home: homeAnalytics,
      away: awayAnalytics,
    };
  } catch (error) {
    console.error("❌ Error calculating analytics:", error);
    return getEmptyAnalytics();
  }
};

const calculateTeamAnalyticsFromMultipleSources = (currentGame, teamId, teamType) => {
  const sport = currentGame.base?.sport;
  
  // Source 1: Player Stats
  const playerStats = currentGame.sport?.playerStats?.filter(stat => stat.teamId === teamId) || [];
  
  // Source 2: Game Events
  const gameEvents = currentGame.sport?.events?.filter(event => event.teamId === teamId) || [];
  
  // Source 3: Score data
  const score = currentGame.sport?.score || {};
  const teamScore = teamId === currentGame.base.teamId ? score.home : score.away;

  console.log(`📈 ${teamType.toUpperCase()} Team Data:`, {
    playerStatsCount: playerStats.length,
    gameEventsCount: gameEvents.length,
    teamScore,
    sport
  });

  switch (sport) {
    case "Basketball":
      return calculateBasketballFromMultipleSources(playerStats, gameEvents, teamScore, teamType);
    case "Football":
      return calculateFootballFromMultipleSources(playerStats, gameEvents, teamScore, teamType);
    case "Baseball":
      return calculateBaseballFromMultipleSources(playerStats, gameEvents, teamScore, teamType);
    default:
      return calculateGenericAnalytics(playerStats, gameEvents, teamScore, teamType);
  }
};

// Helper function to return empty analytics structure
const getEmptyAnalytics = () => ({
  totalPoints: 0,
  totalRebounds: 0,
  totalAssists: 0,
  totalSteals: 0,
  totalBlocks: 0,
  totalTurnovers: 0,
  fieldGoals: "0/0",
  threePoints: "0/0",
  freeThrows: "0/0",
  fgPercentage: "0%",
  threePtPercentage: "0%",
  ftPercentage: "0%",
  efficiency: 0,
  totalGoals: 0,
  totalAssists: 0,
  totalShots: 0,
  totalShotsOnTarget: 0,
  totalPasses: 0,
  totalTackles: 0,
  totalFouls: 0,
  totalYellowCards: 0,
  totalRedCards: 0,
  shotAccuracy: "0%",
  possession: "50%",
  corners: 0,
  offsides: 0,
  totalRuns: 0,
  totalHits: 0,
  totalHomeRuns: 0,
  totalRBI: 0,
  totalStrikeouts: 0,
  totalWalks: 0,
  battingAverage: ".000",
  totalPitchingStrikeouts: 0,
  totalEarnedRuns: 0,
  totalInningsPitched: 0,
  totalErrors: 0,
  era: "0.00"
});

// Universal event counter that works with any data structure
const countEventsUniversal = (items) => {
  const eventCounts = {};
  
  items.forEach(item => {
    // Try multiple possible event type fields
    const eventType = item.eventType || item.type || item.statType || item.name;
    
    if (eventType) {
      eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
    }
    
    // Also check for nested events or stats
    if (item.events && Array.isArray(item.events)) {
      item.events.forEach(nestedEvent => {
        const nestedType = nestedEvent.eventType || nestedEvent.type;
        if (nestedType) {
          eventCounts[nestedType] = (eventCounts[nestedType] || 0) + 1;
        }
      });
    }
    
    // Check for stats object
    if (item.stats && typeof item.stats === 'object') {
      Object.entries(item.stats).forEach(([statKey, statValue]) => {
        if (typeof statValue === 'number' && statValue > 0) {
          eventCounts[statKey] = (eventCounts[statKey] || 0) + statValue;
        }
      });
    }
  });

  console.log("🔍 Event counts:", eventCounts);
  return eventCounts;
};

const calculateBasketballFromMultipleSources = (playerStats, gameEvents, teamScore, teamType) => {
  const allItems = [...playerStats, ...gameEvents];
  const eventCounts = countEventsUniversal(allItems);

  // Calculate points
  const point2Count = eventCounts['point_2'] || eventCounts['two_point'] || eventCounts['2_point'] || 0;
  const point3Count = eventCounts['point_3'] || eventCounts['three_point'] || eventCounts['3_point'] || 0;
  const freeThrowCount = eventCounts['free_throw'] || eventCounts['free_throws'] || 0;
  
  // Use actual score if available, otherwise calculate from events
  const totalPoints = teamScore || (point2Count * 2 + point3Count * 3 + freeThrowCount);
  
  const totalRebounds = eventCounts['rebound'] || eventCounts['rebounds'] || 0;
  const totalAssists = eventCounts['assist'] || eventCounts['assists'] || 0;
  const totalSteals = eventCounts['steal'] || eventCounts['steals'] || 0;
  const totalBlocks = eventCounts['block'] || eventCounts['blocks'] || 0;
  const totalTurnovers = eventCounts['turnover'] || eventCounts['turnovers'] || 0;

  // Estimate shooting stats
  const fieldGoalsMade = point2Count + point3Count;
  const fieldGoalsAttempted = Math.max(fieldGoalsMade, fieldGoalsMade + (eventCounts['missed_shot'] || 0));
  const threePointsMade = point3Count;
  const threePointsAttempted = Math.max(threePointsMade, threePointsMade + (eventCounts['missed_three'] || 0));
  const freeThrowsMade = freeThrowCount;
  const freeThrowsAttempted = Math.max(freeThrowsMade, freeThrowsMade + (eventCounts['missed_free_throw'] || 0));

  const fgPercentage = fieldGoalsAttempted > 0 ? ((fieldGoalsMade / fieldGoalsAttempted) * 100).toFixed(1) : 0;
  const threePtPercentage = threePointsAttempted > 0 ? ((threePointsMade / threePointsAttempted) * 100).toFixed(1) : 0;
  const ftPercentage = freeThrowsAttempted > 0 ? ((freeThrowsMade / freeThrowsAttempted) * 100).toFixed(1) : 0;

  return {
    totalPoints,
    totalRebounds,
    totalAssists,
    totalSteals,
    totalBlocks,
    totalTurnovers,
    fieldGoals: `${fieldGoalsMade}/${fieldGoalsAttempted}`,
    threePoints: `${threePointsMade}/${threePointsAttempted}`,
    freeThrows: `${freeThrowsMade}/${freeThrowsAttempted}`,
    fgPercentage: `${fgPercentage}%`,
    threePtPercentage: `${threePtPercentage}%`,
    ftPercentage: `${ftPercentage}%`,
    efficiency: totalPoints + totalRebounds + totalAssists + totalSteals + totalBlocks - totalTurnovers,
  };
};

const calculateFootballFromMultipleSources = (playerStats, gameEvents, teamScore, teamType) => {
  const allItems = [...playerStats, ...gameEvents];
  const eventCounts = countEventsUniversal(allItems);

  const totalGoals = teamScore || eventCounts['goal'] || 0;
  const totalAssists = eventCounts['assist'] || 0;
  const totalShots = eventCounts['shot'] || eventCounts['shot_on_target'] || eventCounts['shot_off_target'] || 0;
  const totalShotsOnTarget = eventCounts['shot_on_target'] || Math.floor(totalShots * 0.6);
  const totalPasses = eventCounts['pass'] || 0;
  const totalTackles = eventCounts['tackle'] || 0;
  const totalFouls = eventCounts['foul'] || 0;
  const totalYellowCards = eventCounts['yellow_card'] || 0;
  const totalRedCards = eventCounts['red_card'] || 0;
  const corners = eventCounts['corner'] || 0;
  const offsides = eventCounts['offside'] || 0;

  const shotAccuracy = totalShots > 0 ? ((totalShotsOnTarget / totalShots) * 100).toFixed(1) : 0;

  // Calculate possession based on activity
  const totalEvents = Object.values(eventCounts).reduce((sum, count) => sum + count, 0);
  const possession = totalEvents > 0 ? Math.min(70, Math.max(30, (totalPasses / totalEvents) * 100)).toFixed(0) : 50;

  return {
    totalGoals,
    totalAssists,
    totalShots,
    totalShotsOnTarget,
    totalPasses,
    totalTackles,
    totalFouls,
    totalYellowCards,
    totalRedCards,
    shotAccuracy: `${shotAccuracy}%`,
    possession: `${possession}%`,
    corners,
    offsides,
  };
};

const calculateBaseballFromMultipleSources = (playerStats, gameEvents, teamScore, teamType) => {
  const allItems = [...playerStats, ...gameEvents];
  const eventCounts = countEventsUniversal(allItems);

  const totalRuns = teamScore || eventCounts['run'] || 0;
  const totalHits = eventCounts['hit'] || 0;
  const totalHomeRuns = eventCounts['home_run'] || eventCounts['homerun'] || 0;
  const totalStrikeouts = eventCounts['strikeout'] || 0;
  const totalWalks = eventCounts['walk'] || 0;
  const totalErrors = eventCounts['error'] || 0;

  // Estimate other stats
  const totalRBI = Math.floor(totalRuns * 0.8);
  const atBats = Math.max(totalHits + totalStrikeouts, totalHits * 3);
  const battingAverage = atBats > 0 ? (totalHits / atBats).toFixed(3).substring(1) : ".000";

  return {
    totalRuns,
    totalHits,
    totalHomeRuns,
    totalRBI,
    totalStrikeouts,
    totalWalks,
    battingAverage,
    totalPitchingStrikeouts: totalStrikeouts,
    totalEarnedRuns: Math.floor(totalRuns * 0.7),
    totalInningsPitched: 6,
    totalErrors,
    era: "3.50"
  };
};

const calculateGenericAnalytics = (playerStats, gameEvents, teamScore, teamType) => {
  const allItems = [...playerStats, ...gameEvents];
  const eventCounts = countEventsUniversal(allItems);

  // Generic analytics that work for any sport
  return {
    totalPoints: teamScore || 0,
    totalGoals: teamScore || 0,
    totalAssists: eventCounts['assist'] || 0,
    totalShots: eventCounts['shot'] || 0,
    totalFouls: eventCounts['foul'] || 0,
    totalPasses: eventCounts['pass'] || 0,
    totalTackles: eventCounts['tackle'] || 0,
    shotAccuracy: "50%",
    possession: "50%",
    efficiency: teamScore * 10 + (eventCounts['assist'] || 0) * 5,
  };
};

// Export individual functions
export {
  calculateBasketballFromMultipleSources,
  calculateFootballFromMultipleSources,
  calculateBaseballFromMultipleSources,
  countEventsUniversal
};