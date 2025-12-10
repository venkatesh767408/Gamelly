



import { FaArrowRight, FaPlay, FaStar } from "react-icons/fa6";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      style={{ fontFamily:"'Montserrat', sans-serif" }}
      className="lg:min-h-screen max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 pt-15 md:pt-10 md:py-0 sm:py-16 lg:py-20  relative overflow-hidden"
    >
      <div className="mt-8 sm:mt-10 flex items-center justify-center">
        <div className="mx-auto px-4 sm:px-6 lg:px-7 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div
              className={`space-y-6 sm:space-y-8 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-gray-700">
                <FaStar className="text-[#9AEA62] animate-pulse text-sm sm:text-base" />
                <span className="text-xs sm:text-sm font-medium">
                  Elevating Sports Experience
                </span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl 2xl:text-8xl uppercase font-bold leading-tight sm:leading-[4rem] md:leading-[5rem] lg:leading-[6rem] text-white">
                  Join the team of winners
                </h1>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-md sm:max-w-lg md:max-w-xl">
                We're passionate about sports. Whether you're a dedicated fan,
                an aspiring athlete, or a professional competitor, we fuel your
                journey with cutting-edge technology and unparalleled passion.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="group relative bg-[#9AEA62] text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#9AEA62]/30">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Your Journey
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9AEA62] to-[#7ac74f] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <button className="group border-2 border-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:border-[#9AEA62] hover:bg-[#9AEA62]/10">
                  <span className="flex items-center gap-2">
                    <FaPlay className="text-[#9AEA62]" />
                    Watch Story
                  </span>
                </button>
              </div>
            </div>

            {/* Right Content - Media */}
            <div
              className={`relative transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              {/* Main Image Container */}
              <div className="relative">
                <div className="absolute left-0 top-0 z-20 h-full w-16 sm:w-24 md:w-32 lg:w-40 xl:w-48 bg-gradient-to-r from-[#091014] to-transparent"></div>
                <div className="absolute right-0 top-0 z-20 h-full w-16 sm:w-24 md:w-32 lg:w-40 xl:w-48 bg-gradient-to-l from-[#091014] to-transparent"></div>
                <img
                  src="/neonhero.webp"
                  alt="Athlete in action"
                  loading="lazy"
                  className="relative hidden lg:flex h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl mx-auto rounded-2xl object-cover transform transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
