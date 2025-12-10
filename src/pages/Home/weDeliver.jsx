
import {
  GiTrophyCup,
  GiRunningShoe,
  GiSoccerBall,
  GiBasketballBall,
  GiTennisBall,
  GiAmericanFootballBall,
} from "react-icons/gi";
import { FaUsers, FaChartLine } from "react-icons/fa";

import { useState, useEffect } from "react";
import { BorderBeam } from "../../components/ui/border-beam";

const WeDeliver = () => {
  const [currentIcon, setCurrentIcon] = useState(0);

  // Array of sports icons to cycle through
  const sportsIcons = [
    { icon: GiSoccerBall, name: "Soccer" },
    { icon: GiBasketballBall, name: "Basketball" },
    { icon: GiTennisBall, name: "Tennis" },
    { icon: GiAmericanFootballBall, name: "Football" },
    // { icon: GiBaseballBall, name: "Baseball" },
    // { icon: GiRunningShoe, name: "Running" },
  ];

  useEffect(() => {
    // Change icon every 2 seconds
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % sportsIcons.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const CurrentIconComponent = sportsIcons[currentIcon].icon;

  return (
    <div
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      className=" max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center lg:px-8 md:py-20 relative overflow-hidden"
    >


        <img className="absolute hidden md:block top-0 right-0" src="/greendots.svg"/>
      <div className="lg:flex items-center gap-12 relative">
        {/* Left Feature List */}
        <div className="flex flex-col lg:gap-17 gap-4 lg:absolute ">
          <div className="relative flex items-center gap-3 bg-[#0C141A] border border-[#98E860]/30 shadow-sm shadow-gray-800 p-3 rounded-xl text-gray-300">
            <GiTrophyCup size={17} className="text-[#98E860]" />
            <BorderBeam
              duration={4}
              size={300}
              reverse
              className="from-transparent via-green-500 to-transparent"
            />
            <p className="lg:text-[10px]  md:w-[400px] font-medium">
              Track your game performance in real-time.
            </p>
          </div>

          <div className="relative flex items-center gap-3 bg-[#0C141A] border border-[#98E860]/30 shadow-sm shadow-gray-800 p-3 rounded-xl text-gray-300">
            <GiRunningShoe size={17} className="text-[#98E860]" />
            <BorderBeam
              duration={4}
              size={300}
              reverse
              className="from-transparent via-green-500 to-transparent"
            />
            <p className="lg:text-[10px] font-medium">
              Improve speed, stamina, and agility effortlessly.
            </p>
          </div>

          {/* Third feature */}
          <div className="relative flex items-center gap-3 bg-[#0C141A] border border-[#98E860]/30 shadow-sm shadow-gray-800 p-3 rounded-xl text-gray-300">
            <FaUsers size={17} className="text-[#98E860]" />
            <BorderBeam
              duration={4}
              size={300}
              reverse
              className="from-transparent via-green-500 to-transparent"
            />
            <p className="lg:text-[10px] font-medium">
              Connect with teammates and coaches seamlessly.
            </p>
          </div>

          {/* Fourth feature */}
          <div className="relative flex items-center gap-3 bg-[#0C141A] border border-[#98E860]/30 shadow-sm shadow-gray-800 p-3 rounded-xl text-gray-300">
            <FaChartLine size={17} className="text-[#98E860]" />
            <BorderBeam
              duration={4}
              size={300}
              reverse
              className="from-transparent via-green-500 to-transparent"
            />
            <p className="lg:text-[10px] font-medium">
              Analyze your stats and track progress over time.
            </p>
          </div>
        </div>

        {/* Center line graphic */}
        <img src="/lines.svg" className="m-0 p-0 hidden lg:flex h-[400px] " />

        {/* Right Image */}

        <div className="absolute right-100">
          {/* Gradient glow behind */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#98E860] via-[#56C870] to-[#98E860] blur-lg"></div>

          {/* Animated sports icon circle */}
          <div className="h-20 w-20 hidden  lg:flex items-center justify-center rounded-full bg-gray-800 relative z-10">
            <div className="animate-spin">
              <CurrentIconComponent
                size={30}
                className="text-[#98E860] transition-all duration-500 ease-in-out"
              />
            </div>
          </div>
        </div>

        <img
          src="/children4.webp"
          loading="lazy"
          className="lg:h-[500px]  mt-7 md:mt-0  m-0 p-0 lg:absolute right-0"
          alt="Showcase"
        />
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes pulse-scale {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WeDeliver;
