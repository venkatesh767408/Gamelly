import { FaTshirt } from "react-icons/fa";
import { MdOndemandVideo } from "react-icons/md";
import { GiWhistle } from "react-icons/gi";
import { BsTrophyFill } from "react-icons/bs";

const Profile = () => {
  const features = [
    {
      icon: FaTshirt,
      title: "Your own Profile",
      description: "Create and customize your personal football profile",
      position: "left"
    },
    {
      icon: MdOndemandVideo,
      title: "Discover Videos of other Players",
      description: "Watch and learn from footballers around the world",
      position: "left"
    },
    {
      icon: BsTrophyFill,
      title: "Create Football Challenges",
      description: "Set up competitive challenges and track progress",
      position: "right"
    },
    {
      icon: GiWhistle,
      title: "Track players' activity",
      description: "Monitor performance and engagement metrics",
      position: "right"
    }
  ];

  const FeatureCard = ({ icon: Icon, title, description, position }) => (
    <div className="relative group">
      {/* Tail pointer */}
      <div className={`
        absolute top-1/2 transform -translate-y-1/2 w-0 h-0 border-transparent border-t-[10px] border-b-[10px]
        ${position === 'left' 
          ? 'right-0 border-l-[15px] border-l-white translate-x-full' 
          : 'left-0 border-r-[15px] border-r-white -translate-x-full'
        }
        z-10
      `} />
      
      <div className={`
        flex items-center gap-4 w-full max-w-  lg:max-w-sm bg-[#F9F6EC] p-6 rounded-2xl 
        text-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
        ${position === 'left' ? 'flex-row-reverse text-right' : 'flex-row'}
        relative z-20
      `}>
        <div className="flex-shrink-0">
          <div className="p-4 rounded-full border-2 border-gray-800 ">
            <Icon size={28} className="text-gray-800" />
          </div>
        </div>
        <div className={position === 'left' ? 'flex-1 mr-3' : 'flex-1 ml-3'}>
          <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      className="min-h-screen w-full flex items-center  justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto w-full relative">

        <img src="/greendots.svg" alt="" className="absolute top-0 left-0" />
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Left Features */}
          <div className="flex flex-col gap-8 lg:gap-12">
            {features.filter(f => f.position === 'left').map((feature, index) => (
              <div 
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>

          {/* Mobile Showcase */}
          <div className="relative my-8 lg:my-0 flex-shrink-0">
            <div className="relative w-80 h-[700px] mx-auto">
              {/* Mobile Frame */}
              <div className="absolute inset-0 bg-gray-900 rounded-[40px] shadow-2xl z-20">
                {/* Screen Content */}
                <div className="absolute inset-[12px] rounded-[28px] overflow-hidden bg-[#9AEA62]">
                  <img
                    src="/bb.webp"
                    className="w-full h-full object-cover"
                    alt="Football app showcase"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                {/* Notch */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-xl z-30" />
              </div>
              
              {/* Reflection Effect */}
              <div className="absolute top-4 left-4 right-4 h-20 bg-gradient-to-b from-white/10 to-transparent rounded-t-[28px] z-30" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#9AEA62] rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#9AEA62] rounded-full opacity-20 animate-pulse delay-1000" />
          </div>

          {/* Right Features */}
          <div className="flex flex-col gap-8 lg:gap-12">
            {features.filter(f => f.position === 'right').map((feature, index) => (
              <div 
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 200 + 100}ms` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;