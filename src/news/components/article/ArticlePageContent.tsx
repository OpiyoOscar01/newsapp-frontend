import React from 'react';

import AdBanner from '../../components/AdBanner';

import type { Ad } from '../../types';
import type { ArticleRecord } from './ArticlePage.shared';

interface ArticlePageContentProps {
  article: ArticleRecord;
  mobileAd: Ad | null;
}

const ArticlePageContent: React.FC<ArticlePageContentProps> = ({ article, mobileAd }) => {
  const contentParagraphs = article.content ? article.content.split('\n\n') : [];

  return (
    <>
      {mobileAd && (
        <div className="mb-8 lg:hidden">
          <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 p-2 shadow-sm">
            <AdBanner ad={mobileAd} placement="inline" className="w-full" />
          </div>
        </div>
      )}

      <div className="prose prose-lg mb-10 max-w-none">
        {contentParagraphs.length > 0 ? (
          contentParagraphs.map((paragraph, index) => (
            <p key={index} className="mb-6 text-lg leading-relaxed text-gray-800">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="mb-6 text-lg leading-relaxed text-gray-800">
            {article.content || article.summary || 'No content available.'}
          </p>
        )}
      </div>
    </>
  );
};

export default ArticlePageContent;
