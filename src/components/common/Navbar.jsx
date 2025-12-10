import { useState } from "react";
import { FaBars, FaTimes, FaArrowRight, FaBaseballBall, FaLongArrowAltRight, FaBasketballBall, FaVolleyballBall, FaVideo, FaMobileAlt, FaFlask, FaBlog, FaBook, FaLifeRing, FaUsers, FaTachometerAlt, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { MdOutlineSportsRugby, MdAddCircleOutline } from "react-icons/md";
import { GiSoccerBall } from "react-icons/gi";
import { BiSolidCricketBall } from "react-icons/bi";
import { FaArrowsSplitUpAndLeft } from "react-icons/fa6";
import { MdEvent } from "react-icons/md";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { isAuthenticated, user: authUser, logout } = useAuth();
  const { user, userInitials } = useProfile();

  const currentUser = user || authUser;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setDropdownOpen(null);
    setUserDropdownOpen(false);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsOpen(false);
  };

  const handleDropdownToggle = (menu) => {
    setDropdownOpen(dropdownOpen === menu ? null : menu);
  };

  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Sports", href: "/sports" },
    {
      name: "Features",
      href: "/",
      dropdown: [
        {
          heading: "Leagues and Tournaments",
          items: [
            { name: "Baseball & softball", href: "/baseballandsoftball", icon: <FaBaseballBall className="text-[#E51733]" /> },
            { name: "Basketball", href: "/basketballtournament", icon: <FaBasketballBall className="text-[#FF6518]" /> },
          ],
        },
        {
          heading: "What's New",
          items: [
            { name: "App Features", href: "/features", icon: <FaMobileAlt className="text-[#9AEA62]" /> },
            { name: "Split Expenses", href: "/tricount", icon: <FaArrowsSplitUpAndLeft className="text-[#9AEA62]" /> },
            { name: "Events", href: "/events", icon: <MdEvent className="text-[#9AEA62]" /> },
          ],
        },
        {
          heading: "Video",
          items: [
            { name: "Live Video Features", href: "/live-tools", icon: <FaVideo className="text-[#2382F2]" /> },
          ],
        },
      ],
    },
    {
      name: "Resources",
      href: "/",
      dropdown: [
        {
          heading: "Resources",
          items: [
            { name: "Blog", href: "/blogs", icon: <FaBlog className="text-[#9AEA62]" /> },
            { name: "Guides", href: "/university", icon: <FaBook className="text-[#2382F2]" /> },
            { name: "Support", href: "/support", icon: <FaLifeRing className="text-[#DE9444]" /> },
          ],
        },
      ],
    },
    { name: "Pricing", href: "/pricing" },
    { name: "Create Game", href: "/create-game", icon: <FaTachometerAlt className="text-[#9AEA62]" /> }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/60 backdrop-blur-md z-50 border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-15 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PLAY
              </span>
              <span className="text-[#9AEA62]">.</span>
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden bg-white/5 p-4 rounded-xl lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.name === "Sports" ? (
              <Drawer key={link.name} open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#9AEA62] text-[16px] font-medium transition-colors duration-300"
                    onClick={handleDrawerOpen}
                  >
                    {link.name}
                  </a>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-4xl p-4">
                    <DrawerHeader>
                      <DrawerTitle className="text-[30px] text-white uppercase font-[900] text-center italic">
                        Robust Tools for Every Coach
                      </DrawerTitle>
                      <DrawerDescription className="text-center py-4">
                        See how Play can transform your team's season.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                      <Link to="/baseball" onClick={() => { handleDrawerClose(); toggleMenu(); }}>
                        <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-4 rounded-lg hover:border-[#E51733] cursor-pointer">
                          <FaBaseballBall size={24} className="text-[#E51733]" />
                          <p className="font-semibold text-sm">BASEBALL</p>
                          <FaLongArrowAltRight />
                        </div>
                      </Link>
                      <Link to="/softball" onClick={() => { handleDrawerClose(); toggleMenu(); }}>
                        <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-4 rounded-lg hover:border-[#D7FF38] cursor-pointer">
                          <FaBaseballBall size={24} className="text-[#D7FF38]" />
                          <p className="font-semibold text-sm">SOFTBALL</p>
                          <FaLongArrowAltRight />
                        </div>
                      </Link>
                      <Link to="/basketball" onClick={() => { handleDrawerClose(); toggleMenu(); }}>
                        <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-4 rounded-lg hover:border-[#FF6518] cursor-pointer">
                          <FaBasketballBall size={24} className="text-[#FF6518]" />
                          <p className="font-semibold text-sm">BASKETBALL</p>
                          <FaLongArrowAltRight />
                        </div>
                      </Link>
                      <Link to="/rugby" onClick={() => { handleDrawerClose(); toggleMenu(); }}>
                        <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-4 rounded-lg hover:border-[#DE9444] cursor-pointer">
                          <MdOutlineSportsRugby size={24} className="text-[#DE9444]" />
                          <p className="font-semibold text-sm">RUGBY</p>
                          <FaLongArrowAltRight />
                        </div>
                      </Link>
                      <Link to="/volleyball" onClick={() => { handleDrawerClose(); toggleMenu(); }}>
                        <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-4 rounded-lg hover:border-[#2382F2] cursor-pointer">
                          <FaVolleyballBall size={24} className="text-[#2382F2]" />
                          <p className="font-semibold text-sm">VOLLEYBALL</p>
                          <FaLongArrowAltRight />
                        </div>
                      </Link>
                      <Link to="/football" onClick={() => { handleDrawerClose(); toggleMenu(); }}>
                        <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-4 rounded-lg hover:border-[#2382F2] cursor-pointer">
                          <GiSoccerBall size={24} className="text-[#2382F2]" />
                          <p className="font-semibold text-sm">SOCCER</p>
                          <FaLongArrowAltRight />
                        </div>
                      </Link>
                     
                      <Link to="/" onClick={() => { handleDrawerClose(); toggleMenu(); }}>
                        <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-4 rounded-lg hover:border-[#5B7180] cursor-pointer">
                          <MdAddCircleOutline size={24} className="text-[#5B7180]" />
                          <p className="font-semibold text-sm">OTHER SPORTS</p>
                          <FaLongArrowAltRight />
                        </div>
                      </Link>
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline" onClick={handleDrawerClose}>
                          Close
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            ) : link.dropdown ? (
              <div key={link.name} className="relative group">
                <Link
                  to={link.href}
                  className="flex items-center gap-1 text-gray-300 hover:text-[#9AEA62] text-[16px] font-medium transition-colors duration-300 group-hover:bg-gray-700/50 group-hover:rounded-md px-2 py-1"
                >
                  {link.name}
                  <svg
                    className="w-4 h-4 text-gray-300 group-hover:text-[#9AEA62] transition-transform duration-300 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 mt-0 w-64 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto z-50">
                  {link.dropdown.map((section, index) => (
                    <div key={index} className="p-4">
                      <h3 className="text-gray-300 font-semibold text-sm uppercase mb-2">{section.heading}</h3>
                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-[#9AEA62] rounded-lg transition-colors duration-300"
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-300 hover:text-[#9AEA62] text-[16px] font-medium transition-colors duration-300"
              >
                {link.icon ? (
                  <span className="flex items-center gap-2">
                    {link.icon}
                    {link.name}
                  </span>
                ) : (
                  link.name
                )}
              </Link>
            )
          )}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              {/* User Profile Dropdown Trigger */}
              <button
                onClick={handleUserDropdownToggle}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2 transition-all duration-300 border border-transparent hover:border-white/20"
              >
                {currentUser?.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#9AEA62]"
                  />
                ) : (
                    <img
                    src="default_profile.webp"
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#9AEA62]"
                  />
                )}
                <span className="text-white font-medium text-sm max-w-[120px] truncate">
                  {currentUser?.username || currentUser?.fullname || 'User'}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-lg z-50">
                  {/* User Info Section */}
                  <div className="p-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                      {currentUser?.profilePicture ? (
                        <img
                          src={currentUser.profilePicture}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#9AEA62]"
                        />
                      ) : (
                         <img
                    src="default_profile.webp"
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#9AEA62]"
                  />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">
                          {currentUser?.fullname || currentUser?.username || 'User'}
                        </p>
                        <p className="text-gray-400 text-sm truncate">
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-[#9AEA62] hover:bg-gray-700/50 rounded-lg transition-all duration-300"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FaUser className="text-[#9AEA62]" />
                      <span>My Profile</span>
                    </Link>
                

                    {/* <Link
                      to="/settings"
                      className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-[#9AEA62] hover:bg-gray-700/50 rounded-lg transition-all duration-300"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FaCog className="text-[#9AEA62]" />
                      <span>Settings</span>
                    </Link> */}
                  </div>

                  {/* Logout Section */}
                  <div className="p-2 border-t border-gray-700/50">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="group relative bg-[#9AEA62] text-gray-900 px-6 py-2 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#9AEA62]/30">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#9AEA62] to-[#7ac74f] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={toggleMenu}>
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Enhanced Mobile Menu */}
        <div
          className={`lg:hidden fixed top-full left-0 w-full bg-gray-900/98 backdrop-blur-lg transition-all duration-300 ease-in-out border-t border-gray-700/50 ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col py-6 px-4">
            {/* User Info Section - Show when logged in */}
            {isAuthenticated && currentUser && (
              <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                <div className="flex items-center gap-3">
                  {currentUser?.profilePicture ? (
                    <img
                      src={currentUser.profilePicture}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#9AEA62]"
                    />
                  ) : (
                     <img
                    src="default_profile.webp"
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#9AEA62]"
                  />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">
                      {currentUser?.fullname || currentUser?.username || 'User'}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    to="/profile"
                    className="flex-1 bg-[#9AEA62]/20 text-[#9AEA62] text-center py-2 rounded-lg font-medium text-sm hover:bg-[#9AEA62]/30 transition-colors"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-500/20 text-red-400 text-center py-2 rounded-lg font-medium text-sm hover:bg-red-500/30 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Dashboard Link - Prominent in Mobile */}
            <Link
              to="/dashboard"
              className="flex items-center gap-3 bg-[#9AEA62]/10 border border-[#9AEA62]/30 rounded-xl p-4 mb-4 hover:bg-[#9AEA62]/20 transition-all duration-300"
              onClick={toggleMenu}
            >
              <FaTachometerAlt className="text-[#9AEA62] text-lg" />
              <span className="text-white font-semibold">Dashboard</span>
              <FaArrowRight className="text-[#9AEA62] ml-auto" />
            </Link>

            {/* Regular Navigation Links */}
            <div className="space-y-1">
              {navLinks.filter(link => link.name !== "Dashboard").map((link) =>
                link.name === "Sports" ? (
                  <Drawer key={link.name} open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                      <button
                        className="w-full text-left py-3 px-4 text-gray-300 hover:text-[#9AEA62] hover:bg-white/5 rounded-lg transition-all duration-300 font-medium flex items-center justify-between"
                        onClick={handleDrawerOpen}
                      >
                        <span>{link.name}</span>
                        <FaArrowRight className="text-sm opacity-60" />
                      </button>
                    </DrawerTrigger>
                  </Drawer>
                ) : link.dropdown ? (
                  <div key={link.name} className="border-b border-gray-700/30 last:border-b-0">
                    <button
                      className="w-full text-left py-3 px-4 text-gray-300 hover:text-[#9AEA62] hover:bg-white/5 rounded-lg transition-all duration-300 font-medium flex items-center justify-between"
                      onClick={() => handleDropdownToggle(link.name.toLowerCase())}
                    >
                      <span>{link.name}</span>
                      <span className={`transform transition-transform ${dropdownOpen === link.name.toLowerCase() ? 'rotate-180' : ''}`}>
                        <FaArrowRight className="text-sm opacity-60" />
                      </span>
                    </button>
                    {dropdownOpen === link.name.toLowerCase() && (
                      <div className="ml-4 mt-2 space-y-2 pb-2">
                        {link.dropdown.map((section, index) => (
                          <div key={index}>
                            <h4 className="text-xs uppercase text-gray-400 font-semibold px-4 py-2">
                              {section.heading}
                            </h4>
                            <div className="space-y-1">
                              {section.items.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  className="flex items-center gap-3 py-2 px-4 text-gray-400 hover:text-[#9AEA62] rounded-lg transition-colors duration-300 text-sm"
                                  onClick={toggleMenu}
                                >
                                  {item.icon}
                                  <span>{item.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block py-3 px-4 text-gray-300 hover:text-[#9AEA62] hover:bg-white/5 rounded-lg transition-all duration-300 font-medium"
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            {/* Mobile Footer Section - Show only when not logged in */}
            {!isAuthenticated && (
              <div className="mt-8 pt-6 border-t border-gray-700/30">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Ready to get started?</span>
                  <Link 
                    to="/login" 
                    className="bg-[#9AEA62] text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 transition-transform duration-300"
                    onClick={toggleMenu}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;