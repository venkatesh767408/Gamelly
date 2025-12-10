import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import OTPVerification from "./pages/Auth/OTPVerification";
import Toast from "./components/common/Toast";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

import Navbar from "./components/common/Navbar";
import Profile from "./pages/profile/profile";
import Createteam from "./pages/create-team/CreateTeam";
import Dashboard from "./pages/Dashboard/Dashboard";
import StartGamePage from "./pages/Dashboard/StartGamePage";
import LiveGamePage from "./pages/Dashboard/LiveGamePage";
import Home from "./pages/Home/Home";
import PricingSection from "./pages/PricingSection/PricingSection";
import FootballMain from "./pages/Games/Football/FootballMain";
import VolleyballMain from "./pages/Games/Volleyball/VolleyballMain";
import BasketballMain from "./pages/Games/Basketball/BasketballMain";
import BaseballMain from "./pages/Games/Baseball/BaseballMain";
import SoftballMain from "./pages/Games/Softball/SoftballMain";
import RugbyMain from "./pages/Games/Rugby/RugbyMain";
import Footer from "./components/common/Footer";
import BlogMain from "./pages/Resources/Blog/BlogMain";

// Layout wrapper to control Navbar/Footer visibility
const Layout = () => {
  const location = useLocation();
  const hideLayout =
    location.pathname.startsWith("/team/") ||
    location.pathname.startsWith("/game/") || // hide for dynamic /team/:teamId
    [
      "/register",
      "/login",
      "/forgot-password",
      "/reset-password",
      "/dashboard",
      "/profile",
    ].includes(location.pathname);

  return (
    <>
      <Toast />

      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<PricingSection />} />
        <Route path="/football" element={<FootballMain />} />
        <Route path="/volleyball" element={<VolleyballMain />} />
        <Route path="/basketball" element={<BasketballMain />} />
        <Route path="/baseball" element={<BaseballMain />} />
        <Route path="/softball" element={<SoftballMain />} />
         <Route path="/rugby" element={<RugbyMain />} />
           <Route path="/blogs" element={<BlogMain />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-game" element={<Createteam />} />
        <Route path="/team/:teamId" element={<Dashboard />} />
        <Route path="/team/:teamId/start-game" element={<StartGamePage />} />
        <Route path="/game/:gameId/live" element={<LiveGamePage />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
