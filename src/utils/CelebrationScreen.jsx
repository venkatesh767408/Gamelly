import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { FiArrowLeft, FiHome, FiDownload } from "react-icons/fi";

const CelebrationScreen = ({ 
  showCelebration, 
  setShowCelebration, 
  winner, 
  finalScore, 
  teamNames ,
  teamId
}) => {
  const { width, height } = useWindowSize();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    if (showCelebration && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [showCelebration]);

  if (!showCelebration) return null;

  const isDraw = winner === "draw";

  return (
    <>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        gravity={0.3}
        colors={[
          "#9AEA62", // Lime celebration
          "#4ADE80", // Green
          "#22C55E", // Emerald
          "#16A34A", // Deep Emerald
          "#15803D", // Dark Green
          "#FDE047", // Celebration Yellow
          "#FACC15", // Gold Yellow
          "#FB923C", // Orange Pop
          "#F97316", // Vibrant Orange
          "#EF4444", // Red Spark
          "#E11D48", // Pinkish Red
          "#D946EF", // Purple Fire
          "#A855F7", // Celebration Purple
          "#6366F1", // Vibrant Indigo
          "#3B82F6", // Sky Blue
          "#0EA5E9", // Aqua
          "#06B6D4", // Cyan
          "#14B8A6", // Teal
        ]}
      />

      <audio ref={audioRef} src="/cheer.mp3" preload="auto" />

      <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="bg-gray-800 rounded-3xl p-8 max-w-2xl w-full text-center relative overflow-hidden"
        >
          {/* Trophy icon */}
          <motion.div
            initial={{ y: -50, rotate: -30 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            🏆
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl score md:text-5xl font-extrabold uppercase text-white mb-4"
          >
            {isDraw ? "It's a Draw!" : "Game Over!"}
          </motion.h1>

          {/* Winner announcement */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.6 }}
            className="bg-gray-800 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-white/30"
          >
            <h2 className="text-2xl bungee md:text-3xl font-bold text-white mb-2">
              {isDraw ? "Both Teams Played Well!" : `Congratulations!`}
            </h2>
            {!isDraw && (
              <p className="text-xl text-white/90">
                Team{" "}
                <span className="font-bold text-[17px]">
                  {winner === "home" 
                    ? teamNames.home.charAt(0).toUpperCase() + teamNames.home.slice(1) 
                    : teamNames.away.charAt(0).toUpperCase() + teamNames.away.slice(1)}
                </span>{" "}
                wins!
              </p>
            )}
          </motion.div>

          {/* Final Score */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 gap-6 mb-8"
          >
            <div
              className={`text-center p-4 rounded-xl ${
                winner === "home"
                  ? "bg-green-500/20 border-2 border-green-400"
                  : "bg-white/10"
              }`}
            >
              <div className="text-lg text-white/80 mb-1">{teamNames.home}</div>
              <div className="text-7xl scorenames font-extrabold text-white">
                {finalScore.home}
              </div>
            </div>
            <div
              className={`text-center p-4 rounded-xl ${
                winner === "away"
                  ? "bg-green-500/20 border-2 border-green-400"
                  : "bg-white/10"
              }`}
            >
              <div className="text-lg text-white/80 mb-1">{teamNames.away}</div>
              <div className="text-7xl scorenames font-extrabold text-white">
                {finalScore.away}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
         
            <button
             onClick={() => navigate(`/create-game`)}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
            >
              <FiHome />
              Go Home
            </button>
            <button
              onClick={() => window.print()}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <FiDownload />
              Save Results
            </button>
          </motion.div>

          {/* Stars animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-300 text-2xl"
                initial={{
                  x: Math.random() * width,
                  y: Math.random() * height,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
              >
                ⭐
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CelebrationScreen;