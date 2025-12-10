import { BsArrowLeft } from "react-icons/bs";
import { FaEdit, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const {
    user,
    isLoading,
    error,
    isUploading,
    uploadProgress,
    isUpdatingField,
    fetchProfile,
    uploadProfilePicture,
    deleteProfilePicture,
    updatePhone,
    updateLocation,
    updateAge,
    clearError,
    // hasProfilePicture,
    // displayName,
    // userInitials,
  } = useProfile();

  const { user: authUser, isAuthenticated,logout } = useAuth();
  const fileInputRef = useRef(null);
  const navigate = useNavigate()

  // State for editable fields
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState({
    phone: "",
    location: "",
    age: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  // Update field values when user data changes
  // useEffect(() => {
  //   if (user) {
  //     setFieldValues({
  //       phone: user.phone || "",
  //       location: user.location || "",
  //       age: user.age || "",
  //     });
  //   }
  // }, [user]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      if (file.size > maxSize) {
        alert("File size too large. Maximum 5MB allowed.");
        return;
      }

      uploadProfilePicture(file);
    }
  };

  const handleRemovePicture = () => {
    if (
      window.confirm("Are you sure you want to remove your profile picture?")
    ) {
      deleteProfilePicture();
    }
  };

  const handleImageClick = () => {
 
      fileInputRef.current?.click();
    
  };

  // Edit field functions
  const startEditing = (field) => {
    setEditingField(field);
  };

  const cancelEditing = () => {
    setEditingField(null);
    // Reset field values to current user data
    if (user) {
      setFieldValues({
        phone: user.phone || "",
        location: user.location || "",
        age: user.age || "",
      });
    }
  };

  const handleFieldChange = (field, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


   const handleLogout = () => {
    logout();
    navigate("/")
  };

  const saveField = async (field) => {
    const value = fieldValues[field];

    // Validate age if it's the age field
    if (field === "age") {
      const ageNum = parseInt(value);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        alert("Please enter a valid age between 13 and 120");
        return;
      }
    }

    try {
      switch (field) {
        case "phone":
          await updatePhone(value);
          break;
        case "location":
          await updateLocation(value);
          break;
        case "age":
          await updateAge(parseInt(value));
          break;
        default:
          break;
      }
      setEditingField(null);
    } catch (error) {
      // Error handling is done in the thunk
    }
  };

  // Use profile data or fallback to auth data
  const currentUser = user || authUser;

  if (isLoading && !currentUser) {
    return (
      <div className="min-h-screen pt-10 max-w-7xl mx-auto px-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-10 max-w-7xl mx-auto px-4 flex items-center justify-center">
        <div className="text-gray-600 font-bold text-lg">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 max-w-7xl mx-auto px-4">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 onClick={()=>navigate(-1)} className="text-sm flex items-center gap-2 cursor-pointer underline font-bold text-[#9AEA62]">
          <BsArrowLeft size={20} />
          Go back
        </h1>
        <div className="flex items-center gap-3">
           <div className="flex gap-4">
          <button className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Settings
          </button>
        </div>
        <div className="flex gap-4">
          <button onClick={handleLogout} className="bg-red-700/80 cursor-pointer text-red-200 px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Logout
          </button>
        </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Enhanced Profile Card */}
        <div className="bg-gray-900/50 backdrop-blur-lg flex flex-col items-center w-full lg:w-[30%] p-6 rounded-2xl border border-white/20 shadow-2xl relative">
          {/* Edit Icon - Top Left Corner */}
     
            <button
              onClick={handleImageClick}
              className="absolute cursor-pointer top-2 right-2 bg-[#9AEA62] text-gray-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 z-10"
              title="Change Profile Picture"
            >
              <FaCamera size={16} />
            </button>
    

          {/* Profile Image with Circular Progress */}
          <div className="relative">
            <div
              className={`relative cursor-pointer group ${
                currentUser?.authProvider === "local" ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={handleImageClick}
            >
              {/* Circular Progress Bar */}
              {isUploading && (
                <div className="absolute -inset-2">
                  <svg className="w-[196px] h-[196px] transform -rotate-90">
                    <circle
                      cx="98"
                      cy="98"
                      r="94"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="98"
                      cy="98"
                      r="94"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray="590"
                      strokeDashoffset={590 - (590 * uploadProgress) / 100}
                      className="text-[#9AEA62] transition-all duration-300"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}

              {/* Profile Image */}
              <div className="relative">
                {currentUser?.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt="profile"
                    className={`h-[180px] w-[180px] rounded-full object-cover border-4 shadow-lg transition-all duration-300 ${
                      isUploading 
                        ? "border-transparent opacity-80" 
                        : "border-[#9AEA62] group-hover:opacity-80"
                    }`}
                    onError={(e) => {
                      e.target.src = "/default_profile.webp";
                    }}
                  />
                ) : (
                  <img
                    src="/default_profile.webp"
                    alt="profile"
                    className={`h-[180px] w-[180px] rounded-full object-cover border-4 shadow-lg transition-all duration-300 ${
                      isUploading 
                        ? "border-transparent opacity-80" 
                        : "border-[#9AEA62] group-hover:opacity-80"
                    }`}
                  />
                )}

                {/* Upload Progress Text */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center bg-black/50 rounded-full py-1 px-3">
                      <div className="text-sm font-semibold">{uploadProgress}%</div>
                    </div>
                  </div>
                )}

            
              </div>
            </div>

            {/* Account Type Badge */}
            <div className="absolute -bottom-2 right-5 bg-[#9AEA62] text-black px-3 py-1 rounded-full text-sm font-bold">
              {currentUser?.authProvider === "google" ? "GOOGLE" : "PRO"}
            </div>
          </div>

          <p className="font-bold text-2xl py-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {currentUser.username || "User"}
          </p>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
              <p className="text-green-400 font-extrabold text-4xl">7</p>
              <p className="text-gray-400 mt-1 text-sm">Games</p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
              <p className="text-blue-400 font-extrabold text-4xl">5</p>
              <p className="text-gray-400 mt-1 text-sm">Wins</p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
              <p className="text-yellow-400 font-extrabold text-4xl">71%</p>
              <p className="text-gray-400 mt-1 text-sm">Win Rate</p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
              <p className="text-red-400 font-extrabold text-4xl">2</p>
              <p className="text-gray-400 mt-1 text-sm">Losses</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="w-full space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Email</span>
              <span className="text-white font-semibold text-sm">
                {currentUser.email}
              </span>
            </div>

            {/* Phone Field with Edit */}
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Phone</span>
              <div className="flex items-center gap-2">
                {editingField === "phone" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={fieldValues.phone}
                      onChange={(e) =>
                        handleFieldChange("phone", e.target.value)
                      }
                      className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-32 focus:outline-none focus:ring-2 focus:ring-[#9AEA62]"
                      placeholder="Enter phone"
                      autoFocus
                    />
                    <button
                      onClick={() => saveField("phone")}
                      disabled={isUpdatingField}
                      className="text-green-400 hover:text-green-300 disabled:opacity-50"
                    >
                      <FaSave size={14} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">
                      {currentUser.phone || "Not set"}
                    </span>
                    <button
                      onClick={() => startEditing("phone")}
                      className="text-gray-400 hover:text-[#9AEA62] transition-colors"
                    >
                      <FaEdit size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Location Field with Edit */}
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Location</span>
              <div className="flex items-center gap-2">
                {editingField === "location" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={fieldValues.location}
                      onChange={(e) =>
                        handleFieldChange("location", e.target.value)
                      }
                      className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-32 focus:outline-none focus:ring-2 focus:ring-[#9AEA62]"
                      placeholder="Enter location"
                      autoFocus
                    />
                    <button
                      onClick={() => saveField("location")}
                      disabled={isUpdatingField}
                      className="text-green-400 hover:text-green-300 disabled:opacity-50"
                    >
                      <FaSave size={14} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">
                      {currentUser.location || "Not set"}
                    </span>
                    <button
                      onClick={() => startEditing("location")}
                      className="text-gray-400 hover:text-[#9AEA62] transition-colors"
                    >
                      <FaEdit size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Age Field with Edit */}
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Age</span>
              <div className="flex items-center gap-2">
                {editingField === "age" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={fieldValues.age}
                      onChange={(e) => handleFieldChange("age", e.target.value)}
                      className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20 focus:outline-none focus:ring-2 focus:ring-[#9AEA62]"
                      placeholder="Age"
                      min="13"
                      max="120"
                      autoFocus
                    />
                    <button
                      onClick={() => saveField("age")}
                      disabled={isUpdatingField}
                      className="text-green-400 hover:text-green-300 disabled:opacity-50"
                    >
                      <FaSave size={14} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">
                      {currentUser.age || "Not set"}
                    </span>
                    <button
                      onClick={() => startEditing("age")}
                      className="text-gray-400 hover:text-[#9AEA62] transition-colors"
                    >
                      <FaEdit size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Email Verified</span>
              <span
                className={`font-semibold ${
                  currentUser.isEmailVerified
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {currentUser.isEmailVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>

     
            <button
              onClick={handleRemovePicture}
              disabled={isUploading}
              className="mt-4 w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Profile Picture
            </button>
 
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-[70%] space-y-6">
          {/* Create Game Banner */}
          <div className="bg-[#9AEA62] relative flex justify-between items-center p-6 rounded-2xl shadow-2xl overflow-hidden">
            <div className="space-y-3 z-10">
              <h1 className="font-bold text-3xl uppercase text-gray-800">
                Ready to Create a Game?
              </h1>
              <p className="text-gray-800">
                Invite players, build your team, and dominate the competition
              </p>
             <Link to={"/create-game"}>
              <button className="bg-white hover:bg-gray-100 mt-4 px-6 py-3 cursor-pointer text-green-700 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                Create Game Now
              </button>
             </Link>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-green-500/20 to-transparent">
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 ">
                <img src="/cat.webp" alt="" loading="lazy" className="" />
              </div>
            </div>
          </div>

          {/* Recent Games Section */}
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Games</h2>
              <button className="text-green-400 hover:text-green-300 font-semibold text-sm">
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Game Card 1 */}
              <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 hover:border-green-500/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">
                    WIN
                  </span>
                  <span className="text-gray-400 text-sm">2 days ago</span>
                </div>
                <h3 className="font-bold text-white mb-2">
                  Basketball Championship
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Score: 98-85</span>
                  <span className="text-green-400 font-semibold">MVP</span>
                </div>
              </div>

              {/* Game Card 2 */}
              <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                    LIVE
                  </span>
                  <span className="text-gray-400 text-sm">Now</span>
                </div>
                <h3 className="font-bold text-white mb-2">
                  Soccer League Match
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Score: 2-1</span>
                  <span className="text-yellow-400 font-semibold">Playing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">
              Performance Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                <div className="font-extrabold text-4xl text-green-400">
                  15.2
                </div>
                <div className="text-gray-400 mt-1 text-sm">Avg Points</div>
              </div>
              <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                <div className="font-extrabold text-4xl text-blue-400">8.7</div>
                <div className="text-gray-400 mt-1 text-sm">Rebounds</div>
              </div>
              <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                <div className="font-extrabold text-4xl text-yellow-400">
                  12.4
                </div>
                <div className="text-gray-400 mt-1 text-sm">Assists</div>
              </div>
              <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                <div className="font-extrabold text-4xl text-red-400">2.3</div>
                <div className="text-gray-400 mt-1 text-sm">Steals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;