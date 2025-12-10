import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const RugbyFaqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I live stream on PLAY?",
      answer:
        "To live stream on PLAY, go to the 'Live Stream' section in your dashboard, select your rugby match, and follow the steps to start streaming. Make sure you have a stable internet connection and a compatible device."
    },
    {
      question: "How do I keep score for Rugby on PLAY?",
      answer:
        "To keep score, open the 'Scorekeeping' tab during a rugby match, choose the teams, and update scores for tries, conversions, penalties, and drop goals using the rugby scoring interface."
    },
    {
      question: "Who can watch the live streamed games?",
      answer:
        "Anyone with the stream link can watch your live streamed rugby match, depending on your privacy settings. You may share the link publicly or keep it private for selected viewers."
    },
    {
      question: "How do I end a half or full match when scoring Rugby?",
      answer:
        "To end a half or the full match, go to the scorekeeping screen, select 'End Half' or 'End Match,' confirm the final scores, and save the results to complete the rugby game."
    },
    {
      question: "How do I edit play attribution while scoring a Rugby game?",
      answer:
        "While scoring, select the play you want to edit, update the player details or action type—such as try, conversion, penalty, or card—and save the changes to update the match record."
    },
    {
      question: "Can I update the match stats or edit plays after a Rugby game is finished?",
      answer:
        "Yes, after a rugby match is completed, you can access it in your dashboard, choose 'Edit Match Stats' or 'Edit Plays,' make your adjustments, and save the updates."
    },
    {
      question: "What does PLAY cost?",
      answer:
        "For updated pricing details, please visit the official PLAY website or check the support page for subscription and feature breakdowns."
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
            <h1 className="text-[30px] font-extrabold">RUGBY FAQS</h1>
          </div>
          <p className="text-gray-200 text-[15px]">
            Find answers to frequently asked questions about PLAY Rugby. Need more help? Visit our support page for assistance.
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

export default RugbyFaqs;
