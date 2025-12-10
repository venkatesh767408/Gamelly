// utils/sportConfigs.js

export const getSportConfig = (sport) => {
  const configs = {
    Football: {
      periods: 2,
      periodName: "Half",
      periodLength: 45,
      stats: [
        {
          type: "goal",
          name: "Goal",
          icon: "⚽",
          points: 1,
          color: "bg-green-500",
          category: "attacking"
        },
        {
          type: "assist",
          name: "Assist",
          icon: "🎯",
          points: 0,
          color: "bg-blue-500",
          category: "attacking"
        },
        {
          type: "shot",
          name: "Shot",
          icon: "🎯",
          points: 0,
          color: "bg-yellow-500",
          category: "attacking"
        },
        {
          type: "shot_on_target",
          name: "Shot on Target",
          icon: "🎯",
          points: 0,
          color: "bg-green-400",
          category: "attacking"
        },
        {
          type: "shot_off_target",
          name: "Shot off Target",
          icon: "🎯",
          points: 0,
          color: "bg-yellow-400",
          category: "attacking"
        },
        {
          type: "pass",
          name: "Pass",
          icon: "⇄",
          points: 0,
          color: "bg-blue-400",
          category: "attacking"
        },
        {
          type: "cross",
          name: "Cross",
          icon: "⤴️",
          points: 0,
          color: "bg-purple-400",
          category: "attacking"
        },
        {
          type: "through_ball",
          name: "Through Ball",
          icon: "↗️",
          points: 0,
          color: "bg-indigo-400",
          category: "attacking"
        },
        {
          type: "tackle",
          name: "Tackle",
          icon: "🛡️",
          points: 0,
          color: "bg-red-500",
          category: "defending"
        },
        {
          type: "interception",
          name: "Interception",
          icon: "✋",
          points: 0,
          color: "bg-orange-500",
          category: "defending"
        },
        {
          type: "clearance",
          name: "Clearance",
          icon: "👟",
          points: 0,
          color: "bg-gray-500",
          category: "defending"
        },
        {
          type: "save",
          name: "Save",
          icon: "🧤",
          points: 0,
          color: "bg-teal-500",
          category: "defending"
        },
        {
          type: "block",
          name: "Block",
          icon: "🚫",
          points: 0,
          color: "bg-red-400",
          category: "defending"
        },
        {
          type: "foul",
          name: "Foul",
          icon: "⚠️",
          points: 0,
          color: "bg-orange-500",
          category: "defending"
        },
        {
          type: "yellow_card",
          name: "Yellow Card",
          icon: "🟨",
          points: 0,
          color: "bg-yellow-400",
          category: "discipline"
        },
        {
          type: "red_card",
          name: "Red Card",
          icon: "🟥",
          points: 0,
          color: "bg-red-600",
          category: "discipline"
        },
        {
          type: "offside",
          name: "Offside",
          icon: "🚩",
          points: 0,
          color: "bg-gray-400",
          category: "defending"
        },
        {
          type: "corner",
          name: "Corner",
          icon: "⤴️",
          points: 0,
          color: "bg-blue-300",
          category: "attacking"
        },
        {
          type: "free_kick",
          name: "Free Kick",
          icon: "🎯",
          points: 0,
          color: "bg-green-300",
          category: "attacking"
        },
      ],
    },
    Basketball: {
      periods: 4,
      periodName: "Quarter",
      periodLength: 12,
      stats: [
        {
          type: "point_2",
          name: "2 Points",
          icon: "2️⃣",
          points: 2,
          color: "bg-green-500",
        },
        {
          type: "point_3",
          name: "3 Points",
          icon: "3️⃣",
          points: 3,
          color: "bg-blue-500",
        },
        {
          type: "free_throw",
          name: "Free Throw",
          icon: "🏀",
          points: 1,
          color: "bg-yellow-500",
        },
        {
          type: "rebound",
          name: "Rebound",
          icon: "📊",
          points: 0,
          color: "bg-purple-500",
        },
        {
          type: "assist",
          name: "Assist",
          icon: "🎯",
          points: 0,
          color: "bg-indigo-500",
        },
        {
          type: "steal",
          name: "Steal",
          icon: "🦹",
          points: 0,
          color: "bg-red-500",
        },
        {
          type: "block",
          name: "Block",
          icon: "🚫",
          points: 0,
          color: "bg-gray-500",
        },
      ],
    },
    Baseball: {
      periods: 9,
      periodName: "Inning",
      periodLength: null,
      stats: [
        // Batting events
        {
          type: "at_bat_start",
          name: "At Bat Start",
          icon: "⚾",
          points: 0,
          color: "bg-gray-400",
          category: "batting"
        },
        {
          type: "pitch",
          name: "Pitch",
          icon: "🎯",
          points: 0,
          color: "bg-gray-500",
          category: "pitching"
        },
        {
          type: "ball",
          name: "Ball",
          icon: "🟢",
          points: 0,
          color: "bg-green-400",
          category: "pitching"
        },
        {
          type: "strike",
          name: "Strike",
          icon: "🔴",
          points: 0,
          color: "bg-red-400",
          category: "pitching"
        },
        {
          type: "foul",
          name: "Foul",
          icon: "⚠️",
          points: 0,
          color: "bg-yellow-400",
          category: "batting"
        },
        {
          type: "hit_by_pitch",
          name: "Hit By Pitch",
          icon: "💥👤",
          points: 0,
          color: "bg-orange-500",
          category: "batting"
        },
        {
          type: "single",
          name: "Single",
          icon: "1️⃣",
          points: 0,
          color: "bg-blue-400",
          category: "batting"
        },
        {
          type: "double",
          name: "Double",
          icon: "2️⃣",
          points: 0,
          color: "bg-blue-500",
          category: "batting"
        },
        {
          type: "triple",
          name: "Triple",
          icon: "3️⃣",
          points: 0,
          color: "bg-blue-600",
          category: "batting"
        },
        {
          type: "home_run",
          name: "Home Run",
          icon: "💥",
          points: 1,
          color: "bg-green-500",
          category: "batting"
        },
        {
          type: "inside_park_homerun",
          name: "Inside Park HR",
          icon: "🏃💨",
          points: 1,
          color: "bg-green-600",
          category: "batting"
        },
        {
          type: "ground_rule_double",
          name: "Ground Rule Double",
          icon: "📏2️⃣",
          points: 0,
          color: "bg-blue-700",
          category: "batting"
        },
        {
          type: "bunt",
          name: "Bunt",
          icon: "🎯⬇️",
          points: 0,
          color: "bg-gray-500",
          category: "batting"
        },
        {
          type: "bunt_single",
          name: "Bunt Single",
          icon: "1️⃣⬇️",
          points: 0,
          color: "bg-blue-400",
          category: "batting"
        },
        {
          type: "sacrifice_bunt",
          name: "Sacrifice Bunt",
          icon: "🎯⬇️",
          points: 0,
          color: "bg-gray-600",
          category: "batting"
        },
        {
          type: "sacrifice_fly",
          name: "Sacrifice Fly",
          icon: "🎯✈️",
          points: 0,
          color: "bg-gray-400",
          category: "batting"
        },
        {
          type: "fielders_choice",
          name: "Fielder's Choice",
          icon: "🤔",
          points: 0,
          color: "bg-purple-400",
          category: "batting"
        },
        {
          type: "reached_on_error",
          name: "Reached on Error",
          icon: "❌👟",
          points: 0,
          color: "bg-red-300",
          category: "batting"
        },
        {
          type: "strikeout",
          name: "Strikeout",
          icon: "❌",
          points: 0,
          color: "bg-red-500",
          category: "batting"
        },
        {
          type: "strikeout_looking",
          name: "Strikeout Looking",
          icon: "👀❌",
          points: 0,
          color: "bg-red-600",
          category: "batting"
        },
        {
          type: "strikeout_swinging",
          name: "Strikeout Swinging",
          icon: "💨❌",
          points: 0,
          color: "bg-red-400",
          category: "batting"
        },
        {
          type: "walk",
          name: "Walk",
          icon: "🚶",
          points: 0,
          color: "bg-yellow-500",
          category: "batting"
        },
        {
          type: "intentional_walk",
          name: "Intentional Walk",
          icon: "🎯🚶",
          points: 0,
          color: "bg-yellow-600",
          category: "batting"
        },
        {
          type: "run",
          name: "Run",
          icon: "🏃",
          points: 1,
          color: "bg-green-400",
          category: "batting"
        },
        {
          type: "rbi",
          name: "RBI",
          icon: "📊",
          points: 0,
          color: "bg-purple-500",
          category: "batting"
        },

        // Base running events
        {
          type: "stolen_base",
          name: "Stolen Base",
          icon: "🏃💨",
          points: 0,
          color: "bg-teal-500",
          category: "base_running"
        },
        {
          type: "stolen_base_2nd",
          name: "Stolen Base 2nd",
          icon: "2️⃣🏃",
          points: 0,
          color: "bg-teal-400",
          category: "base_running"
        },
        {
          type: "stolen_base_3rd",
          name: "Stolen Base 3rd",
          icon: "3️⃣🏃",
          points: 0,
          color: "bg-teal-600",
          category: "base_running"
        },
        {
          type: "stolen_base_home",
          name: "Stolen Base Home",
          icon: "🏠🏃",
          points: 0,
          color: "bg-teal-700",
          category: "base_running"
        },
        {
          type: "caught_stealing",
          name: "Caught Stealing",
          icon: "🚫🏃",
          points: 0,
          color: "bg-red-300",
          category: "base_running"
        },
        {
          type: "picked_off",
          name: "Picked Off",
          icon: "🎯🚫",
          points: 0,
          color: "bg-red-200",
          category: "base_running"
        },
        {
          type: "passed_ball",
          name: "Passed Ball",
          icon: "🧤💨",
          points: 0,
          color: "bg-orange-400",
          category: "base_running"
        },
        {
          type: "wild_pitch",
          name: "Wild Pitch",
          icon: "💨⚾",
          points: 0,
          color: "bg-orange-500",
          category: "base_running"
        },
        {
          type: "balk",
          name: "Balk",
          icon: "⚠️🎯",
          points: 0,
          color: "bg-orange-300",
          category: "base_running"
        },
        {
          type: "defensive_indifference",
          name: "Defensive Indifference",
          icon: "😐",
          points: 0,
          color: "bg-gray-300",
          category: "base_running"
        },

        // Defensive events
        {
          type: "putout",
          name: "Putout",
          icon: "👋",
          points: 0,
          color: "bg-green-400",
          category: "fielding"
        },
        {
          type: "assist",
          name: "Assist",
          icon: "🤝",
          points: 0,
          color: "bg-blue-400",
          category: "fielding"
        },
        {
          type: "error",
          name: "Error",
          icon: "❌",
          points: 0,
          color: "bg-red-400",
          category: "fielding"
        },
        {
          type: "double_play",
          name: "Double Play",
          icon: "2️⃣🔄",
          points: 0,
          color: "bg-purple-400",
          category: "fielding"
        },
        {
          type: "triple_play",
          name: "Triple Play",
          icon: "3️⃣🔄",
          points: 0,
          color: "bg-purple-600",
          category: "fielding"
        },
        {
          type: "force_out",
          name: "Force Out",
          icon: "💪",
          points: 0,
          color: "bg-green-300",
          category: "fielding"
        },
        {
          type: "tag_out",
          name: "Tag Out",
          icon: "🏷️",
          points: 0,
          color: "bg-green-500",
          category: "fielding"
        },
        {
          type: "fly_out",
          name: "Fly Out",
          icon: "✈️",
          points: 0,
          color: "bg-blue-300",
          category: "fielding"
        },
        {
          type: "line_out",
          name: "Line Out",
          icon: "➖",
          points: 0,
          color: "bg-blue-400",
          category: "fielding"
        },
        {
          type: "ground_out",
          name: "Ground Out",
          icon: "⬇️",
          points: 0,
          color: "bg-brown-400",
          category: "fielding"
        },
        {
          type: "pop_out",
          name: "Pop Out",
          icon: "⤴️",
          points: 0,
          color: "bg-blue-200",
          category: "fielding"
        },
        {
          type: "infield_fly",
          name: "Infield Fly",
          icon: "📏✈️",
          points: 0,
          color: "bg-gray-400",
          category: "fielding"
        },
        {
          type: "out_at_first",
          name: "Out at First",
          icon: "1️⃣❌",
          points: 0,
          color: "bg-green-400",
          category: "fielding"
        },
        {
          type: "out_at_second",
          name: "Out at Second",
          icon: "2️⃣❌",
          points: 0,
          color: "bg-green-500",
          category: "fielding"
        },
        {
          type: "out_at_third",
          name: "Out at Third",
          icon: "3️⃣❌",
          points: 0,
          color: "bg-green-600",
          category: "fielding"
        },
        {
          type: "out_at_home",
          name: "Out at Home",
          icon: "🏠❌",
          points: 0,
          color: "bg-green-700",
          category: "fielding"
        },

        // Pitching events
        {
          type: "pitch_type_fastball",
          name: "Fastball",
          icon: "💨",
          points: 0,
          color: "bg-red-500",
          category: "pitching"
        },
        {
          type: "pitch_type_curveball",
          name: "Curveball",
          icon: "🔄",
          points: 0,
          color: "bg-blue-500",
          category: "pitching"
        },
        {
          type: "pitch_type_slider",
          name: "Slider",
          icon: "➡️",
          points: 0,
          color: "bg-indigo-500",
          category: "pitching"
        },
        {
          type: "pitch_type_changeup",
          name: "Changeup",
          icon: "🐢",
          points: 0,
          color: "bg-green-500",
          category: "pitching"
        },
        {
          type: "pitch_type_knuckleball",
          name: "Knuckleball",
          icon: "✋",
          points: 0,
          color: "bg-purple-500",
          category: "pitching"
        },
        {
          type: "pitch_type_cutter",
          name: "Cutter",
          icon: "✂️",
          points: 0,
          color: "bg-pink-500",
          category: "pitching"
        },
        {
          type: "pitching_substitution",
          name: "Pitching Substitution",
          icon: "🔄🧢",
          points: 0,
          color: "bg-yellow-400",
          category: "pitching"
        },
        {
          type: "pickoff_attempt",
          name: "Pickoff Attempt",
          icon: "🎯👤",
          points: 0,
          color: "bg-orange-400",
          category: "pitching"
        },
        {
          type: "pitching_strikeout",
          name: "Pitching Strikeout",
          icon: "🔥❌",
          points: 0,
          color: "bg-purple-500",
          category: "pitching"
        },
        {
          type: "pitching_walk",
          name: "Pitching Walk",
          icon: "🎯🚶",
          points: 0,
          color: "bg-purple-400",
          category: "pitching"
        },

        // Game events
        {
          type: "inning_start",
          name: "Inning Start",
          icon: "🔄",
          points: 0,
          color: "bg-gray-400",
          category: "game"
        },
        {
          type: "inning_end",
          name: "Inning End",
          icon: "⏹️",
          points: 0,
          color: "bg-gray-500",
          category: "game"
        },
        {
          type: "pitching_change",
          name: "Pitching Change",
          icon: "🔄🧢",
          points: 0,
          color: "bg-yellow-400",
          category: "game"
        },
        {
          type: "defensive_substitution",
          name: "Defensive Sub",
          icon: "🔄🛡️",
          points: 0,
          color: "bg-yellow-500",
          category: "game"
        },
        {
          type: "offensive_substitution",
          name: "Offensive Sub",
          icon: "🔄⚾",
          points: 0,
          color: "bg-yellow-600",
          category: "game"
        },
        {
          type: "pinch_hitter",
          name: "Pinch Hitter",
          icon: "👤⚾",
          points: 0,
          color: "bg-orange-400",
          category: "game"
        },
        {
          type: "pinch_runner",
          name: "Pinch Runner",
          icon: "👤🏃",
          points: 0,
          color: "bg-orange-500",
          category: "game"
        },
        {
          type: "challenge",
          name: "Challenge",
          icon: "📺",
          points: 0,
          color: "bg-blue-300",
          category: "game"
        },
        {
          type: "challenge_upheld",
          name: "Challenge Upheld",
          icon: "✅📺",
          points: 0,
          color: "bg-green-300",
          category: "game"
        },
        {
          type: "challenge_overturned",
          name: "Challenge Overturned",
          icon: "🔄📺",
          points: 0,
          color: "bg-yellow-300",
          category: "game"
        },
        {
          type: "rain_delay",
          name: "Rain Delay",
          icon: "🌧️",
          points: 0,
          color: "bg-blue-200",
          category: "game"
        },
        {
          type: "injury",
          name: "Injury",
          icon: "🤕",
          points: 0,
          color: "bg-red-200",
          category: "game"
        },
        {
          type: "ejection",
          name: "Ejection",
          icon: "👋",
          points: 0,
          color: "bg-red-600",
          category: "game"
        }
      ],
    },
  };
  return configs[sport] || configs.Football;
};

// 🔥 NEW: Get role-based stats for baseball
export const getBaseballRoleStats = (role) => {
  const baseballConfig = getSportConfig("Baseball");
  
  if (role === "batting") {
    return baseballConfig.stats.filter(stat => 
      stat.category === "batting" || stat.category === "base_running"
    );
  } else if (role === "pitching") {
    return baseballConfig.stats.filter(stat => 
      stat.category === "pitching"
    );
  } else if (role === "fielding") {
    return baseballConfig.stats.filter(stat => 
      stat.category === "fielding"
    );
  } else if (role === "game_management") {
    return baseballConfig.stats.filter(stat => 
      stat.category === "game"
    );
  }
  
  return baseballConfig.stats;
};

// 🔥 NEW: Get baseball position groups
export const getBaseballPositionGroups = () => {
  return {
    pitchers: ["P"],
    catchers: ["C"],
    infielders: ["1B", "2B", "3B", "SS"],
    outfielders: ["LF", "CF", "RF"],
    designated_hitter: ["DH"]
  };
};

// 🔥 NEW: Get baseball batting order positions
export const getBaseballBattingOrder = () => {
  return [
    { order: 1, name: "Leadoff", description: "High OBP, speed" },
    { order: 2, name: "Second", description: "Contact hitter, bat control" },
    { order: 3, name: "Third", description: "Best all-around hitter" },
    { order: 4, name: "Cleanup", description: "Power hitter, RBI producer" },
    { order: 5, name: "Fifth", description: "Power hitter" },
    { order: 6, name: "Sixth", description: "Solid hitter" },
    { order: 7, name: "Seventh", description: "Weaker hitter" },
    { order: 8, name: "Eighth", description: "Defensive specialist" },
    { order: 9, name: "Ninth", description: "Pitcher or second leadoff" }
  ];
};

// 🔥 NEW: Get baseball pitch types
export const getBaseballPitchTypes = () => {
  return [
    { type: "fastball", name: "Fastball", icon: "💨" },
    { type: "curveball", name: "Curveball", icon: "🔄" },
    { type: "slider", name: "Slider", icon: "➡️" },
    { type: "changeup", name: "Changeup", icon: "🐢" },
    { type: "knuckleball", name: "Knuckleball", icon: "✋" },
    { type: "cutter", name: "Cutter", icon: "✂️" },
    { type: "sinker", name: "Sinker", icon: "⬇️" }
  ];
};

// 🔥 NEW: Get baseball hit trajectories
export const getBaseballHitTrajectories = () => {
  return [
    { type: "line_drive", name: "Line Drive", icon: "➡️" },
    { type: "fly_ball", name: "Fly Ball", icon: "⬆️" },
    { type: "ground_ball", name: "Ground Ball", icon: "⬇️" },
    { type: "pop_up", name: "Pop Up", icon: "⤴️" }
  ];
};

// 🔥 NEW: Get baseball hit locations
export const getBaseballHitLocations = () => {
  return [
    { type: "pull", name: "Pull Side", icon: "⬅️" },
    { type: "center", name: "Center Field", icon: "⬆️" },
    { type: "opposite", name: "Opposite Field", icon: "➡️" }
  ];
};

// 🔥 NEW: Get baseball game states
export const getBaseballGameStates = () => {
  return [
    { type: "scheduled", name: "Scheduled", icon: "📅" },
    { type: "warmup", name: "Warmup", icon: "🔥" },
    { type: "in_progress", name: "In Progress", icon: "⚾" },
    { type: "delay", name: "Delay", icon: "⏸️" },
    { type: "inning_break", name: "Inning Break", icon: "🔄" },
    { type: "final", name: "Final", icon: "🏁" },
    { type: "suspended", name: "Suspended", icon: "⏸️" },
    { type: "postponed", name: "Postponed", icon: "❌" },
    { type: "cancelled", name: "Cancelled", icon: "🚫" }
  ];
};

// 🔥 NEW: Get baseball substitution reasons
export const getBaseballSubstitutionReasons = () => {
  return [
    { type: "strategic", name: "Strategic", icon: "🧠" },
    { type: "injury", name: "Injury", icon: "🤕" },
    { type: "pinch_hit", name: "Pinch Hit", icon: "👤⚾" },
    { type: "pinch_run", name: "Pinch Run", icon: "👤🏃" },
    { type: "defensive", name: "Defensive", icon: "🛡️" },
    { type: "pitching", name: "Pitching", icon: "🎯" }
  ];
};

// Helper function to get stat config by type
export const getStatConfig = (sport, statType) => {
  const config = getSportConfig(sport);
  return config.stats.find(stat => stat.type === statType);
};

// Helper function to get available sports
export const getAvailableSports = () => {
  return Object.keys(sportConfigs);
};

// Export individual sport configs if needed elsewhere
export const sportConfigs = {
  Football: getSportConfig("Football"),
  Basketball: getSportConfig("Basketball"),
  Baseball: getSportConfig("Baseball"),
};

export default {
  getSportConfig,
  getBaseballRoleStats,
  getBaseballPositionGroups,
  getBaseballBattingOrder,
  getBaseballPitchTypes,
  getBaseballHitTrajectories,
  getBaseballHitLocations,
  getBaseballGameStates,
  getBaseballSubstitutionReasons,
  getStatConfig,
  getAvailableSports,
  sportConfigs
};