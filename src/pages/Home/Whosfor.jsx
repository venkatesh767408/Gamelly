import { FaFutbol, FaChartBar, FaUsers } from 'react-icons/fa'; // Import specific icons from react-icons

const Whosfor = () => {
  const targetGroups = [
    {
      title: "YOUNG PLAYERS",
      subtitle: "PLAYERS",
      description: [
        "Show up! How you play, train, dribble, play with the ball, just what you love the most.",
        "Collect followers and observe others yourself, comment, like and share."
      ],
      icon: <FaFutbol className="text-2xl" />, // Replaced ⚽ with FaFutbol
      gradient: "from-green-400 to-emerald-600"
    },
    {
      title: "SPORTS EXPERTS",
      subtitle: "EXPERTS",
      description: [
        "Share your expertise, analyze performances, and guide the next generation of athletes.",
        "Build your reputation and connect with talented players worldwide."
      ],
      icon: <FaChartBar className="text-2xl" />, // Replaced 📊 with FaChartBar
      gradient: "from-blue-400 to-cyan-600"
    },
    {
      title: "CONSCIOUS PARENTS",
      subtitle: "PARENTS",
      description: [
        "Track your child's progress, find qualified coaches, and ensure safe sporting environment.",
        "Connect with other sports parents and share experiences."
      ],
      icon: <FaUsers className="text-2xl" />, // Replaced 👨‍👩‍👧‍👦 with FaUsers
      gradient: "from-purple-400 to-indigo-600"
    }
  ];

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
    

      {/* Header Section */}
      <div className="relative flex flex-col lg:flex-row md:flex-row items-start justify-between mb-16 lg:mb-24">
        <div className="order-2 lg:order-1 md:order-1 flex justify-center lg:justify-start w-full lg:w-auto">
          <img 
            src="/greendots.svg" 
            alt="Decoration" 
            className="w-32 h-32 lg:w-40 lg:h-40 opacity-80"
          />
        </div>
        
        <div className="order-1 flex flex-col items-center lg:order-2 text-center lg:text-left mb-8 lg:mb-0">
          <h1
            className="text-4xl md:w-[400px] text-center md:text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-green-400 to-[#98E560] bg-clip-text text-transparent"
          >
            FOR WHOM THE APP IS FOR
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-[#98E560] mx-auto lg:mx-0 mt-4 rounded-full"></div>
        </div>
        
        <div className="order-3 hidden md:flex justify-center lg:justify-end w-full lg:w-auto">
          <img 
            src="/bg2.webp" 
            alt="Sports background" 
            className="w-48 h-32 lg:w-56 lg:h-full rounded-2xl object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Target Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {targetGroups.map((group, index) => (
          <div 
            key={index}
            className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-400/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
          >
            {/* Icon Container */}
            <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 p-4 border border-white/20 bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {group.icon} {/* Render React Icon component */}
            </div>
            
            {/* Content */}
            <div className="pt-8 text-center">
              <h2 className="text-2xl lg:text-3xl font-black mb-2 leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  {group.title.split(' ')[0]}
                </span>
                <br />
                <span className={`text-[#98E560]`}>
                  {group.subtitle}
                </span>
              </h2>
              
              <div className={`w-16 h-1 bg-[#98E560] mx-auto my-4 rounded-full group-hover:w-20 transition-all duration-300`}></div>
              
              <div className="space-y-3 mt-6">
                {group.description.map((paragraph, idx) => (
                  <p key={idx} className="text-gray-300 leading-relaxed text-sm lg:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Hover Effect Border */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${group.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      {/* <div className="text-center mt-16 lg:mt-20">
        <p className="text-gray-400 mb-6 text-lg">
          Ready to join our sports community?
        </p>
        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
          Get Started Today
        </button>
      </div> */}
    </div>
  );
};

export default Whosfor;