import React from "react";

const AboutUs: React.FC = () => {
  return (
    <section className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="mb-6 mt-6 sm:mb-10 md:mb-16 animate-fadeIn px-6 md:px-20">
        <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-black rounded-2xl overflow-hidden shadow-2xl">
          {/* Background patterns */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.2),transparent_50%)]"></div>
          </div>

          <div className="relative px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 lg:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs sm:text-sm font-medium border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Live • Trusted by millions</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                Stay Informed with{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DefinePress
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed">
                Breaking news, deep analysis, global coverage — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <a
                  href="/category/world"
                  className="group relative inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-gray-900 text-sm sm:text-base md:text-lg font-semibold rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Explore World News
                    <svg
                      className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </a>

                <a
                  href="/category/technology"
                  className="group inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white/10 backdrop-blur-md text-white text-sm sm:text-base md:text-lg font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Tech Updates
                  <svg
                    className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 md:px-20 py-12">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            DefinePress is a next-generation news platform built to empower readers
            with credible, fast, and in-depth journalism. We redefine how stories are told,
            combining technology and editorial excellence to bring you the truth —
            clearly, quickly, and without bias.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To inform, inspire, and empower readers through accessible and verified news content.
              We aim to foster a society that values truth, context, and thoughtful discourse.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the most trusted digital news destination in Africa —
              one that integrates human storytelling with smart technology to
              redefine responsible journalism in the modern age.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Our Core Values</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["Integrity", "Innovation", "Accountability", "Community"].map((value) => (
              <li
                key={value}
                className="bg-blue-50 text-blue-800 py-4 rounded-xl font-medium shadow-sm"
              >
                {value}
              </li>
            ))}
          </ul>
        </div>
      </section>

   
    </section>
  );
};

export default AboutUs;
