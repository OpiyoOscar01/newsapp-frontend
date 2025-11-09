import React from "react";

const Newsletter: React.FC = () => {
  return (
    <section className="min-h-screen bg-gray-50 text-gray-800 py-8 px-6 md:px-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Subscribe to the <span className="text-blue-600">DefinePress</span> Newsletter
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Stay informed with the latest stories, insights, and special reports
          delivered straight to your inbox. Join our growing community of readers
          who believe in truth, context, and meaningful journalism.
        </p>
      </div>

      {/* Newsletter Features */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Top Headlines</h3>
          <p className="text-gray-600">
            Get daily and weekly summaries of the biggest national and global stories.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">In-Depth Analysis</h3>
          <p className="text-gray-600">
            Receive thoughtful commentary and investigative reports from our editors.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Exclusive Updates</h3>
          <p className="text-gray-600">
            Be the first to know about special features, interviews, and media projects.
          </p>
        </div>
      </div>

      {/* Subscription Form */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
          Join the Newsletter
        </h2>
        <form className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
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
  );
};

export default Newsletter;
