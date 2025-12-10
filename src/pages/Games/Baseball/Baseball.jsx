import { FaApple } from "react-icons/fa";
import { GiBasketballBall } from "react-icons/gi";
import { IoLogoGooglePlaystore } from "react-icons/io5";

const Baseball = () => {
  return (
    <div
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      className="lg:min-h-screen max-w-7xl mx-auto mt-10 px-4 sm:px-6 flex flex-col items-center justify-center lg:px-8 md:py-2 lg:py-27 pt-20 md:pt-16 relative overflow-hidden"
    >
      <div className="bg-[#111B21] border border-gray-700 relative p-4 rounded-xl md:flex items-center justify-between">
        <div className="md:w-[60%]">
          <div className="flex items-center bg-[#2382F2]/20 w-fit px-4 rounded-xl">
            <GiBasketballBall size={25} className="text-[#2382F2]" />
            <h1 className="lg:text-[25px] text-[20px] font-semibold">Baseball</h1>
          </div>
          <h1 className="font-extrabold lg:text-[50px] text-[30px] md:leading-[60px] mt-2">
            The Baseball app you’ve been waiting for.
          </h1>
          <p className="text-[13px] text-gray-300 mt-4">
            With free baseball streaming and scoring, you’re all set with PLAY. Review game film, mark and share clips, and message your team all from the palm of your hand.
          </p>

          <button className="mt-10 bg-[#9AEA62] px-4 py-3 rounded-lg text-black">
            Download Play Now
          </button>
          <div className="mt-5 flex flex-col md:flex-row md:items-center gap-3">
            <div className="px-4 py-3 flex items-center gap-3 rounded-lg bg-[#182530]">
              <FaApple size={25} />
              Apple Store
            </div>
            <div className="px-4 py-3 flex items-center gap-3 rounded-lg bg-[#182530]">
              <IoLogoGooglePlaystore size={25} />
              Android Waitlist
            </div>
          </div>
        </div>
        <img
          src="/baseball1.webp"
          alt=""
           loading="lazy"
          className="lg:h-[500px]  lg:absolute right-5  max-md:mt-15 lg:mt-0 bottom-0"
        />
      </div>
    </div>
  );
};

export default Baseball;