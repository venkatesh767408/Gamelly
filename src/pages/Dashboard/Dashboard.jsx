import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import MainPage from "./MainPage";
import TeamPage from "./TeamPage";
import OpponentsPage from "./OpponentsPage";
import TeamvsTeamPage from "./TeamvsTeamPage";
import LeftSidebar from "./LeftSidebar";
import StatsPage from "./StatsPage";

const TeamDashboard = ({ teamId, teamData }) => (
  <div className="font-sans">
    <TeamPage teamId={teamId} teamData={teamData} />
  </div>
);

const OpponentsDashboard = ({ teamId, sportIcon,teamData }) => (
  <div className="py-8 md:px-4 font-sans">
    <OpponentsPage teamId={teamId} sportIcon={sportIcon} teamData={teamData}/>
  </div>
);

const TeamvsTeam = ({ teamId, teamData }) => (
  <div className="py-8 md:px-4 font-sans">
    <TeamvsTeamPage teamId={teamId} teamData={teamData} />
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("HOME");
  const [isMobile, setIsMobile] = useState(false);
  const { teamId } = useParams();

  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  const receivedTeamData = location.state?.teamData;
  const receivedSportIcon = location.state?.sportIcon;

  const teamData = receivedTeamData
    ? {
        ...receivedTeamData,
        createdBy: receivedTeamData.createdBy || {
          name: auth.user?.username || auth.user?.name || "coach",
        },
      }
    : {
        teamName: "Team Name",
        sport: "Sport",
        createdBy: { name: auth.user?.username || "Coach" },
        location: "Location",
        teamType: "Team Type",
        ageGroup: "Age Group",
        season: "Season",
      };

  const sportIcon = receivedSportIcon || "/bb.svg";

  const tabs = [
    { name: "HOME", component: <MainPage teamId={teamId} teamData={teamData}  /> },
    {
      name: "TEAM",
      component: <TeamDashboard teamId={teamId} teamData={teamData} />,
    },
    {
      name: "OPPONENTS",
      component: <OpponentsDashboard teamId={teamId} sportIcon={sportIcon} teamData={teamData} />,
    },
    {
      name: "SCHEDULE",
      component: <TeamvsTeam teamId={teamId} teamData={teamData} />,
    },
    {
      name:"STATS",
      component: <StatsPage   teamId={teamId} teamData={teamData}   />,
    }
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="hidden lg:block">
        <LeftSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          team={teamData}
          sportIcon={sportIcon}
          
        />
      </div>

      <div
        className={`flex-1 w-full ${
          isMobile ? "pb-24" : "lg:ml-[280px]"
        } p-4 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          {isMobile && (
            <div className="lg:hidden mb-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {teamData.teamName}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Coach: {teamData.createdBy?.name || "Coach"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{teamData.location}</p>
                  <p className="text-[#9AEA62] text-sm font-medium">
                    {teamData.sport}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className={isMobile ? "mt-2" : "mt-6"}>
            {tabs.find((tab) => tab.name === activeTab)?.component}
          </div>
        </div>
      </div>


       <div className="lg:hidden">
        <LeftSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          team={teamData}
          sportIcon={sportIcon}
        />
      </div>
    </div>
  );
};

export default Dashboard;
