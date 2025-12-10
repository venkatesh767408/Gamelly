import { GoTrophy } from "react-icons/go";
import { GrServices } from "react-icons/gr";


const Approach = () => {
  return (
    <div className="lg:min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-20 lg:py-20 relative overflow-hidden">
   

  

      {/* Main Content Section */}
      <div className="mt-16 lg:mt-24 relative bg-[#0B1419]  rounded-2xl  flex flex-col lg:flex-row-reverse items-start justify-between gap-8 lg:gap-12 shadow-2xl border border-gray-700">
        {/* Text Content */}
        <div className=" space-y-6 p-7 lg:w-[60%] ">
          <div>
            <h1 
              style={{ fontFamily: "'Montserrat', sans-serif" }} 
              className="uppercase text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight"
            >
              Unique <br />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Approach
              </span>{" "}
              <span className="text-gray-500">
                For <span className="text-[#9AEA62]">You</span>
              </span>
            </h1>
          </div>

          <div className="space-y-6">
            <div className="w-20 h-1 bg-gradient-to-r from-[#9AEA62] to-transparent rounded-full"></div>
            <p className="text-lg text-[#A1A1A1] leading-relaxed">
              Crafting a unique approach to sports involves blending innovation with tradition, 
              creativity with discipline, and passion with strategy. We create tailored solutions 
              that elevate performance and drive results.
            </p>
            <p className="text-lg text-[#A1A1A1] leading-relaxed">
              Our methodology combines cutting-edge technology with proven techniques to deliver 
              exceptional experiences that set new standards in sports service provision.
            </p>
          </div>

          {/* CTA Button */}
          <button className="mt-6 px-8 py-3 bg-gradient-to-r from-[#9AEA62] to-[#7BCB47] text-gray-800 font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Discover Our Method
          </button>
        </div>

        <div className=" absolute left-0 bottom-0 hidden lg:block">
          <div className="w-full ">
            <img src="/futureplayer.webp" alt=""  loading="lazy" className="h-[700px]" />
          </div>
        </div>

      </div>
    {/* Header Section */}
      <div className="hidden md:flex flex-col lg:flex-row md:flex-row items-center justify-between p-5 rounded-xl mt-10 bg-[#0B1419] mx-auto gap-8 lg:gap-0">
        <div className="flex items-center gap-6 group cursor-pointer hover:transform hover:scale-105 transition-all duration-300">
          <div className="p-5 border border-white/10 rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
            <GoTrophy size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Achievements
            </h2>
            <p className="text-lg lg:text-xl text-[#9AEA62]/80 font-semibold">
              Best Sports Service Provider
            </p>
          </div>
        </div>

        <div className="hidden md:block h-20 w-1 bg-gradient-to-b from-[#9AEA62] to-[#263749] rotate-12 transform"></div>

        <div className="flex items-center gap-6 group cursor-pointer hover:transform hover:scale-105 transition-all duration-300">
          <div className="p-5 border border-white/10 rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
            <GrServices size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Services
            </h2>
            <p className="text-lg lg:text-xl text-[#9AEA62]/80 font-semibold">
              We are Available 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approach;