import { motion } from "framer-motion";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart,
  registerables,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

// Register all required Chart.js components
Chart.register(
  ...registerables,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Legend,
  Title,
  Tooltip
);

const AnalyticsTab = ({
  gameAnalytics,
  currentGame,
  teamNames,
  getUserTeamName,
  getOpponentTeamName,
  getUserTeamStats,
  getOpponentTeamStats,
}) => {
  // If no analytics data, show empty state
  if (!gameAnalytics || (!gameAnalytics.home && !gameAnalytics.away)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="text-gray-400 text-lg">
          No analytics data available yet
        </div>
        <p className="text-gray-500 mt-2">
          Analytics will appear during and after the game
        </p>
      </motion.div>
    );
  }

  const sport = currentGame?.base?.sport || "Football";
  
  // Use the perspective-aware functions to get correct analytics
  const userTeamStatsType = getUserTeamStats ? getUserTeamStats() : "home";
  const opponentTeamStatsType = getOpponentTeamStats ? getOpponentTeamStats() : "away";
  
  const userAnalytics = gameAnalytics[userTeamStatsType] || {};
  const opponentAnalytics = gameAnalytics[opponentTeamStatsType] || {};

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Helper components for table format
  const StatItem = ({ label, value }) => (
    <div className="flex justify-between items-center p-2 bg-black/20 rounded">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold">{value || 0}</span>
    </div>
  );

  const ComparativeStat = ({ label, user, opponent }) => {
    const userVal = parseFloat(user) || 0;
    const opponentVal = parseFloat(opponent) || 0;
    const maxVal = Math.max(userVal, opponentVal, 1);

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-blue-400">{getUserTeamName()}</span>
          <span className="text-gray-400">{label}</span>
          <span className="text-red-400">{getOpponentTeamName()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(userVal / maxVal) * 100}%` }}
            />
          </div>
          <div className="text-xs font-semibold w-12 text-center">
            {userVal}-{opponentVal}
          </div>
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${(opponentVal / maxVal) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Table format analytics
  const renderTableAnalytics = () => {
    const renderAnalyticsBySport = (teamAnalytics, teamType) => {
      const analytics = teamAnalytics || {};

      switch (sport) {
        case "Basketball":
          return (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <StatItem label="Points" value={analytics.totalPoints} />
              <StatItem label="Rebounds" value={analytics.totalRebounds} />
              <StatItem label="Assists" value={analytics.totalAssists} />
              <StatItem label="Steals" value={analytics.totalSteals} />
              <StatItem label="Blocks" value={analytics.totalBlocks} />
              <StatItem label="Turnovers" value={analytics.totalTurnovers} />
              <StatItem label="FG%" value={analytics.fgPercentage} />
              <StatItem label="3P%" value={analytics.threePtPercentage} />
              <StatItem label="FT%" value={analytics.ftPercentage} />
              <StatItem label="Efficiency" value={analytics.efficiency} />
            </div>
          );
        case "Football":
          return (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <StatItem label="Goals" value={analytics.totalGoals} />
              <StatItem label="Assists" value={analytics.totalAssists} />
              <StatItem label="Shots" value={analytics.totalShots} />
              <StatItem
                label="Shots on Target"
                value={analytics.totalShotsOnTarget}
              />
              <StatItem label="Shot Accuracy" value={analytics.shotAccuracy} />
              <StatItem label="Passes" value={analytics.totalPasses} />
              <StatItem label="Tackles" value={analytics.totalTackles} />
              <StatItem label="Fouls" value={analytics.totalFouls} />
              <StatItem label="Corners" value={analytics.corners} />
              <StatItem label="Possession" value={analytics.possession} />
            </div>
          );
        case "Baseball":
          return (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <StatItem label="Runs" value={analytics.totalRuns} />
              <StatItem label="Hits" value={analytics.totalHits} />
              <StatItem label="Home Runs" value={analytics.totalHomeRuns} />
              <StatItem label="RBI" value={analytics.totalRBI} />
              <StatItem label="Batting Avg" value={analytics.battingAverage} />
              <StatItem label="Strikeouts" value={analytics.totalStrikeouts} />
              <StatItem label="Walks" value={analytics.totalWalks} />
              <StatItem label="Errors" value={analytics.totalErrors} />
              <StatItem
                label="Pitching K's"
                value={analytics.totalPitchingStrikeouts}
              />
              <StatItem label="ERA" value={analytics.era} />
            </div>
          );
        default:
          return <div>No analytics available</div>;
      }
    };

    const renderComparativeAnalytics = () => {
      switch (sport) {
        case "Basketball":
          return (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <ComparativeStat
                label="Points"
                user={userAnalytics.totalPoints}
                opponent={opponentAnalytics.totalPoints}
              />
              <ComparativeStat
                label="Rebounds"
                user={userAnalytics.totalRebounds}
                opponent={opponentAnalytics.totalRebounds}
              />
              <ComparativeStat
                label="Assists"
                user={userAnalytics.totalAssists}
                opponent={opponentAnalytics.totalAssists}
              />
              <ComparativeStat
                label="Field Goal %"
                user={userAnalytics.fgPercentage}
                opponent={opponentAnalytics.fgPercentage}
              />
              <ComparativeStat
                label="3 Point %"
                user={userAnalytics.threePtPercentage}
                opponent={opponentAnalytics.threePtPercentage}
              />
              <ComparativeStat
                label="Free Throw %"
                user={userAnalytics.ftPercentage}
                opponent={opponentAnalytics.ftPercentage}
              />
            </div>
          );
        case "Football":
          return (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <ComparativeStat
                label="Goals"
                user={userAnalytics.totalGoals}
                opponent={opponentAnalytics.totalGoals}
              />
              <ComparativeStat
                label="Shots"
                user={userAnalytics.totalShots}
                opponent={opponentAnalytics.totalShots}
              />
              <ComparativeStat
                label="Passes"
                user={userAnalytics.totalPasses}
                opponent={opponentAnalytics.totalPasses}
              />
              <ComparativeStat
                label="Tackles"
                user={userAnalytics.totalTackles}
                opponent={opponentAnalytics.totalTackles}
              />
              <ComparativeStat
                label="Fouls"
                user={userAnalytics.totalFouls}
                opponent={opponentAnalytics.totalFouls}
              />
              <ComparativeStat
                label="Possession"
                user={userAnalytics.possession}
                opponent={opponentAnalytics.possession}
              />
            </div>
          );
        default:
          return <div>Comparative analytics not available for this sport</div>;
      }
    };

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          📊 Detailed Statistics
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {/* Your Team Analytics */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-lg font-bold text-green-400 mb-4">
              {getUserTeamName()} Analytics
            </h4>
            {renderAnalyticsBySport(userAnalytics, getUserTeamName())}
          </div>

          {/* Opponent Team Analytics */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-lg font-bold text-red-400 mb-4">
              {getOpponentTeamName()} Analytics
            </h4>
            {renderAnalyticsBySport(opponentAnalytics, getOpponentTeamName())}
          </div>
        </div>

        {/* Comparative Analytics */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            📈 Comparative Analysis
          </h4>
          {renderComparativeAnalytics()}
        </div>
      </div>
    );
  };

  // Sport-specific charts
  const renderFootballAnalytics = () => (
    <div className="space-y-6">
      {/* Goals Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">
            Goals Distribution
          </h4>
          <div className="h-64">
            <Bar
              data={{
                labels: [getUserTeamName(), getOpponentTeamName()],
                datasets: [
                  {
                    label: "Goals",
                    data: [
                      userAnalytics.totalGoals || 0,
                      opponentAnalytics.totalGoals || 0,
                    ],
                    backgroundColor: [
                      "rgba(54, 162, 235, 0.8)",
                      "rgba(255, 99, 132, 0.8)",
                    ],
                    borderColor: [
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">
            Shots Accuracy
          </h4>
          <div className="h-64">
            <Doughnut
              data={{
                labels: ["On Target", "Off Target"],
                datasets: [
                  {
                    data: [
                      userAnalytics.totalShotsOnTarget || 0,
                      (userAnalytics.totalShots || 0) -
                        (userAnalytics.totalShotsOnTarget || 0),
                    ],
                    backgroundColor: [
                      "rgba(75, 192, 192, 0.8)",
                      "rgba(255, 159, 64, 0.8)",
                    ],
                    borderColor: [
                      "rgba(75, 192, 192, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={pieChartOptions}
            />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">
            Team Performance
          </h4>
          <div className="h-64">
            <Bar
              data={{
                labels: ["Shots", "Passes", "Tackles", "Fouls"],
                datasets: [
                  {
                    label: getUserTeamName(),
                    data: [
                      userAnalytics.totalShots || 0,
                      userAnalytics.totalPasses || 0,
                      userAnalytics.totalTackles || 0,
                      userAnalytics.totalFouls || 0,
                    ],
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                  },
                  {
                    label: getOpponentTeamName(),
                    data: [
                      opponentAnalytics.totalShots || 0,
                      opponentAnalytics.totalPasses || 0,
                      opponentAnalytics.totalTackles || 0,
                      opponentAnalytics.totalFouls || 0,
                    ],
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">
            Possession & Accuracy
          </h4>
          <div className="h-64">
            <Bar
              data={{
                labels: ["Possession", "Pass Accuracy", "Shot Accuracy"],
                datasets: [
                  {
                    label: getUserTeamName(),
                    data: [
                      parseFloat(userAnalytics.possession) || 50,
                      parseFloat(userAnalytics.passingAccuracy) || 0,
                      parseFloat(userAnalytics.shotAccuracy) || 0,
                    ],
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                  },
                  {
                    label: getOpponentTeamName(),
                    data: [
                      parseFloat(opponentAnalytics.possession) || 50,
                      parseFloat(opponentAnalytics.passingAccuracy) || 0,
                      parseFloat(opponentAnalytics.shotAccuracy) || 0,
                    ],
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      {/* Match Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">Corners</h4>
          <div className="h-48">
            <Pie
              data={{
                labels: [getUserTeamName(), getOpponentTeamName()],
                datasets: [
                  {
                    data: [
                      userAnalytics.corners || 0,
                      opponentAnalytics.corners || 0,
                    ],
                    backgroundColor: [
                      "rgba(54, 162, 235, 0.8)",
                      "rgba(255, 99, 132, 0.8)",
                    ],
                    borderColor: [
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={pieChartOptions}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">Cards</h4>
          <div className="h-48">
            <Bar
              data={{
                labels: ["Yellow", "Red"],
                datasets: [
                  {
                    label: getUserTeamName(),
                    data: [
                      userAnalytics.totalYellowCards || 0,
                      userAnalytics.totalRedCards || 0,
                    ],
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
                  {
                    label: getOpponentTeamName(),
                    data: [
                      opponentAnalytics.totalYellowCards || 0,
                      opponentAnalytics.totalRedCards || 0,
                    ],
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">Offsides</h4>
          <div className="h-48">
            <Doughnut
              data={{
                labels: [getUserTeamName(), getOpponentTeamName()],
                datasets: [
                  {
                    data: [
                      userAnalytics.offsides || 0,
                      opponentAnalytics.offsides || 0,
                    ],
                    backgroundColor: [
                      "rgba(54, 162, 235, 0.8)",
                      "rgba(255, 99, 132, 0.8)",
                    ],
                    borderColor: [
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={pieChartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBasketballAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">
            Points Distribution
          </h4>
          <div className="h-64">
            <Bar
              data={{
                labels: [getUserTeamName(), getOpponentTeamName()],
                datasets: [
                  {
                    label: "Total Points",
                    data: [
                      userAnalytics.totalPoints || 0,
                      opponentAnalytics.totalPoints || 0,
                    ],
                    backgroundColor: [
                      "rgba(54, 162, 235, 0.8)",
                      "rgba(255, 99, 132, 0.8)",
                    ],
                    borderColor: [
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">
            Shooting Percentage
          </h4>
          <div className="h-64">
            <Bar
              data={{
                labels: ["FG%", "3P%", "FT%"],
                datasets: [
                  {
                    label: getUserTeamName(),
                    data: [
                      parseFloat(userAnalytics.fgPercentage) || 0,
                      parseFloat(userAnalytics.threePtPercentage) || 0,
                      parseFloat(userAnalytics.ftPercentage) || 0,
                    ],
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
                  {
                    label: getOpponentTeamName(),
                    data: [
                      parseFloat(opponentAnalytics.fgPercentage) || 0,
                      parseFloat(opponentAnalytics.threePtPercentage) || 0,
                      parseFloat(opponentAnalytics.ftPercentage) || 0,
                    ],
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-2 text-white text-center">Rebounds</h4>
          <div className="h-40">
            <Pie
              data={{
                labels: [getUserTeamName(), getOpponentTeamName()],
                datasets: [
                  {
                    data: [
                      userAnalytics.totalRebounds || 0,
                      opponentAnalytics.totalRebounds || 0,
                    ],
                    backgroundColor: [
                      "rgba(54, 162, 235, 0.8)",
                      "rgba(255, 99, 132, 0.8)",
                    ],
                  },
                ],
              }}
              options={pieChartOptions}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-2 text-white text-center">Assists</h4>
          <div className="h-40">
            <Pie
              data={{
                labels: [getUserTeamName(), getOpponentTeamName()],
                datasets: [
                  {
                    data: [
                      userAnalytics.totalAssists || 0,
                      opponentAnalytics.totalAssists || 0,
                    ],
                    backgroundColor: [
                      "rgba(75, 192, 192, 0.8)",
                      "rgba(255, 159, 64, 0.8)",
                    ],
                  },
                ],
              }}
              options={pieChartOptions}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-2 text-white text-center">Steals</h4>
          <div className="h-40">
            <Pie
              data={{
                labels: [getUserTeamName(), getOpponentTeamName()],
                datasets: [
                  {
                    data: [
                      userAnalytics.totalSteals || 0,
                      opponentAnalytics.totalSteals || 0,
                    ],
                    backgroundColor: [
                      "rgba(153, 102, 255, 0.8)",
                      "rgba(255, 205, 86, 0.8)",
                    ],
                  },
                ],
              }}
              options={pieChartOptions}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-2 text-white text-center">Blocks</h4>
          <div className="h-40">
            <Pie
              data={{
                labels: [getUserTeamName(), getOpponentTeamName()],
                datasets: [
                  {
                    data: [
                      userAnalytics.totalBlocks || 0,
                      opponentAnalytics.totalBlocks || 0,
                    ],
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.8)",
                      "rgba(54, 162, 235, 0.8)",
                    ],
                  },
                ],
              }}
              options={pieChartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBaseballAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">Runs & Hits</h4>
          <div className="h-64">
            <Bar
              data={{
                labels: ["Runs", "Hits", "Home Runs"],
                datasets: [
                  {
                    label: getUserTeamName(),
                    data: [
                      userAnalytics.totalRuns || 0,
                      userAnalytics.totalHits || 0,
                      userAnalytics.totalHomeRuns || 0,
                    ],
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
                  {
                    label: getOpponentTeamName(),
                    data: [
                      opponentAnalytics.totalRuns || 0,
                      opponentAnalytics.totalHits || 0,
                      opponentAnalytics.totalHomeRuns || 0,
                    ],
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-bold mb-4 text-white text-center">
            Pitching & Fielding
          </h4>
          <div className="h-64">
            <Bar
              data={{
                labels: ["Strikeouts", "Walks", "Errors"],
                datasets: [
                  {
                    label: getUserTeamName(),
                    data: [
                      userAnalytics.totalStrikeouts || 0,
                      userAnalytics.totalWalks || 0,
                      userAnalytics.totalErrors || 0,
                    ],
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                  {
                    label: getOpponentTeamName(),
                    data: [
                      opponentAnalytics.totalStrikeouts || 0,
                      opponentAnalytics.totalWalks || 0,
                      opponentAnalytics.totalErrors || 0,
                    ],
                    backgroundColor: "rgba(255, 159, 64, 0.6)",
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderChartAnalytics = () => {
    switch (sport) {
      case "Basketball":
        return renderBasketballAnalytics();
      case "Baseball":
        return renderBaseballAnalytics();
      case "Football":
      default:
        return renderFootballAnalytics();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          <span className="font-semibold">Live Analytics Dashboard</span>
        </div>
        <p className="text-blue-300 text-sm mt-1">
          Real-time statistics and performance metrics for both teams
        </p>
      </div>

      {/* Tables Section */}
      {renderTableAnalytics()}

      {/* Charts Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          📈 Visual Analytics
        </h3>
        {renderChartAnalytics()}
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {userAnalytics.totalGoals ||
              userAnalytics.totalPoints ||
              userAnalytics.totalRuns ||
              0}
          </div>
          <div className="text-sm text-gray-400 mt-1">{getUserTeamName()}</div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-2xl font-bold text-green-400">
            {userAnalytics.totalShotsOnTarget ||
              userAnalytics.fgPercentage ||
              userAnalytics.battingAverage ||
              "0%"}
          </div>
          <div className="text-sm text-gray-400 mt-1">Accuracy</div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-2xl font-bold text-red-400">
            {opponentAnalytics.totalGoals ||
              opponentAnalytics.totalPoints ||
              opponentAnalytics.totalRuns ||
              0}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {getOpponentTeamName()}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {userAnalytics.possession || "50%"}
          </div>
          <div className="text-sm text-gray-400 mt-1">Possession</div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsTab;