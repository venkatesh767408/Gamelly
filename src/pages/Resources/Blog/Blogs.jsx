import { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { blogsData } from "../../../components/constants/Blogdata";
import Hero from "./Hero";

const Blogs = () => {
  const [filteredBlogs, setFilteredBlogs] = useState(blogsData);

  // Function to filter blogs
  const handleFilter = (category, search) => {
    let filtered = blogsData;

    if (category !== "All") {
      filtered = filtered.filter((blog) => blog.category === category);
    }

    if (search) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  };

  return (
    <div>
      {/* ✅ Pass filter function to Hero */}
      <Hero onFilter={handleFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-2 lg:px-8 py-10">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="bg-gray-800 rounded-xl relative ">
            <img src={blog.image} alt={blog.title} className="rounded-xl h-[250px] object-cover w-full" />
            <p className="absolute bg-[#9AEA62] top-0 left-0 p-3 text-gray-800 rounded-xl">
              {blog.category}
            </p>
            <div className="p-4">
              <p className="text-gray-500 text-[14px]">{blog.category}</p>
              <h2 className="text-[20px] mt-4 line-clamp-2">{blog.title}</h2>

              {/* ✅ Read button */}
              <div className="flex justify-end mt-4">
                <div className="flex items-center text-gray-300 gap-3 border border-gray-500 rounded-xl p-3 cursor-pointer hover:bg-gray-700">
                  <p>Read</p>
                  <FaArrowRightLong />
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredBlogs.length === 0 && (
          <p className="col-span-3 text-center text-gray-400">
            No blogs found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Blogs;
