import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubscribe } from '../../../../news/api/newsletter/NewsletterQueries';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { mutate: subscribe, isPending: loading } = useSubscribe({
    onSuccess: (data) => {
      setMessage(data.message);
      setIsError(false);
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error: any) => {
      setMessage(error.response?.data?.message || 'Subscription failed');
      setIsError(true);
      setTimeout(() => setMessage(''), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe({ email });
  };

  return (
    <section className="mt-16 md:mt-24">
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 rounded-3xl overflow-hidden shadow-xl border border-blue-100">
        <div className="absolute inset-0 bg-grid-blue/[0.03] bg-[size:20px_20px]" />
        <div className="relative px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Stay Informed</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Never Miss a Story
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Get the latest news and exclusive insights delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 md:px-6 py-3 md:py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm cursor-text"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p className={`text-sm mt-4 ${isError ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-6">
              By subscribing, you agree to our{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline cursor-pointer">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;