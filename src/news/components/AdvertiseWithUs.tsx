import React from "react";

const AdvertiseWithUs: React.FC = () => {
  return (
    <section className="min-h-screen bg-gray-50 text-gray-800 py-8 px-6 md:px-20">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Advertise <span className="text-blue-600">With Us</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Partner with DefinePress to reach a dynamic audience that values
          credible news, innovation, and social impact. Your brand deserves the
          spotlight — we make sure it’s seen by the right people.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">
            Sponsored Content
          </h3>
          <p className="text-gray-600">
            Collaborate with our editorial team to create meaningful branded
            stories that engage and inform our readers.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">
            Display Ads
          </h3>
          <p className="text-gray-600">
            Place banners, pop-ups, or sidebar ads across DefinePress — reaching
            thousands of daily readers organically.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">
            Partnership Campaigns
          </h3>
          <p className="text-gray-600">
            Let’s co-create custom campaigns that align with your brand values
            and amplify your message across our platforms.
          </p>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
          Advertising Inquiry
        </h2>
        <form className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Full Name / Company Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name or company"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-gray-700 font-medium mb-2">
              Estimated Budget
            </label>
            <input
              id="budget"
              type="text"
              placeholder="e.g. $500 - $2000"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Campaign Details
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Tell us about your goals, audience, or preferred ad type..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Submit Inquiry
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto mt-16 text-center text-gray-600">
        <p>
          For direct partnership discussions, email us at{" "}
          <span className="font-medium text-blue-600">
            ads@definepress.com
          </span>
          .
        </p>
        
      </div>
    </section>
  );
};

export default AdvertiseWithUs;
