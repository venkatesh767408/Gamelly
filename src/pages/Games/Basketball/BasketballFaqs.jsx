import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const BasketballFaqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I live stream on PLAY?",
      answer: "To live stream on PLAY, navigate to the 'Live Stream' section in your account dashboard, select your basketball game, and follow the prompts to start streaming. Ensure you have a stable internet connection and compatible device."
    },
    {
      question: "How do I keep score for Basketball on PLAY?",
      answer: "Keeping score on PLAY is simple. Go to the 'Scorekeeping' tab during a basketball game, select the teams, and update the score in real-time using the intuitive interface designed for basketball matches."
    },
    {
      question: "Who can watch the live streamed games?",
      answer: "Live streamed basketball games on PLAY can be watched by anyone with access to the stream link, depending on your privacy settings. You can share the link with fans, friends, or keep it private for specific viewers."
    },
    {
      question: "How do I end a quarter and a match when scoring Basketball?",
      answer: "To end a quarter or match, go to the scorekeeping interface, select 'End Quarter' or 'End Match' as applicable, confirm the final scores, and save the results to finalize the basketball game."
    },
    {
      question: "How do I edit plays attribution while I'm scoring a basketball game?",
      answer: "While scoring, select the play you want to edit in the scorekeeping interface, adjust the attribution details such as player or action (e.g., field goal, assist), and save to update the play record."
    },
    {
      question: "Can I update the box score or edit plays after a basketball game is finished?",
      answer: "Yes, after a basketball game, you can access the game summary in your dashboard, select 'Edit Box Score' or 'Edit Plays,' make the necessary changes, and save to update the records."
    },
    {
      question: "What does PLAY cost?",
      answer: "For detailed pricing information, please visit the official PLAY website at  or check the support page for subscription details."
    }
  ];

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      className="min-h-screen max-w-7xl mx-auto mt-10 px-4 sm:px-6 flex flex-col items-center justify-center lg:px-8 py-20 relative overflow-hidden"
    >
      <div className="lg:flex items-start justify-between gap-7">
        <div className="flex flex-col items-start gap-3">
          <div>
            <h1 className="text-[30px] font-extrabold">PLAY'S</h1>
            <h1 className="text-[30px] font-extrabold">BASKETBALL FAQS</h1>
          </div>
          <p className="text-gray-200 text-[15px]">
            Find answers to frequently asked questions about PLAY Basketball. Need an extra assist? Head to our support page for more.
          </p>
          <button className="px-5 py-3 rounded-lg text-gray-800 bg-[#9AEA62]">
            VISIT SUPPORT
          </button>
        </div>
        <div className="p-4 mt-10 lg:mt-0 rounded-xl border border-gray-700 lg:w-[50%]">
          {faqs.map((faq, index) => (
            <div key={index}>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toggleAnswer(index)}
              >
                {openIndex === index ? (
                  <FaMinus size={20} className="text-[#9AEA62]" />
                ) : (
                  <FaPlus size={20} className="text-[#9AEA62]" />
                )}
                <p className="text-[15px] text-gray-100">{faq.question}</p>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-500 text-[13px] mt-2 pl-8">{faq.answer}</p>
              </div>
              <div className="w-full h-[1px] bg-gray-800 my-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasketballFaqs;