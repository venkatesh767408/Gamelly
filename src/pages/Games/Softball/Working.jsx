const Working = () => {
  return (
    <div
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      className="min-h-screen max-w-7xl mx-auto mt-10 px-4 sm:px-6 flex flex-col items-center justify-center lg:px-8 md:py-20 relative overflow-hidden"
    >
      <div className="flex flex-col items-center text-center">
        <h1 className="text-gray-200 font-extrabold md:text-[50px] text-[30px]">
          HOW PLAY WORKS FOR YOU
        </h1>
        <p className="text-[15px] text-gray-400">
          Next-level features to help you serve greatness all season — free for
          coaches!
        </p>
      </div>

      <div className="mt-7 lg:flex items-center justify-between gap-10">
        <img src="/softball2.webp" alt="" loading="lazy"  className="lg:h-[500px] rounded-xl" />
        <div className="mt-5 ">
          <div className="md:flex items-center gap-3">
            <h1 className="font-bold text-[46px] text-[#9AEA62] ">
              LIVE VIDEO STREAMING
            </h1>
            <div className="flex items-center gap-3 bg-red-500 w-fit px-2 rounded-full">
              LIVE
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-start gap-1 text-gray-400">
              <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
              <p className="text-[15px]">
                It’s completely FREE to set up or tune in to a volleyball live
                stream. No complex setups required.
              </p>
            </div>
            <div className="flex items-start gap-1 text-gray-400">
              <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
              <p className="text-[15px]">
                Choose who can view your streams with audience controls.
              </p>
            </div>
            <div className="flex items-start gap-1 text-gray-400">
              <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
              <p className="text-[15px]">
                Follow along with an integrated scoreboard when you score and
                stream.
              </p>
            </div>
            <div className="flex items-start gap-1 text-gray-400">
              <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
              <p className="text-[15px]">
                View a video archive of your team’s streamed games with a
                scoreboard overlay at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 lg:flex items-center justify-between gap-10">
        <div className="mt-5 ">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-[46px] text-[#9AEA62] ">
              scorekeeping and stats
            </h1>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-start gap-1 text-gray-400">
              <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
              <p className="text-[15px]">
                NEW! Serving Stats. Volleyball teams that track serving stats
                while scorekeeping will see individual and team service stats
                that include service attempts, aces, errors, and an
                auto-generated ace percentage.
              </p>
            </div>
            <div className="flex items-start gap-1 text-gray-400">
              <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
              <p className="text-[15px]">
                Keep up with the pace of play with the option to assign players
                later if needed.
              </p>
            </div>
            <div className="flex items-start gap-1 text-gray-400">
              <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
              <p className="text-[15px]">
                Record the winner and update the match score when you end a set.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-7">
            <h1 className="font-bold text-[46px] text-[#9AEA62] ">
              Game Review
            </h1>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-start gap-1 text-gray-400">
              <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
              <p className="text-[15px]">
                Analyze games with the play-by-play or box score.
              </p>
            </div>
            <div className="flex items-start gap-1 text-gray-400">
              <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
              <p className="text-[15px]">
                Use screen recording to clip and share coachable moments.
              </p>
            </div>
          </div>
        </div> 
        <img src="/softball3.webp" alt="" loading="lazy"  className="md:h-[400px] lg:h-[300px] xl:h-[500px] 2xl:h-[500px] mt-5 md:mt-0 rounded-xl" />
      </div>

      <div className="mt-15 grid lg:grid-cols-2 md:grid-cols-1  gap-4">
     <div className="bg-[#111B21] p-4 border border-gray-700 rounded-xl">
           <h1 className="font-bold text-[40px] mb-5 text-[#9AEA62] ">
          TEAM MANAGEMENT
        </h1>

        <div className="relative">
          <img
            src="/teammanagement.webp"
            alt=""
            loading="lazy" 
            className="h-[400px] w-full object-cover"
          />
          <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-start gap-1 text-gray-400">
            <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
            <p className="text-[15px]">
              Add the season schedule and sync it to your personal calendar.
            </p>
          </div>
          <div className="flex items-start gap-1 text-gray-400">
            <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
            <p className="text-[15px]">
            Easily communicate with your team through in-app messaging.
            </p>
          </div>
          <div className="flex items-start gap-1 text-gray-400">
            <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
            <p className="text-[15px]">
           Use the RSVP feature to keep track of who can make the game.
            </p>
          </div>
        </div>
     </div>

       <div className="bg-[#111B21] p-4 border  border-gray-700 rounded-xl">
           <h1 className="font-bold text-[40px] mb-5 text-[#9AEA62] ">
          Automatic highlight clips
        </h1>

        <div className="relative">
          <img
            src="/automaticliveclips.webp"
            alt=""
            loading="lazy" 
            className="h-[400px] w-full object-cover"
          />
          <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-start gap-1 text-gray-400">
            <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
            <p className="text-[15px]">
              Clips of every point are automatically created on games that are streamed and scored.
            </p>
          </div>
          <div className="flex items-start gap-1 text-gray-400">
            <div className="h-2 w-2 rounded-full bg-[#9AEA62] mt-1" />
            <p className="text-[15px]">
          Automatic Highlight Clips get added directly to player profiles.
            </p>
          </div>
        
        </div>
     </div>
      </div>
    </div>
  );
};

export default Working;
