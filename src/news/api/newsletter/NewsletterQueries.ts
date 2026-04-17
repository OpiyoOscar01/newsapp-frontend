// src/api/newsletter/NewsletterQueries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { axiosInstance } from '../axiosConfig';
import type {
  SubscribeRequest,
  SubscribeResponse,
  UnsubscribeRequest,
  UnsubscribeResponse,
  GetPreferencesResponse,
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
  NewsletterSubscriber,
} from './NewsletterTypes';

/* -------------------------------------------------------------------------- */
/*                               QUERY KEYS                                   */
/* -------------------------------------------------------------------------- */

export const newsletterKeys = {
  all: ['newsletter'] as const,
  preferences: (email: string) => [...newsletterKeys.all, 'preferences', email] as const,
};

/* -------------------------------------------------------------------------- */
/*                               MUTATION HOOKS                               */
/* -------------------------------------------------------------------------- */

/**
 * Subscribe to newsletter
 */
export const useSubscribe = (
  callbacks?: {
    onSuccess?: (data: SubscribeResponse) => void;
    onError?: (error: AxiosError<SubscribeResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<SubscribeResponse, AxiosError<SubscribeResponse>, SubscribeRequest>({
    mutationFn: async (data: SubscribeRequest) => {
      const response = await axiosInstance.post<SubscribeResponse>('/newsletter/subscribe', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate cache for this email if we have it
      if (data.data?.subscriber?.email) {
        queryClient.invalidateQueries({ 
          queryKey: newsletterKeys.preferences(data.data.subscriber.email) 
        });
      }
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Subscription failed:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Unsubscribe from newsletter
 */
export const useUnsubscribe = (
  callbacks?: {
    onSuccess?: (data: UnsubscribeResponse) => void;
    onError?: (error: AxiosError<UnsubscribeResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<UnsubscribeResponse, AxiosError<UnsubscribeResponse>, UnsubscribeRequest>({
    mutationFn: async (data: UnsubscribeRequest) => {
      const response = await axiosInstance.post<UnsubscribeResponse>('/newsletter/unsubscribe', data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate cache for this email
      queryClient.invalidateQueries({ 
        queryKey: newsletterKeys.preferences(variables.email) 
      });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Unsubscribe failed:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Get subscriber preferences
 */
export const useGetPreferences = (
  email: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<NewsletterSubscriber, AxiosError<GetPreferencesResponse>>({
    queryKey: newsletterKeys.preferences(email),
    queryFn: async () => {
      const response = await axiosInstance.post<GetPreferencesResponse>('/newsletter/preferences', { email });
      return response.data.data;
    },
    enabled: !!email && options?.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

/**
 * Update subscriber preferences
 */
export const useUpdatePreferences = (
  callbacks?: {
    onSuccess?: (data: UpdatePreferencesResponse) => void;
    onError?: (error: AxiosError<UpdatePreferencesResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<UpdatePreferencesResponse, AxiosError<UpdatePreferencesResponse>, UpdatePreferencesRequest>({
    mutationFn: async (data: UpdatePreferencesRequest) => {
      const response = await axiosInstance.put<UpdatePreferencesResponse>('/newsletter/preferences', data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate cache for this email
      queryClient.invalidateQueries({ 
        queryKey: newsletterKeys.preferences(variables.email) 
      });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Update preferences failed:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};