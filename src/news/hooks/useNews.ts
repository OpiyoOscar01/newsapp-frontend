import { useState, useEffect } from 'react';
import { type Article,type  Category, type ArticleFilters } from '../types/news';
import {  dataService } from '../services/dataService';

interface UseNewsResult {
  data: Article[] | Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useArticles = (filters: ArticleFilters = {}): UseNewsResult => {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const articles = await dataService.getArticles(filters);
      setData(articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]); // Serialize filters for dependency comparison

  return { data, loading, error, refetch: fetchData };
};

export const useCategories = (): UseNewsResult => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const categories = await dataService.getCategories();
      setData(categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useArticle = (id: string) => {
  const [data, setData] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const article = await dataService.getArticleById(id);
      setData(article);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  return { data, loading, error, refetch: fetchData };
};