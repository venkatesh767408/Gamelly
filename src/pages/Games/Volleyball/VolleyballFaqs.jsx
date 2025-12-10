import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const VolleyballFaqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I live stream on PLAY?",
      answer:
        "To live stream on PLAY, navigate to the 'Live Stream' section in your account dashboard, select your volleyball match, and follow the prompts to start streaming. Ensure you have a stable internet connection and a compatible device."
    },
    {
      question: "How do I keep score for Volleyball on PLAY?",
      answer:
        "To keep score for volleyball, go to the 'Scorekeeping' tab during your match. Update points rally-by-rally, track rotations, and record sets using the volleyball scoring interface."
    },
    {
      question: "Who can watch the live streamed games?",
      answer:
        "Live streamed volleyball matches on PLAY can be viewed by anyone with the stream link, depending on your privacy settings. Share it publicly or keep it private for selected viewers."
    },
    {
      question: "How do I end a set and a match when scoring Volleyball?",
      answer:
        "To end a set or match, open the scorekeeping interface and select 'End Set' or 'End Match.' Confirm the final scores, and PLAY will automatically update the match summary."
    },
    {
      question: "How do I edit plays attribution while I'm scoring a Volleyball game?",
      answer:
        "While scoring, tap on the play you wish to edit, update player details such as spike, serve, block, or error, and save to adjust the match record."
    },
    {
      question: "Can I update the box score or edit plays after a Volleyball game is finished?",
      answer:
        "Yes. After the volleyball match ends, go to your dashboard, select the match summary, and choose 'Edit Box Score' or 'Edit Plays' to make updates."
    },
    {
      question: "What does PLAY cost?",
      answer:
        "For detailed pricing information, please visit the official PLAY website or check the support page for subscription details."
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
            <h1 className="text-[30px] font-extrabold">VOLLEYBALL FAQS</h1>
          </div>
          <p className="text-gray-200 text-[15px]">
            Find answers to frequently asked questions about PLAY Volleyball. Need more help? Visit our support page for assistance.
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
                  openIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-500 text-[13px] mt-2 pl-8">
                  {faq.answer}
                </p>
              </div>

              <div className="w-full h-[1px] bg-gray-800 my-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolleyballFaqs;
