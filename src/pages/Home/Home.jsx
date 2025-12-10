import Approach from "./Approach";
import Fame from "./Fame";
import Hero from "./Hero";
import Install from "./Install";
import Profile from "./Profile";
import SignUp from "./SignUp";
import WeDeliver from "./WeDeliver";
import Whosfor from "./Whosfor";



const Home = () => {
  return (
    <div>
    
      <Hero/>
      <Approach/>
      <Whosfor/>
      <WeDeliver/>
      <Fame/>
      <Profile/>
      <Install/>
      <SignUp/>

    </div>
  );
};

export default Home;