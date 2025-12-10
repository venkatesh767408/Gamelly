import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";

const ScoringTab = ({ 
  scoringEvents, 
  baseGame, 
  teamNames 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FiAward />
        Scoring Timeline
      </h3>

      {scoringEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <FiAward className="text-4xl mx-auto mb-2 opacity-50" />
          <p>No scoring events yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {scoringEvents.map((event, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                event.team === "home"
                  ? "bg-blue-500/10 border-blue-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      event.team === "home" ? "bg-blue-500" : "bg-red-500"
                    }`}
                  />
                  <div>
                    <div className="font-semibold">{event.playerName}</div>
                    <div className="text-sm text-gray-400 capitalize">
                      {event.eventType.replace("_", " ")} • {event.teamName}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {event.points || event.runs || 1}{" "}
                    {baseGame.sport === "Basketball"
                      ? "PTS"
                      : baseGame.sport === "Baseball"
                      ? "RUN"
                      : "GOAL"}
                  </div>
                  <div className="text-sm text-gray-400">
                    {event.minute
                      ? `Min ${event.minute}`
                      : event.gameTime || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ScoringTab;