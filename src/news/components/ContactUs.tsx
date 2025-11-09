import React from "react";

const ContactUs: React.FC = () => {
  return (
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
  );
};

export default ContactUs;
