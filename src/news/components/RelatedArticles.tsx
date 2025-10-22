import React from 'react';
import { type Article } from '../types';
import { Link } from 'react-router-dom';

interface RelatedArticlesProps {
  articles: Article[];
  title?: string;
  className?: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
  title = 'Related Articles',
  className = ''
}) => {
  if (articles.length === 0) return null;

  return (
    <section className={`${className}`}>
      {/* 🔹 Section Header */}
      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
        <div className="w-10 h-1 bg-primary-600 rounded" />
      </div>

      {/* 🔹 Articles List */}
      <div className="flex flex-col gap-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <Link
              to={`/article/${article.id}`}
              className="
                flex flex-row-reverse items-stretch gap-3
                p-2 sm:p-3 lg:p-4
                bg-white rounded-lg hover:-translate-y-0.5
                transition-all duration-200 ease-out w-full
              "
            >
              {/* 🖼️ Image Container */}
              <div
                className="
                  relative overflow-hidden flex-shrink-0
                  w-[100px] sm:w-[120px] lg:w-[140px]
                  aspect-[4/3]
                  rounded-lg shadow-md
                  transition-all duration-300
                  self-stretch
                "
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="
                    w-full h-full object-cover
                    transform group-hover:scale-105 transition-transform duration-500 ease-out
                    rounded-lg
                  "
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-lg" />
              </div>

              {/* 📰 Content Container */}
              <div
                className="
                  flex-1 flex flex-col justify-start
                  py-1 sm:py-2
                  overflow-visible
                "
              >
                {/* 🏷️ Title */}
                <h3
                  className="
                    text-sm sm:text-base font-semibold text-gray-900
                    group-hover:text-primary-600 group-hover:underline
                    transition-all duration-300 leading-snug mb-1
                    line-clamp-2
                  "
                >
                  {article.title.length > 60
                    ? article.title.slice(0, 60) + '...'
                    : article.title}
                </h3>

                {/* ✍️ Author */}
                <p className="text-[11px] sm:text-xs text-gray-500">
                  By {article.author}
                </p>

                {/* ⏱️ Published Date & Read Time (large screens only) */}
                <div className="hidden lg:flex text-xs text-gray-500 mt-1 gap-1">
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
