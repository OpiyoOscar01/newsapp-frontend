import React from "react";
import { Helmet } from "react-helmet-async";
import { HiTrendingUp } from "react-icons/hi";
import { BsNewspaper, BsStars, BsArrowRight, BsClock, BsEye } from "react-icons/bs";

/** Interfaces */
interface FeaturedCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  category: string;
  readTime?: string;
  views?: string;
  href: string;
  priority: "high" | "medium" | "low";
}

interface NewsStats {
  totalArticles: number;
  dailyReaders: number;
  categories: number;
}

const Home: React.FC = () => {
  const featuredContent: FeaturedCard[] = [
    {
      id: "breaking-news",
      title: "Breaking News",
      description:
        "Stay ahead with real-time updates and breaking news from around the globe.",
      icon: <BsNewspaper className="text-2xl text-blue-600" aria-hidden="true" />,
      category: "News",
      readTime: "2 min read",
      views: "12.5k",
      href: "/breaking",
      priority: "high",
    },
    {
      id: "trending-stories",
      title: "Trending Stories",
      description:
        "Discover what's capturing global attention with expert commentary.",
      icon: <HiTrendingUp className="text-2xl text-green-600" aria-hidden="true" />,
      category: "Trending",
      readTime: "4 min read",
      views: "8.3k",
      href: "/trending",
      priority: "high",
    },
    {
      id: "featured-analysis",
      title: "Featured Analysis",
      description:
        "In-depth investigative reports and expert analysis on key stories.",
      icon: <BsStars className="text-2xl text-purple-600" aria-hidden="true" />,
      category: "Analysis",
      readTime: "8 min read",
      views: "15.7k",
      href: "/analysis",
      priority: "medium",
    },
  ];

  const newsStats: NewsStats = {
    totalArticles: 25847,
    dailyReaders: 142000,
    categories: 12,
  };

  const handleCardClick = (href: string) => {
    // Replace with navigate() in production
    console.log(`Navigating to: ${href}`);
  };

  const formatNumber = (num: number): string =>
    num >= 1_000_000
      ? `${(num / 1_000_000).toFixed(1)}M`
      : num >= 1000
      ? `${(num / 1000).toFixed(1)}k`
      : num.toString();

  return (
    <>
      <Helmet>
        <title>DefinePress - Your Premier News Source</title>
        <meta
          name="description"
          content="DefinePress delivers breaking news, in-depth analysis, and trending stories from politics, technology, sports, and business."
        />
        <link rel="canonical" href="https://definepress.com" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                DefinePress
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              Your trusted destination for breaking news, insightful analysis, and the stories that shape our world.
            </p>

            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{formatNumber(newsStats.totalArticles)}+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Articles Published</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{formatNumber(newsStats.dailyReaders)}+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Daily Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{newsStats.categories}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Categories</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Content</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our curated selection of breaking news, trending stories, and expert analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredContent.map((card) => (
                <article
                  key={card.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100 relative"
                  onClick={() => handleCardClick(card.href)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(card.href); }}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors duration-200">
                        {card.icon}
                      </div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1 bg-gray-100 rounded-full">{card.category}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">{card.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{card.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {card.readTime && <span className="flex items-center gap-1"><BsClock className="text-xs" />{card.readTime}</span>}
                        {card.views && <span className="flex items-center gap-1"><BsEye className="text-xs" />{card.views}</span>}
                      </div>

                      <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all duration-200">
                        <span>Explore</span>
                        <BsArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>

                  {card.priority === "high" && (
                    <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Informed, Stay Ahead</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of readers who trust DefinePress for accurate, timely, and comprehensive news coverage.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => console.log('Subscribe clicked')}
            >
              Get Started Today
              <BsArrowRight />
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
export type { FeaturedCard, NewsStats };
