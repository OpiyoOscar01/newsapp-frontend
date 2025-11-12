import React from "react";

const ContactUs: React.FC = () => {
  return (
    <>
    <section className="min-h-screen bg-gray-50 text-gray-800 py-12 px-6 md:px-20">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Contact <span className="text-blue-600">DefinePress</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          We’d love to hear from you! Whether you’re a reader, contributor, or partner, 
          your feedback helps us build a better, more informed world.
        </p>
      </div>

      {/* Contact Info Section */}
      <div className="max-w-2xl mx-auto flex justify-center mb-16">
        <div className="bg-white rounded-2xl shadow p-8 text-center w-full md:w-auto transition-transform hover:scale-105">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Email Us</h3>
          <p className="text-gray-600">info@definepress.com</p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
          Send Us a Message
        </h2>
        <form className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
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
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Write your message..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Send Message
          </button>
        </form>
      </div>

    </section>
       {/* Advertising Section */}
      <section className="px-6 md:px-20 py-12 bg-gray-100">
        <div className="max-w-5xl mx-auto text-center mb-5">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Advertise <span className="text-blue-600">With Us</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Partner with DefinePress to reach a dynamic audience that values
            credible news, innovation, and social impact. Your brand deserves the
            spotlight — we make sure it’s seen by the right people.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Sponsored Content",
              description: "Collaborate with our editorial team to create meaningful branded stories that engage and inform our readers.",
            },
            {
              title: "Display Ads",
              description: "Place banners, pop-ups, or sidebar ads across DefinePress — reaching thousands of daily readers organically.",
            },
            {
              title: "Partnership Campaigns",
              description: "Co-create custom campaigns that align with your brand values and amplify your message across our platforms.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl shadow p-8 text-center">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Advertising Inquiry Form */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-10 mb-5">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 text-center">Advertising Inquiry</h3>
          <form className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="company" className="block text-gray-700 font-medium mb-2">Full Name / Company</label>
              <input
                id="company"
                type="text"
                placeholder="Enter your name or company"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-gray-700 font-medium mb-2">Estimated Budget</label>
              <input
                id="budget"
                type="text"
                placeholder="e.g. $500 - $2000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Campaign Details</label>
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
      </section>

      {/* Newsletter Subscription Section */}
      <section className="px-6 md:px-20 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Subscribe to the <span className="text-blue-600">DefinePress</span> Newsletter
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Stay informed with the latest stories, insights, and special reports
            delivered straight to your inbox. Join our community of informed readers.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-10">
          <form className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Subscribe Now
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            We respect your privacy. You can unsubscribe at any time.
          </p>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
