// src/api/interactions/ArticleInteractionTypes.ts

/* -------------------------------------------------------------------------- */
/*                               BASE TYPES                                   */
/* -------------------------------------------------------------------------- */

export type InteractionType = 'view' | 'like' | 'share' | 'bookmark' | 'comment';

export interface ArticleInteraction {
  id: number;
  article_id: number;
  user_id: number | null;
  interaction_type: InteractionType;
  session_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  metadata: InteractionMetadata | null;
  interaction_date: string;
  created_at: string;
  updated_at: string;
  // Comment specific fields
  comment_content?: string;
  parent_comment_id?: number | null;
  is_edited?: boolean;
  edited_at?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                               METADATA TYPES                               */
/* -------------------------------------------------------------------------- */

export interface ViewMetadata {
  time_spent?: number;
  scroll_depth?: number;
}

export interface ShareMetadata {
  platform?: string;
}

export interface InteractionMetadata {
  time_spent?: number;
  scroll_depth?: number;
  platform?: string;
  [key: string]: any;
}

/* -------------------------------------------------------------------------- */
/*                           REQUEST/RESPONSE TYPES                           */
/* -------------------------------------------------------------------------- */

// View
export interface RecordViewRequest {
  referrer?: string;
  time_spent?: number;
  scroll_depth?: number;
}

export interface RecordViewResponse {
  success: boolean;
  message: string;
  data: null;
}

// Like
export interface ToggleLikeResponse {
  success: boolean;
  message: string;
  data: {
    liked: boolean;
    like_count: number;
  };
}

// Share
export interface RecordShareRequest {
  platform?: string;
}

export interface RecordShareResponse {
  success: boolean;
  message: string;
  data: {
    share_count: number;
  };
}

// Bookmark
export interface ToggleBookmarkResponse {
  success: boolean;
  message: string;
  data: {
    bookmarked: boolean;
    bookmark_count: number;
  };
}

// Comment
export interface AddCommentRequest {
  comment: string;
  parent_comment_id?: number;
}

export interface UpdateCommentRequest {
  comment: string;
}

export interface CommentUser {
  id?: number;
  name: string;
  email?: string;
  avatar?: string | null;
}

export interface CommentReply {
  id: number;
  content: string;
  user: CommentUser;
  created_at: string;
  is_edited: boolean;
  edited_at?: string | null;
}

export interface Comment {
  id: number;
  content: string;
  user: CommentUser;
  created_at: string;
  is_edited: boolean;
  edited_at?: string | null;
  replies?: CommentReply[];
  reply_count?: number;
}

export interface AddCommentResponse {
  success: boolean;
  message: string;
  data: {
    comment: Comment;
  };
}

export interface UpdateCommentResponse {
  success: boolean;
  message: string;
  data: {
    comment: {
      id: number;
      content: string;
      is_edited: boolean;
      edited_at: string;
    };
  };
}

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface GetCommentsResponse {
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
}

// Interaction Counts
export interface InteractionCounts {
  views: number;
  likes: number;
  shares: number;
  bookmarks: number;
  comments: number;
}

export interface UserInteractions {
  liked: boolean;
  bookmarked: boolean;
}

export interface GetInteractionCountsResponse {
  success: boolean;
  message: string;
  data: {
    counts: InteractionCounts;
    user_interactions: UserInteractions;
  };
}

// User Interactions
export interface UserInteractionItem {
  id: number;
  article_id: number;
  interaction_type: InteractionType;
  created_at: string;
  article?: {
    id: number;
    title: string;
    slug: string;
    image_url: string;
    published_at: string;
  };
}

export interface GetUserInteractionsResponse {
  success: boolean;
  message: string;
  data: {
    data: UserInteractionItem[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

/* -------------------------------------------------------------------------- */
/*                               ERROR TYPES                                  */
/* -------------------------------------------------------------------------- */

export interface InteractionErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}