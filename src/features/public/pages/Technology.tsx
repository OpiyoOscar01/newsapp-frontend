import React from "react";
import { Helmet } from "react-helmet-async";

const Technology: React.FC = () => {
  // Featured topics with Pexels image links
  const topics = [
    {
      title: "AI & Machine Learning",
      description: "Discover trends and breakthroughs in AI.",
      img: "https://images.pexels.com/photos/5473953/pexels-photo-5473953.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Gadgets & Devices",
      description: "Reviews and news about the latest devices.",
      img: "https://images.pexels.com/photos/1103534/pexels-photo-1103534.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Startups & Innovation",
      description: "Learn about emerging tech startups.",
      img: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Technology - DefinePress</title>
        <meta
          name="description"
          content="Latest technology news, updates, and insights on DefinePress."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            Technology News
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
            Stay ahead with the latest updates on AI, gadgets, startups, and innovation.
          </p>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Explore Technology Topics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {topic.img && (
                <img
                  src={topic.img}
                  alt={topic.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-semibold text-2xl mb-2 text-gray-900">
                  {topic.title}
                </h3>
                <p className="text-gray-600 flex-grow">{topic.description}</p>
                <button className="mt-4 self-start text-blue-600 font-medium hover:underline">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter / Call to Action */}
      <section className="bg-blue-600 py-12 mt-12 text-white text-center rounded-lg mx-4 md:mx-0">
        <h2 className="text-3xl font-bold mb-4">Stay Updated with Tech News</h2>
        <p className="mb-6">Subscribe to our newsletter to get the latest tech insights.</p>
        <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition"
          >
            Subscribe
          </button>
        </form>
      </section>
    </>
  );
};

export default Technology;
