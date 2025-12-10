import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const categories = [
  "All",
  "AI & Tech",
  "Baseball",
  "Basketball",
  "Community Impact",
  "Feature Notes",
  "Football",
  "News",
  "Podcast",
  "Soccer",
  "Softball",
  "Volleyball",
];

const Hero = ({ onFilter }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    onFilter(cat, search);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onFilter(activeCategory, e.target.value);
  };

  return (
    <div className=" max-w-7xl mx-auto px-2 lg:px-8 py-16">
      <div className="lg:flex items-center justify-between ">
        <div>
          <h1 className="lg:text-[70px]  md:text-[50px] max-md:text-[60px] text-[30px] font-extrabold lg:leading-[80px] leading-[60px]">
            PLAY'S CONTENT HUB
          </h1>
          <p className="text-gray-500 mt-6 lg:max-w-[600px] w-full">
            Get in the game! Catch the latest company and product news, feature
            releases, partner announcements, and more from PLAY.
          </p>

          
             {/* ✅ Search */}
          <div className="relative mt-4 lg:hidden block">
            <FaSearch className="absolute left-5  top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="What are you looking for..."
              className="border border-gray-700 pl-12 p-4 rounded-full w-full"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap mt-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`text-[14px] px-4 py-2 cursor-pointer rounded-full border transition ${
                  activeCategory === cat
                    ? "bg-[#9AEA62] text-gray-900 border-[#9AEA62]"
                    : "bg-[#9AEA62]/20 text-gray-200 border-[#9AEA62]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        <div className="w-[100%]">
          <img src="/blogmain2.webp" alt="bloghero" className="h-[450px] hidden lg:flex" />

          {/* ✅ Search */}
          <div className="relative mt-4 hidden lg:block">
            <FaSearch className="absolute left-5  top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="What are you looking for..."
              className="border border-gray-700 pl-12 p-4 rounded-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
