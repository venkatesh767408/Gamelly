
import { FaApple } from "react-icons/fa";
import { IoLogoGooglePlaystore } from "react-icons/io5";
const Install = () => {
  return (
    <div
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center lg:px-8 py-20 relative overflow-hidden"
    >
      <div className="lg:leading-[180px] md:leading-[120px] flex flex-col items-center text-center mb-12">
          <h1 className="md:text-[60px] max-md:text-[30px] font-bold">SHOW YOUR</h1>
        <h1 className="md:text-[150px] lg:text-[20rem] text-[90px] font-bold">TALENT</h1>
      </div>

      <div className="h-[3px] md:w-[500px] max-md:w-[300px] bg-[#9AEA62] rounded-full md:my-12" />

      <div className="mt-10 flex flex-col items-center text-center">
        <h1 className="md:text-[50px] max-md:text-[30px] font-bold">GIVE YOURSELF A CHANCE!</h1>
        <h1 className="md:text-[40px] max-md:text-[30px]  font-bold text-[#9AEA62]">NOW. RIGHT AWAY!</h1>
      </div>


      <div className="mt-12 flex flex-col md:flex-row items-center md:gap-7 gap-3 ">

        <div className="px-4 py-3 flex items-center gap-3 rounded-lg bg-[#182530]">
            <FaApple size={25}/>
            Apple Store
        </div>
           <div className="px-4 py-3 flex items-center gap-3 rounded-lg bg-[#182530]">
            <IoLogoGooglePlaystore size={25} />
            Android Waitlist
        </div>

      </div>


      <div>
        <img src="/qr.webp" alt="" className="h-[400px] mt-7" />
      </div>
    </div>
  );
};

export default Install;
