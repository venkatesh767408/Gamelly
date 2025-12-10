import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";

import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiFlag,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const LeftSidebar = ({ activeTab, setActiveTab, team, sportIcon }) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  const tabs = [
    { id: "HOME", icon: <FiHome />, label: "Home" },
    { id: "SCHEDULE", icon: <FiCalendar />, label: "Schedule" },
    { id: "TEAM", icon: <FiUsers />, label: "Team" },
    { id: "STATS", icon: <FiBarChart2 />, label: "Stats" },
    { id: "OPPONENTS", icon: <FiFlag />, label: "Opponents" },
    // { id: "TOOLS", icon: <FiSettings />, label: "Tools" },
  ];

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const DesktopSidebar = () => (
    <motion.div
      className="hidden hide-scrollbar  lg:flex bg-[#0F172B] border-r border-white/10 text-black p-6 w-[280px] h-screen fixed flex-col shadow-xl overflow-y-auto"
      initial={hasAnimated ? false : { x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <motion.div
        className="flex items-center gap-4 mb-8"
        initial={hasAnimated ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <img
            src={sportIcon}
            className="h-16 w-16 border-1 border-white rounded-full p-2 shadow-lg"
            alt="Team Logo"
          />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-white">
            {team?.teamName || "Man City"}
          </h1>
          <p className="text-sm text-white">
            <span className="font-medium text-white">Coach:</span>{" "}
            {team?.createdBy?.username || "undertaker"}
          </p>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/5 flex items-center gap-3 rounded-lg p-3 mb-6"
        whileHover={{ scale: 1.02 }}
        initial={hasAnimated ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <FaLocationDot size={25} className="text-gray-300" />
        <p className="text-xl uppercase text-white font-medium">
          {team.location}
        </p>
      </motion.div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {tabs.map((tab, index) => (
            <motion.li
              key={tab.id}
              initial={hasAnimated ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.5 }}
            >
              <motion.button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-gray-800 text-white shadow-md"
                    : "text-[#9AEA62] hover:bg-white/10"
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.span
                    className="ml-auto h-2 w-2 bg-white rounded-full"
                    layoutId="activeTabIndicator"
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                )}
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <motion.button
        className="flex items-center gap-2 text-gray-300 hover:text-white mt-4 text-sm mb-6"
        whileHover={{ x: 3 }}
        initial={hasAnimated ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <FiLogOut />
        <span>Sign Out</span>
      </motion.button>
    </motion.div>
  );

  const MobileBottomNav = () => (
    <motion.div
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0F172B] border-t border-white/10 z-50"
      initial={hasAnimated ? false : { y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Team Info Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5">
        <div className="flex items-center gap-2">
          <img
            src={sportIcon}
            className="h-8 w-8 border border-white rounded-full"
            alt="Team Logo"
          />
          <div>
            <h3 className="text-white text-sm font-bold">
              {team?.teamName || "Man City"}
            </h3>
            <p className="text-gray-400 text-xs">
              {team?.createdBy?.name || "undertaker"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <FaLocationDot className="text-gray-400 text-sm" />
          <span className="text-gray-400 text-xs">NY</span>
        </div>
      </div>

      <div className="flex justify-around items-center py-3">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? "text-[#9AEA62] bg-white/10"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab.id)}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className="h-1 w-1 bg-[#9AEA62] rounded-full mt-1"
                layoutId="mobileActiveIndicator"
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const TabletBottomNav = () => (
    <motion.div
      className="hidden md:flex lg:hidden fixed bottom-0 left-0 right-0 bg-[#0F172B] border-t border-white/10 z-50"
      initial={hasAnimated ? false : { y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div className="flex justify-around items-center py-4 w-full">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`flex flex-col items-center p-3 rounded-xl transition-all min-w-[70px] ${
              activeTab === tab.id
                ? "text-[#9AEA62] bg-white/10"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl mb-2">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className="h-1.5 w-1.5 bg-[#9AEA62] rounded-full mt-1"
                layoutId="tabletActiveIndicator"
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileBottomNav />
      <TabletBottomNav />
      <style jsx>{`
        @media (max-width: 1023px) {
          :global(main) {
            padding-bottom: 100px;
          }
        }
        @media (max-width: 767px) {
          :global(main) {
            padding-bottom: 90px;
          }
        }
      `}</style>
    </>
  );
};

export default LeftSidebar;
