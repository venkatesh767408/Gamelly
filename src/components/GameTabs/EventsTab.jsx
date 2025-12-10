import { motion } from "framer-motion";

const EventsTab = ({ 
  liveEvents, 
  currentGame, 
  teamNames 
}) => {
  // Get events from both liveEvents (real-time) and game data (persisted)
  const allEvents = [
    ...liveEvents,
    ...(currentGame?.sport?.events || [])
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-bold mb-4">Live Events</h3>
      {allEvents.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No events yet</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {allEvents.map((event, index) => (
            <div
              key={event._id || event.timestamp || index}
              className="bg-black/20 p-3 rounded-lg border border-white/5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold capitalize">
                    {event.eventType || event.event?.eventType}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    {event.teamId === currentGame?.base?.teamId
                      ? teamNames.home
                      : teamNames.away}
                  </span>
                  {event.playerName && (
                    <span className="text-gray-400 text-sm ml-2">
                      • {event.playerName}
                    </span>
                  )}
                </div>
                <span className="text-gray-400 text-sm">
                  {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : 'Live'}
                </span>
              </div>
              {event.description && (
                <p className="text-gray-400 text-sm mt-1">{event.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EventsTab;