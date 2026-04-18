// src/api/interactions/ArticleInteractionQueries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { axiosInstance } from '../axiosConfig';
import type {
  RecordViewRequest,
  RecordViewResponse,
  ToggleLikeResponse,
  RecordShareRequest,
  RecordShareResponse,
  ToggleBookmarkResponse,
  AddCommentRequest,
  AddCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  DeleteCommentResponse,
  GetCommentsResponse,
  GetInteractionCountsResponse,
  GetUserInteractionsResponse,
} from './ArticleInteractionTypes';

/* -------------------------------------------------------------------------- */
/*                               QUERY KEYS                                   */
/* -------------------------------------------------------------------------- */

export const interactionKeys = {
  all: ['interactions'] as const,
  counts: (articleId: number) => [...interactionKeys.all, 'counts', articleId] as const,
  comments: (articleId: number, page?: number, perPage?: number) => 
    [...interactionKeys.all, 'comments', articleId, { page, perPage }] as const,
  userLikes: () => [...interactionKeys.all, 'user', 'likes'] as const,
  userBookmarks: () => [...interactionKeys.all, 'user', 'bookmarks'] as const,
};

/* -------------------------------------------------------------------------- */
/*                               MUTATION HOOKS                               */
/* -------------------------------------------------------------------------- */

/**
 * Record an article view
 */
export const useRecordView = (
  callbacks?: {
    onSuccess?: (data: RecordViewResponse) => void;
    onError?: (error: AxiosError<RecordViewResponse>) => void;
  }
) => {
  return useMutation<RecordViewResponse, AxiosError<RecordViewResponse>, { articleId: number; data: RecordViewRequest }>({
    mutationFn: async ({ articleId, data }) => {
      const response = await axiosInstance.post<RecordViewResponse>(`/articles/${articleId}/view`, data);
      return response.data;
    },
    onSuccess: (data) => {
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to record view:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Toggle like on an article
 */
export const useToggleLike = (
  callbacks?: {
    onSuccess?: (data: ToggleLikeResponse) => void;
    onError?: (error: AxiosError<ToggleLikeResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<ToggleLikeResponse, AxiosError<ToggleLikeResponse>, { articleId: number }>({
    mutationFn: async ({ articleId }) => {
      const response = await axiosInstance.post<ToggleLikeResponse>(`/articles/${articleId}/like/toggle`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate counts for this article
      queryClient.invalidateQueries({ 
        queryKey: interactionKeys.counts(variables.articleId) 
      });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to toggle like:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Record a share
 */
export const useRecordShare = (
  callbacks?: {
    onSuccess?: (data: RecordShareResponse) => void;
    onError?: (error: AxiosError<RecordShareResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<RecordShareResponse, AxiosError<RecordShareResponse>, { articleId: number; data: RecordShareRequest }>({
    mutationFn: async ({ articleId, data }) => {
      const response = await axiosInstance.post<RecordShareResponse>(`/articles/${articleId}/share`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate counts for this article
      queryClient.invalidateQueries({ 
        queryKey: interactionKeys.counts(variables.articleId) 
      });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to record share:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Toggle bookmark on an article
 */
export const useToggleBookmark = (
  callbacks?: {
    onSuccess?: (data: ToggleBookmarkResponse) => void;
    onError?: (error: AxiosError<ToggleBookmarkResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<ToggleBookmarkResponse, AxiosError<ToggleBookmarkResponse>, { articleId: number }>({
    mutationFn: async ({ articleId }) => {
      const response = await axiosInstance.post<ToggleBookmarkResponse>(`/articles/${articleId}/bookmark/toggle`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate counts for this article and user bookmarks
      queryClient.invalidateQueries({ 
        queryKey: interactionKeys.counts(variables.articleId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: interactionKeys.userBookmarks() 
      });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to toggle bookmark:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Add a comment to an article
 */
export const useAddComment = (
  callbacks?: {
    onSuccess?: (data: AddCommentResponse) => void;
    onError?: (error: AxiosError<AddCommentResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<AddCommentResponse, AxiosError<AddCommentResponse>, { articleId: number; data: AddCommentRequest }>({
    mutationFn: async ({ articleId, data }) => {
      const response = await axiosInstance.post<AddCommentResponse>(`/articles/${articleId}/comments`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate comments and counts for this article
      queryClient.invalidateQueries({ 
        queryKey: interactionKeys.comments(variables.articleId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: interactionKeys.counts(variables.articleId) 
      });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to add comment:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Update a comment
 */
export const useUpdateComment = (
  callbacks?: {
    onSuccess?: (data: UpdateCommentResponse) => void;
    onError?: (error: AxiosError<UpdateCommentResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateCommentResponse, AxiosError<UpdateCommentResponse>, { commentId: number; data: UpdateCommentRequest; articleId: number }>({
    mutationFn: async ({ commentId, data }) => {
      const response = await axiosInstance.put<UpdateCommentResponse>(`/articles/comments/${commentId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate comments for this article
      queryClient.invalidateQueries({ 
        queryKey: interactionKeys.comments(variables.articleId) 
      });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to update comment:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Delete a comment
 */
export const useDeleteComment = (
  callbacks?: {
    onSuccess?: (data: DeleteCommentResponse) => void;
    onError?: (error: AxiosError<DeleteCommentResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCommentResponse, AxiosError<DeleteCommentResponse>, { commentId: number; articleId: number }>({
    mutationFn: async ({ commentId }) => {
      const response = await axiosInstance.delete<DeleteCommentResponse>(`/articles/comments/${commentId}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate comments and counts for this article
      queryClient.invalidateQueries({ 
        queryKey: interactionKeys.comments(variables.articleId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: interactionKeys.counts(variables.articleId) 
      });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to delete comment:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                               QUERY HOOKS                                  */
/* -------------------------------------------------------------------------- */

/**
 * Get interaction counts for an article
 */
export const useGetInteractionCounts = (
  articleId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: interactionKeys.counts(articleId),
    queryFn: async () => {
      const response = await axiosInstance.get<GetInteractionCountsResponse>(`/articles/${articleId}/interactions/counts`);
      return response.data.data;
    },
    enabled: !!articleId && options?.enabled !== false,
    staleTime: 1000 * 30, // 30 seconds
  });
};

/**
 * Get comments for an article
 */
export const useGetComments = (
  articleId: number,
  page: number = 1,
  perPage: number = 20,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: interactionKeys.comments(articleId, page, perPage),
    queryFn: async () => {
      const response = await axiosInstance.get<GetCommentsResponse>(`/articles/${articleId}/comments`, {
        params: { page, per_page: perPage }
      });
      return response.data.data;
    },
    enabled: !!articleId && options?.enabled !== false,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Get user's liked articles (requires authentication)
 */
export const useGetUserLikes = (
  page: number = 1,
  perPage: number = 20,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...interactionKeys.userLikes(), { page, perPage }],
    queryFn: async () => {
      const response = await axiosInstance.get<GetUserInteractionsResponse>('/user/likes', {
        params: { page, per_page: perPage }
      });
      return response.data.data;
    },
    enabled: options?.enabled !== false,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Get user's bookmarked articles (requires authentication)
 */
export const useGetUserBookmarks = (
  page: number = 1,
  perPage: number = 20,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...interactionKeys.userBookmarks(), { page, perPage }],
    queryFn: async () => {
      const response = await axiosInstance.get<GetUserInteractionsResponse>('/user/bookmarks', {
        params: { page, per_page: perPage }
      });
      return response.data.data;
    },
    enabled: options?.enabled !== false,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/* -------------------------------------------------------------------------- */
/*                               EXPORT                                       */
/* -------------------------------------------------------------------------- */

export default {
  // Mutation hooks
  useRecordView,
  useToggleLike,
  useRecordShare,
  useToggleBookmark,
  useAddComment,
  useUpdateComment,
  useDeleteComment,
  // Query hooks
  useGetInteractionCounts,
  useGetComments,
  useGetUserLikes,
  useGetUserBookmarks,
  // Keys
  interactionKeys,
};