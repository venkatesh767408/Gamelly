
import { IoIosVideocam } from "react-icons/io";
import { FaMobile } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
const Fame = () => {
  return (
    <div
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      className="md:min-h-screen max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center lg:px-8 py-20 relative overflow-hidden"
    >
      <img src="/bg10.webp" alt="" className="absolute top-50" />
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="font-extrabold text-[#F9F6EC] text-2xl max-md:text-4xl  md:text-7xl lg:text-8xl xl:text-[9rem] leading-tight ">
          FAME & SKILL
        </h1>
        <p className="text-sm md:text-2xl text-gray-600 mt-6 max-w-3xl mx-auto">
          Where talent meets opportunity. Showcase your skills and join a
          community of creators.
        </p>
      </div>

      {/* Text Content */}
      <div className="flex items-start">
        {/* <img src="/greendots.svg" alt="" /> */}
{/* <img src="/manplaying.png" alt="" className="h-[600px]" /> */}
<video src="/hero.mp4" className="rounded-2xl "  loading="lazy" autoPlay muted loop></video>
        {/* <img src="/greendots.svg" alt="" /> */}
      </div>

      <div className="mt-7 hidden  lg:flex items-center">
  {/* First icon */}
  <div className="flex flex-col items-center">
    <div className="p-7 border border-white rounded-full">
      <IoIosVideocam size={30} className="text-white" />
    </div>
    <p className="text-white text-[10px] mt-2 w-[200px] text-center">Record a video of how you train, do a trick or want to say something.</p>
  </div>

  <div className="h-[1px] w-[150px] bg-white" />

  {/* Second icon */}
  <div className="flex flex-col items-center">
    <div className="p-7 border border-white rounded-full">
      <FaMobile size={30} className="text-white" />
    </div>
    <p className="text-white text-[10px] mt-2 w-[200px] text-center">Upload the recording to the Play application on your profile.</p>
  </div>

  <div className="h-[1px] w-[150px] bg-white" />

  {/* Third icon */}
  <div className="flex flex-col items-center">
    <div className="p-7 border border-white rounded-full">
      <FaHeart size={30} className="text-white" />
    </div>
    <p className="text-white text-[10px] mt-2 w-[200px] text-center">Wait for reactions and connect with experts and other footballers.</p>
  </div>

  <div className="h-[1px] w-[150px] bg-white" />

  {/* Fourth icon */}
  <div className="flex flex-col items-center">
    <div className="p-7 border border-white rounded-full">
      <FaTrophy size={30} className="text-white" />
    </div>
    <p className="text-white text-[10px] mt-2 w-[200px] text-center">Build your career record and make your dream come true!</p>
  </div>
</div>

    </div>
  );
};

export default Fame;
