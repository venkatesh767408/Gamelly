

const SignUp=()=>{
    return(
<div 
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      className=" max-w-7xl mx-auto px-4  sm:px-6 flex flex-col items-center justify-center lg:px-8 py-20 relative overflow-hidden"
>
<div className="bg-[#111B21] border border-gray-700 rounded-xl md:flex justify-between gap-5 relative w-full">
    <div className="p-5 flex flex-col items-start lg:w-[50%]">
        <h1 className="text-[20px] text-gray-400">Do You Have Any Questions?</h1>
        <h1 className="md:text-[70px] text-[40px]">CONTACT US!</h1>
        <div className="h-[2px] w-[150px] bg-[#9AEA62] my-5"/>
        <p className="text-[17px] text-gray-300 mt-4 md:w-[500px]">If You need more information or you want to cooperate with us,Our team is for you..</p>

        <div className="flex items-center gap-4 rounded-xl bg-[#9AEA62] text-black px-5 py-3 mt-10">
            Team @PLAY
        </div>
    </div>
       <div>
        <img src="/signup.webp" alt="" className="h-[450px] hidden lg:block md:absolute right-0 bottom-0" />
       </div>
</div>
</div>
    )
}

export default SignUp