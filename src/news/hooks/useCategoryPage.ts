import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getArticlesByCategory, getCategories } from '../data/dataService';
import { selectRandomAd } from '../utils/randomAdSelector';
import { paginate } from '../utils/paginationHelpers';
import { filterArticlesBySearch, sortArticles } from '../utils/filterArticles';
import { type Ad} from '../types';
import {type Article} from '../types/news';
import { trackVisitor } from '../utils/visitorTracking';

interface PaginatedData<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface UseCategoryPageReturn {
  // State
  category: any;
  allCategoryArticles: Article[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'date' | 'title' | 'readTime';
  currentPage: number;
  itemsPerPage: number;
  topBannerAd: Ad | null;
  sidebarAd: Ad | null;
  
  // Derived data
  filteredAndSortedArticles: Article[];
  paginatedData: PaginatedData<Article>;
  
  // Actions
  handleSearch: (query: string) => void;
  handleSortChange: (newSortBy: 'date' | 'title' | 'readTime') => void;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (newItemsPerPage: number) => void;
  handleRetry: () => void;
}

export const useCategoryPage = (): UseCategoryPageReturn => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Ad states
  const [topBannerAd, setTopBannerAd] = useState<Ad | null>(null);
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'readTime'>('date');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(searchParams.get('perPage') || '4'));
  
  const [category, setCategory] = useState<any>(null);
  const [allCategoryArticles, setAllCategoryArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track visitor
  useEffect(() => {
    if (categorySlug) {
      trackVisitor({ categorySlug });
    }
  }, [categorySlug]);

  // Load category data
  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categorySlug) {
        setError('Category is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const categories = await getCategories();
        const currentCategory = categories.find(cat => cat.slug === categorySlug);
        
        if (!currentCategory) {
          setError('Category not found');
          setLoading(false);
          return;
        }
        
        setCategory(currentCategory);
        const articles = await getArticlesByCategory(categorySlug);
        setAllCategoryArticles(articles);

        // Load ads
        const topBanner = selectRandomAd(categorySlug, 'banner');
        const sidebar = selectRandomAd(categorySlug, 'sidebar');
        
        setTopBannerAd(topBanner);
        setSidebarAd(sidebar);
      } catch (err) {
        console.error('Failed to load category:', err);
        setError('Failed to load category content');
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categorySlug]);

  // Filter and sort articles
  const filteredAndSortedArticles: Article[] = useMemo(() => {
    let articles = allCategoryArticles;
    
    if (searchQuery.trim()) {
      articles = filterArticlesBySearch(articles, searchQuery);
    }
    
    articles = sortArticles(articles, sortBy);
    
    return articles;
  }, [allCategoryArticles, searchQuery, sortBy]);

  // Paginate articles
  const paginatedData: PaginatedData<Article> = useMemo(() => {
    return paginate(filteredAndSortedArticles, currentPage, itemsPerPage) as PaginatedData<Article>;
  }, [filteredAndSortedArticles, currentPage, itemsPerPage]);

  // Update URL params
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (currentPage > 1) newParams.set('page', currentPage.toString());
    if (itemsPerPage !== 4) newParams.set('perPage', itemsPerPage.toString());
    setSearchParams(newParams);
  }, [searchQuery, currentPage, itemsPerPage, setSearchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: 'date' | 'title' | 'readTime') => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return {
    // State
    category,
    allCategoryArticles,
    loading,
    error,
    searchQuery,
    sortBy,
    currentPage,
    itemsPerPage,
    topBannerAd,
    sidebarAd,
    
    // Derived data
    filteredAndSortedArticles,
    paginatedData,
    
    // Actions
    handleSearch,
    handleSortChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleRetry,
  };
};