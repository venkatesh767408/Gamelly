import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { BsSuitcaseLg } from "react-icons/bs";
import { FiHome } from "react-icons/fi";
import { GiGraduateCap } from "react-icons/gi";
import { PiMountains } from "react-icons/pi";
import { LuMountainSnow } from "react-icons/lu";
import { GiMountainRoad } from "react-icons/gi";
import { IoSunnyOutline } from "react-icons/io5";
import { LuLeaf } from "react-icons/lu";
import { FaRegSnowflake } from "react-icons/fa";
import { LuFlower2 } from "react-icons/lu";

const steps = [
  "Select your team sport",
  "Select your team type",
  "How old are your players?",
  "Where is your team based?",
  "What's your team name?",
  "When is your upcoming season?",
  "Choose your team logo",

];

const sports = [
  { name: "Football", icon: "/sports-images/g5.svg" },
  { name: "Baseball", icon: "/sports-images/g11.svg" },
];

const teamLogos = [
  { id: 1, name: "Eagle", url: "/team-logos/boxer.webp" },
  { id: 2, name: "Shark", url: "/team-logos/female-lion.webp" },
  { id: 3, name: "Tiger", url: "/team-logos/hyna.webp" },
  { id: 4, name: "Wolf", url: "/team-logos/ice-monster.webp" },
  { id: 4, name: "Bear", url: "/team-logos/ice-tiger.webp" },
  { id: 5, name: "Hawk", url: "/team-logos/policebird.webp" },
  { id: 6, name: "Dragon", url: "/team-logos/white-dog.webp" },
  { id: 7, name: "Phoenix", url: "/team-logos/yellow-dog.webp" },
  { id: 8, name: "Panther", url: "/team-logos/wolf1.webp" },
];

const teamTypes = [
  { name: "Select / Travel", icon: BsSuitcaseLg },
  { name: "Local League", icon: FiHome },
  { name: "School", icon: GiGraduateCap },
];

const ageGroups = [
  { name: "Under 13", icon: PiMountains },
  { name: "Between 13-18", icon: LuMountainSnow },
  { name: "Over 18", icon: GiMountainRoad },
];

const seasons = [
  { name: "Summer 2025", icon: IoSunnyOutline },
  { name: "Fall 2025", icon: LuLeaf },
  { name: "Winter 2025-26", icon: FaRegSnowflake },
  { name: "Spring-2026", icon: LuFlower2 },
  { name: "Summer 2026", icon: IoSunnyOutline },
  { name: "Fall 2026", icon: LuLeaf },
];

const TeamCreationModal = ({ showModal, onClose, onTeamCreated, isLoading, error, editingTeam }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    sport: "",
    teamlogo: "",
    teamType: "",
    ageGroup: "",
    location: "",
    teamName: "",
    season: "",
  });
  const [localError, setLocalError] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const modalContentRef = useRef(null);




  // Initialize form with editing team data
  useEffect(() => {
    if (editingTeam && showModal) {
      setFormData({
        sport: editingTeam.sport || "",
        teamlogo: editingTeam.teamlogo || "",
        teamType: editingTeam.teamType || "",
        ageGroup: editingTeam.ageGroup || "",
        location: editingTeam.location || "",
        teamName: editingTeam.teamName || "",
        season: editingTeam.season || "",
      });
    } else if (showModal) {
      // Reset form when creating new team
      setFormData({
        sport: "",
        teamlogo: "",
        teamType: "",
        ageGroup: "",
        location: "",
        teamName: "",
        season: "",
      });
      setCurrentStep(0);
    }
  }, [editingTeam, showModal]);

  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  // Clear local error when external error changes
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });
    setLocalError("");

    // Mock location suggestions
    if (value.length > 1) {
      const mockSuggestions = [
        { description: "New York, NY, USA" },
        { description: "Los Angeles, CA, USA" },
        { description: "Chicago, IL, USA" },
        { description: "Houston, TX, USA" },
        { description: "Phoenix, AZ, USA" }
      ].filter(location => 
        location.description.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectLocation = (prediction) => {
    setFormData({
      ...formData,
      location: prediction.description,
    });
    setShowSuggestions(false);
  };

  const handleSelectOption = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setLocalError("");
  };

  const handleSelectLogo = (logoUrl) => {
    setFormData({ ...formData, teamlogo: logoUrl });
    setLocalError("");
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.sport) {
          setLocalError("Please select a sport");
          return false;
        }
        break;
      case 1:
        if (!formData.teamType) {
          setLocalError("Please select a team type");
          return false;
        }
        break;
      case 2:
        if (!formData.ageGroup) {
          setLocalError("Please select an age group");
          return false;
        }
        break;
      case 3:
        if (!formData.location.trim()) {
          setLocalError("Please enter a location");
          return false;
        }
        break;
      case 4:
        if (!formData.teamName.trim()) {
          setLocalError("Please enter a team name");
          return false;
        }
        if (formData.teamName.trim().length < 3) {
          setLocalError("Team name must be at least 3 characters");
          return false;
        }
        break;
      case 5:
        if (!formData.season) {
          setLocalError("Please select a season");
          return false;
        }
        break;
      case 6:
        if (!formData.teamlogo) {
          setLocalError("Please select a logo for your team");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setLocalError("");
    } else {
      // Final step - create the team
      try {
        await onTeamCreated(formData);
        // Modal will close automatically via parent component
      } catch (err) {
        console.error("Team operation failed:", err);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setLocalError("");
    }
  };

  const isOptionSelected = (field, value) => {
    return formData[field] === value;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 p-2">
            {sports.map((sport) => (
              <div
                key={sport.name}
                className={`flex flex-col gap-2 sm:gap-3 items-center border group h-20 sm:h-25 w-full p-2 text-center leading-[18px] sm:leading-[20px] rounded-lg sm:rounded-xl cursor-pointer transition-colors ${
                  isOptionSelected("sport", sport.name)
                    ? "bg-violet-200 border-violet-400"
                    : "border-gray-700 hover:bg-violet-200 hover:border-none"
                }`}
                onClick={() => handleSelectOption("sport", sport.name)}
              >
                <img src={sport.icon} alt={sport.name} className="h-8 sm:h-10" />
                <p
                  className={`font-[400] text-xs sm:text-sm ${
                    isOptionSelected("sport", sport.name)
                      ? "text-violet-600"
                      : "text-gray-300 group-hover:text-violet-400"
                  }`}
                >
                  {sport.name}
                </p>
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 p-2">
            {teamTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.name}
                  className={`border w-full flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg sm:rounded-xl group h-28 sm:h-35 cursor-pointer transition-colors ${
                    isOptionSelected("teamType", type.name)
                      ? "bg-violet-200 border-violet-400"
                      : "border-gray-700 hover:bg-violet-200 hover:border-none"
                  }`}
                  onClick={() => handleSelectOption("teamType", type.name)}
                >
                  <Icon
                    size={40}
                    className={`${
                      isOptionSelected("teamType", type.name)
                        ? "text-violet-600"
                        : "text-gray-500"
                    }`}
                  />
                  <p
                    className={`text-sm sm:text-base mt-2 sm:mt-4 text-center ${
                      isOptionSelected("teamType", type.name)
                        ? "text-violet-600"
                        : "text-gray-300 group-hover:text-violet-400"
                    }`}
                  >
                    {type.name}
                  </p>
                </div>
              );
            })}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 p-2">
            {ageGroups.map((age) => {
              const Icon = age.icon;
              return (
                <div
                  key={age.name}
                  className={`border w-full flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg sm:rounded-xl group h-28 sm:h-35 cursor-pointer transition-colors ${
                    isOptionSelected("ageGroup", age.name)
                      ? "bg-violet-200 border-violet-400"
                      : "border-gray-700 hover:bg-violet-200 hover:border-none"
                  }`}
                  onClick={() => handleSelectOption("ageGroup", age.name)}
                >
                  <Icon
                    size={40}
                    className={
                      isOptionSelected("ageGroup", age.name)
                        ? "text-violet-600"
                        : "text-gray-500"
                    }
                  />
                  <p
                    className={`text-sm sm:text-base mt-2 sm:mt-4 text-center ${
                      isOptionSelected("ageGroup", age.name)
                        ? "text-violet-600"
                        : "text-gray-300 group-hover:text-violet-400"
                    }`}
                  >
                    {age.name}
                  </p>
                </div>
              );
            })}
          </div>
        );
      case 3:
        return (
          <div className="relative p-2">
            <p className="text-gray-400 pb-3 text-sm sm:text-base">
              Team location can later be adjusted in team settings on the
              PLAY app.
            </p>
            <input
              type="text"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleLocationChange}
              className="p-3 w-full border text-sm sm:text-[16px] rounded-lg focus:outline-none border-gray-700 text-gray-200 bg-transparent"
            />
            {showSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {locationSuggestions.map((prediction, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm sm:text-base"
                    onClick={() => handleSelectLocation(prediction)}
                  >
                    {prediction.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="p-2">
            <p className="text-gray-400 pb-3 text-sm sm:text-base">
              Make sure team members will recognize your team's name. Team name
              can later be adjusted in team settings on the PLAY app.
            </p>
            <input
              type="text"
              placeholder="ex. Manheim Tigers"
              value={formData.teamName}
              onChange={(e) => {
                setFormData({ ...formData, teamName: e.target.value });
                setLocalError("");
              }}
              className="border p-3 rounded-lg text-sm sm:text-[16px] w-full border-gray-700 focus:outline-none text-gray-300 bg-transparent"
            />
            <p className="text-gray-600 py-3 text-sm sm:text-base">
              Team name should be at least 3 characters.
            </p>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 p-2">
            {seasons.map((season) => {
              const Icon = season.icon;
              return (
                <div
                  key={season.name}
                  className={`border w-full flex flex-col gap-2 sm:gap-3 items-center justify-center p-3 sm:p-4 rounded-lg sm:rounded-xl group h-28 sm:h-35 cursor-pointer transition-colors ${
                    isOptionSelected("season", season.name)
                      ? "bg-violet-200 border-violet-400"
                      : "border-gray-700 hover:bg-violet-200 hover:border-none"
                  }`}
                  onClick={() => handleSelectOption("season", season.name)}
                >
                  <Icon
                    size={30}
                    className={
                      isOptionSelected("season", season.name)
                        ? "text-violet-600"
                        : "text-gray-500"
                    }
                  />
                  <p
                    className={`text-sm sm:text-base text-center ${
                      isOptionSelected("season", season.name)
                        ? "text-violet-600"
                        : "text-gray-300 group-hover:text-violet-400"
                    }`}
                  >
                    {season.name}
                  </p>
                </div>
              );
            })}
          </div>
        );
      case 6:
             return (
          <div className="pb-10 pt-3 px-2 overflow-y-auto scroll-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-3 pt-6 sm:gap-4 overflow-y-auto ">
              {teamLogos.map((logo) => (
                <div
                  key={logo.id}
                  className={`  border-2 rounded-lg sm:rounded-xl   cursor-pointer transition-all duration-200 ${
                    formData.teamlogo === logo.url
                      ? "border-blue-500 bg-blue-50 "
                      : "border-gray-600 hover:border-blue-300 bg-gray-900  hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelectLogo(logo.url)}
                >
                  <div className=" h-full w-full   flex items-center justify-center">
                    <img 
                      src={logo.url} 
                      alt={logo.name}
                      className="h-[100px] w-[100px] object-contain "
                      onError={(e) => {
                        e.target.src = '/team-logos/default-logo.png'; 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Selected Logo Preview */}
            {formData.teamlogo && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3 text-center">Selected Logo:</p>
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-white rounded-lg border-2 border-blue-500 overflow-hidden flex items-center justify-center">
                    <img 
                      src={formData.teamlogo} 
                      alt="Selected logo"
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.target.src = '/team-logos/default-logo.png';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const closeModal = () => {
    onClose();
    setCurrentStep(0);
    setFormData({
      sport: "",
      teamlogo: "",
      teamType: "",
      ageGroup: "",
      location: "",
      teamName: "",
      season: "",
    });
    setLocalError("");
  };

  const getNextButtonDisabled = () => {
    if (isLoading) return true;
    
    switch (currentStep) {
      case 0: return !formData.sport;
      case 1: return !formData.teamType;
      case 2: return !formData.ageGroup;
      case 3: return !formData.location.trim();
      case 4: return !formData.teamName.trim() || formData.teamName.trim().length < 3;
      case 5: return !formData.season;
      case 6: return !formData.teamlogo;
      default: return false;
    }
  };

  if (!showModal) return null;

 return (
  <div className="fixed inset-0 scroll-auto bg-black/10 backdrop-blur-xl bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4">
    <div className="bg-[#19202C] w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-lg p-4 sm:p-6  flex flex-col relative">
      <h1 className="text-lg sm:text-xl md:text-[25px] font-semibold flex flex-col items-center justify-center text-gray-400 pb-3 sm:pb-4">
        {editingTeam ? "Edit Team" : "New Team"}
      </h1>
      
      {/* Close button */}
      <button
        onClick={closeModal}
        className="absolute top-3 sm:top-4 left-3 sm:left-4 text-gray-600 cursor-pointer hover:text-gray-300 transition-colors"
        disabled={isLoading}
      >
        <IoMdClose size={20} className="sm:size-6" />
      </button>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-2 sm:h-2.5 mb-4 sm:mb-6">
        <div
          className="bg-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>

      <h2 className="text-gray-100 uppercase font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
        {steps[currentStep]}
      </h2>

      {/* Error Display */}
      {(localError || error) && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {localError || error}
        </div>
      )}

      {/* Main content area - FIXED SCROLL CONTAINER */}
      <div 
        className="flex-1 overflow-y-auto min-h-0 custom-scrollbar" 
        ref={modalContentRef}
        style={{ 
          maxHeight: '400px', // Force a maximum height to enable scrolling
          minHeight: '200px'  // Ensure minimum height
        }}
      >
        <div className="min-h-full pb-4"> {/* Added padding bottom */}
          {renderStepContent()}
        </div>
      </div>

      {/* Fixed buttons at bottom */}
      <div className="flex justify-end gap-3 mt-4 sm:mt-6 pt-4 border-t border-gray-700">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isLoading}
          className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-600 text-white cursor-pointer rounded-full disabled:opacity-50 text-sm sm:text-base hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={getNextButtonDisabled()}
          className="px-3 sm:px-4 py-1 sm:py-2 bg-[#9AEA62] cursor-pointer text-gray-800 rounded-full disabled:opacity-50 text-sm sm:text-base hover:bg-[#8CD95B] transition-colors"
        >
          {isLoading
            ? (editingTeam ? "Updating..." : "Creating...")
            : currentStep === steps.length - 1
            ? (editingTeam ? "Update Team" : "Create Team")
            : "Next"}
        </button>
      </div>
    </div>
  </div>
);
};

export default TeamCreationModal;