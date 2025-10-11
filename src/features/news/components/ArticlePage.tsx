import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticleById } from './data/mockData.ts';
import { type Article } from '../types';

/**
 * ArticlePage component displays full article content
 * Features: Article content, author info, tags, navigation, and social sharing
 */
const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!id) {
          throw new Error('Article ID not provided');
        }

        const foundArticle = getArticleById(id);
        if (!foundArticle) {
          throw new Error('Article not found');
        }

        setArticle(foundArticle);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
        console.error('Error loading article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleBackClick = () => {
    navigate('/categories');
  };

  const handleShare = async (platform: string) => {
    if (!article) return;
    
    const url = window.location.href;
    const title = article.title;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/categories"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            aria-label="Back to categories"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 p-6 bg-white rounded-xl shadow-sm">
            {/* Author Info */}
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={article.author.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={`${article.author.name} avatar`}
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
                }}
              />
              <div>
                <p className="font-semibold text-gray-900">{article.author.name}</p>
                <p className="text-sm text-gray-600">{formatDate(article.publishedDate)}</p>
              </div>
            </div>

            {/* Reading Time & Share */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {article.readTime} min read
              </span>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Share:</span>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 text-gray-400 hover:text-blue-700 transition-colors duration-200"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200';
            }}
          />
        </div>

        {/* Article Excerpt */}
        <div className="mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
          <p className="text-lg text-gray-700 italic leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-blue-100 mb-6">
            Don't miss out on the latest news and insights. Explore more categories and articles.
          </p>
          <Link
            to="/categories"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Explore More Categories
          </Link>
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;