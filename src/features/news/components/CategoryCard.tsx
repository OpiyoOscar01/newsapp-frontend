import React from 'react';
import { type CategoryCardProps } from '../types';

/**
 * CategoryCard component displays individual category information
 * Features: Category image, name, description, article count, and read more button
 */
const CategoryCard: React.FC<CategoryCardProps> = ({ category, onReadMore }) => {
  const handleReadMore = () => {
    onReadMore(category.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleReadMore();
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      {/* Category Image */}
      <div className="relative overflow-hidden">
        <img
          src={category.imageUrl}
          alt={`${category.name} category`}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback image if the main image fails to load
            e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Article count badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
          {category.articleCount} articles
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Category Name */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
          {category.name}
        </h2>

        {/* Category Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {category.description}
        </p>

        {/* Read More Button */}
        <button
          onClick={handleReadMore}
          onKeyDown={handleKeyDown}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 transform hover:scale-105 active:scale-95"
          aria-label={`Read more articles in ${category.name} category`}
        >
          <span className="mr-2">Read More</span>
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Bottom accent border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </article>
  );
};

export default CategoryCard;