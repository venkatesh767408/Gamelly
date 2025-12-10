import { useState } from 'react';
import { FiCheck, FiStar, FiZap, FiAward, FiUsers, FiShield, FiClock, FiHelpCircle } from 'react-icons/fi';

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const plans = [
    {
      name: "Player Pass",
      description: "Best for individual players starting their journey",
      price: {
        monthly: 9,
        yearly: 90
      },
      popular: false,
      features: [
        { text: "Create personal player profile", included: true },
        { text: "Track individual performance stats", included: true },
        { text: "Access match highlights & reports", included: true },
        { text: "Join up to 2 teams", included: true },
        { text: "Mobile app access", included: true },
        { text: "Basic training drills library", included: true },
        { text: "Advanced tactics board", included: false },
        { text: "Video breakdown tools", included: false },
        { text: "Priority support", included: false },
        { text: "Custom branding", included: false }
      ],
      cta: "Get Started",
      color: "from-gray-600 to-gray-700"
    },
    {
      name: "Team Pass",
      description: "Perfect for teams, coaches, and clubs",
      price: {
        monthly: 29,
        yearly: 290
      },
      popular: true,
      features: [
        { text: "Up to 25 players per team", included: true },
        { text: "Advanced match & training stats", included: true },
        { text: "Coach dashboard & analytics", included: true },
        { text: "Priority support", included: true },
        { text: "Unlimited match/event scheduling", included: true },
        { text: "Mobile app access", included: true },
        { text: "Advanced tactics board", included: true },
        { text: "Video analysis integration", included: true },
        { text: "Custom reports for players", included: true },
        { text: "API access", included: false }
      ],
      cta: "Go Team",
      color: "from-[#96E660] to-green-500"
    },
    {
      name: "Club Pro",
      description: "For academies, leagues, and organizations",
      price: {
        monthly: 99,
        yearly: 990
      },
      popular: false,
      features: [
        { text: "Unlimited players & teams", included: true },
        { text: "Full performance analytics suite", included: true },
        { text: "AI-powered scouting insights", included: true },
        { text: "24/7 dedicated support", included: true },
        { text: "Custom dashboards for clubs", included: true },
        { text: "Mobile app access", included: true },
        { text: "Advanced tactics board", included: true },
        { text: "Video analysis & highlights", included: true },
        { text: "Club & sponsor branding", included: true },
        { text: "Full API access", included: true }
      ],
      cta: "Contact Sales",
      color: "from-purple-600 to-purple-700"
    }
  ];

  const savings = {
    "Player Pass": "Save $18",
    "Team Pass": "Save $58",
    "Club Pro": "Save $198"
  };

  return (
    <div className="min-h-screen py-26 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-full mb-4">
            <FiStar className="text-[#96E660]" />
            <span className="text-[#96E660] font-medium">PRICING PLANS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Fuel Your <span className="text-[#96E660]">Game</span> with PLAY
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you’re a player, coach, or club, PLAY has the tools to track, manage, and elevate your performance.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-700/50 p-2 rounded-2xl flex items-center gap-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-[#96E660] text-gray-900 shadow-lg shadow-[#96E660]/25'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-[#96E660] text-gray-900 shadow-lg shadow-[#96E660]/25'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 pt-10 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={plan.name} className={`relative group ${plan.popular ? 'lg:-mt-5 lg:mb-4' : ''}`}>
              <div
                className={`bg-[#0B1419] rounded-3xl p-8 h-full flex flex-col relative overflow-hidden border-1 border-gray-700 ${
                  plan.popular ? 'border-[#96E660] shadow-2xl shadow-[#96E660]/20' : 'border-gray-600'
                }`}
              >
                <div className="relative flex-1 flex flex-col">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-[40px] uppercase font-bold text-gray-600 mb-2">{plan.name}</h3>
                    <p className="text-gray-400 uppercase text-[12px]">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-white">
                        ${billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-gray-200">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-[#96E660] font-medium mt-2 flex items-center justify-center gap-1">
                        <FiZap className="animate-pulse" />
                        {savings[plan.name]}
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="flex-1 mb-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                              feature.included ? 'bg-[#96E660] text-gray-900' : 'bg-gray-600 text-gray-400'
                            }`}
                          >
                            {feature.included ? <FiCheck size={14} /> : <span className="w-1 h-1 bg-gray-400 rounded-full"></span>}
                          </div>
                          <span
                            className={`text-sm ${feature.included ? 'text-gray-100' : 'text-gray-400 line-through'}`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 group relative overflow-hidden ${
                      plan.popular
                        ? 'bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-600 border border-gray-800'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {plan.cta}
                      {plan.popular && <FiAward />}
                    </span>
                    {plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-300">Everything you need to know about PLAY plans</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I switch between plans?",
                answer: "Yes! Whether you’re a player moving to a team or a club scaling up, you can change anytime."
              },
              {
                question: "Do you offer a free trial?",
                answer: "Absolutely! Every plan starts with a 14-day free trial, no credit card required."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We support credit/debit cards, PayPal, and direct invoicing for clubs and academies."
              },
              {
                question: "Can I get custom pricing?",
                answer: "Yes, large academies, leagues, and federations can contact us for tailored pricing."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-700/30 rounded-2xl p-6 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <FiHelpCircle className="text-[#96E660] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                    <p className="text-gray-300 text-sm">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Still unsure which plan fits?</h3>
            <p className="text-gray-300 mb-6">Talk to our team and we’ll help you pick the right PLAY plan.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-[#96E660] text-gray-900 font-bold rounded-xl hover:bg-[#85d355] transition-colors flex items-center gap-2">
                <FiUsers />
                Contact Sales
              </button>
              <button className="px-8 py-3 border-2 border-gray-600 text-white font-bold rounded-xl hover:border-gray-500 transition-colors">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
