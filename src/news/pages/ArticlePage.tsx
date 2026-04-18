// src/pages/ArticlePage.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Bookmark,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  Home,
  Loader2,
  LogIn,
  MessageCircle,
  MessageSquare,
  Pencil,
  Send,
  Share2,
  Tag,
  Trash2,
  User,
} from 'lucide-react';

import { getArticleBySlug, getRelatedArticles } from '../data/dataService';
import { selectRandomAd } from '../utils/randomAdSelector';
import { formatFullDate, formatRelativeDate } from '../utils/formatDate';
import { paginate } from '../utils/paginationHelpers';
import { ROUTES } from '../routes/routes';
import { saveRedirectPath } from '../api/auth/AuthQueries';

import RelatedArticles from '../components/RelatedArticles';
import AdBanner from '../components/AdBanner';
import Pagination from '../components/Pagination';
import { ArticlePageSkeleton } from '../components/LoadingSkeletons';

import { useSubscribe } from '../api/newsletter/NewsletterQueries';
import {
  useAddComment,
  useDeleteComment,
  useGetComments,
  useGetInteractionCounts,
  useRecordShare,
  useRecordView,
  useToggleBookmark,
  useToggleLike,
  useUpdateComment,
} from '../api/article-interraction/ArticleInteractionQueries';

import type {
  Comment as ArticleComment,
  InteractionCounts,
  UserInteractions,
} from '../api/article-interraction/ArticleInteractionTypes';
import type { Ad } from '../types';
import type { Article as ApiArticle } from '../api/NewsTypes';

import { useAppSelector } from '../../shared/hooks/useRedux';
import {
  selectIsAuthenticated,
  selectUser,
} from '../../features/authentication/store/slices/authSlice';

type ArticleRecord = {
  id: number;
  slug: string;
  title: string;
  summary?: string;
  content?: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  imageUrl?: string;
  tags?: string[];
};

// Helper function to convert API Article to ArticleRecord
const convertToArticleRecord = (apiArticle: ApiArticle): ArticleRecord => ({
  id: Number(apiArticle.id), // Convert string to number
  slug: apiArticle.slug,
  title: apiArticle.title,
  summary: apiArticle.summary,
  content: apiArticle.content,
  category: apiArticle.category,
  author: apiArticle.author || 'Unknown',
  publishedAt: apiArticle.publishedAt,
  readTime: apiArticle.readTime || Math.ceil((apiArticle.content?.length || 0) / 1000),
  imageUrl: apiArticle.imageUrl,
  tags: apiArticle.tags ? (Array.isArray(apiArticle.tags) ? apiArticle.tags : JSON.parse(apiArticle.tags)) : [],
});

const EMPTY_COUNTS: InteractionCounts = {
  views: 0,
  likes: 0,
  shares: 0,
  bookmarks: 0,
  comments: 0,
};

const EMPTY_USER_INTERACTIONS: UserInteractions = {
  liked: false,
  bookmarked: false,
};

const loginPath = ROUTES.LOGIN;

/* -------------------------------------------------------------------------- */
/*                               SKELETONS                                    */
/* -------------------------------------------------------------------------- */

const InteractionBarSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200" />
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
      ))}
    </div>
  </div>
);

const CommentsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               COMMENT CARD                                 */
/* -------------------------------------------------------------------------- */

interface CommentCardProps {
  comment: ArticleComment;
  currentUser: { id: number; name: string; email: string } | null;
  isAuthenticated: boolean;
  replyingToId: number | null;
  setReplyingToId: (id: number | null) => void;
  replyDraft: string;
  setReplyDraft: (text: string) => void;
  editingCommentId: number | null;
  setEditingCommentId: (id: number | null) => void;
  editDraft: string;
  setEditDraft: (text: string) => void;
  onReplySubmit: (parentId: number) => void;
  onEditSubmit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  isSubmitting: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  onCancelEdit: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  currentUser,
  isAuthenticated,
  replyingToId,
  setReplyingToId,
  replyDraft,
  setReplyDraft,
  editingCommentId,
  setEditingCommentId,
  editDraft,
  setEditDraft,
  onReplySubmit,
  onEditSubmit,
  onDelete,
  isSubmitting,
  isEditing,
  isDeleting,
  onCancelEdit,
}) => {
  const isOwner = currentUser?.id === comment.user.id;
  const isReplying = replyingToId === comment.id;
  const isEditingThis = editingCommentId === comment.id;

  const getUserDisplayName = () => {
    if (comment.user.name && comment.user.name !== 'Anonymous') {
      return comment.user.name;
    }
    if (comment.user.email) {
      return comment.user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <span className="text-sm font-semibold">{getUserInitial()}</span>
        </div>

        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-semibold text-gray-900">{getUserDisplayName()}</p>
            <p className="text-xs text-gray-500">
              {formatRelativeDate(comment.created_at)}
            </p>
            {comment.is_edited && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                edited
              </span>
            )}
          </div>

          {/* Content or Edit Form */}
          {isEditingThis ? (
            <div className="space-y-3">
              <textarea
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Edit your comment..."
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onEditSubmit(comment.id)}
                  disabled={isEditing || !editDraft.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isEditing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Save
                </button>
                <button
                  onClick={onCancelEdit}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
              {comment.content}
            </p>
          )}

          {/* Action Buttons */}
          {!isEditingThis && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {isAuthenticated && (
                <button
                  onClick={() => setReplyingToId(isReplying ? null : comment.id)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Reply
                </button>
              )}

              {isOwner && (
                <>
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditDraft(comment.content);
                    }}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-800"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4 rounded-xl bg-gray-50 p-3">
              <textarea
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder={`Reply to ${getUserDisplayName()}...`}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => onReplySubmit(comment.id)}
                  disabled={isSubmitting || !replyDraft.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Post reply
                </button>
                <button
                  onClick={() => {
                    setReplyingToId(null);
                    setReplyDraft('');
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-5 space-y-3 border-l-2 border-gray-100 pl-4">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  isAuthenticated={isAuthenticated}
                  replyingToId={replyingToId}
                  setReplyingToId={setReplyingToId}
                  replyDraft={replyDraft}
                  setReplyDraft={setReplyDraft}
                  editingCommentId={editingCommentId}
                  setEditingCommentId={setEditingCommentId}
                  editDraft={editDraft}
                  setEditDraft={setEditDraft}
                  onReplySubmit={onReplySubmit}
                  onEditSubmit={onEditSubmit}
                  onDelete={onDelete}
                  isSubmitting={isSubmitting}
                  isEditing={isEditing}
                  isDeleting={isDeleting}
                  onCancelEdit={onCancelEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               INTERACTIONS PANEL                           */
/* -------------------------------------------------------------------------- */

interface ArticleInteractionsPanelProps {
  articleId: number;
  articleTitle: string;
  articleSummary?: string;
}

const ArticleInteractionsPanel: React.FC<ArticleInteractionsPanelProps> = ({
  articleId,
  articleTitle,
  articleSummary,
}) => {
  const currentUser = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [commentDraft, setCommentDraft] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [commentsPage, setCommentsPage] = useState(1);
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const {
    data: interactionData,
    isLoading: countsLoading,
    refetch: refetchCounts,
  } = useGetInteractionCounts(articleId, { enabled: !!articleId });

  const {
    data: commentsData,
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useGetComments(articleId, commentsPage, 10, { enabled: !!articleId });

  const { mutate: toggleLike, isPending: likePending } = useToggleLike({
    onSuccess: () => refetchCounts(),
    onError: () => setNotice({ message: 'Unable to update like.', type: 'error' }),
  });

  const { mutate: toggleBookmark, isPending: bookmarkPending } = useToggleBookmark({
    onSuccess: () => refetchCounts(),
    onError: () => setNotice({ message: 'Unable to update bookmark.', type: 'error' }),
  });

  const { mutate: recordShare, isPending: sharePending } = useRecordShare({
    onError: () => setNotice({ message: 'Share recorded but interaction failed.', type: 'error' }),
  });

  const { mutate: addComment, isPending: addCommentPending } = useAddComment({
    onSuccess: () => {
      setCommentDraft('');
      setReplyDraft('');
      setReplyingToId(null);
      refetchComments();
      refetchCounts();
      setNotice({ message: 'Comment posted successfully!', type: 'success' });
      setTimeout(() => setNotice(null), 3000);
    },
    onError: () => setNotice({ message: 'Unable to post comment.', type: 'error' }),
  });

  const { mutate: updateComment, isPending: updateCommentPending } = useUpdateComment({
    onSuccess: () => {
      setEditingCommentId(null);
      setEditDraft('');
      refetchComments();
      setNotice({ message: 'Comment updated.', type: 'success' });
      setTimeout(() => setNotice(null), 3000);
    },
    onError: () => setNotice({ message: 'Unable to update comment.', type: 'error' }),
  });

  const { mutate: deleteComment, isPending: deleteCommentPending } = useDeleteComment({
    onSuccess: () => {
      refetchComments();
      refetchCounts();
      setNotice({ message: 'Comment deleted.', type: 'success' });
      setTimeout(() => setNotice(null), 3000);
    },
    onError: () => setNotice({ message: 'Unable to delete comment.', type: 'error' }),
  });

  const counts = interactionData?.counts ?? EMPTY_COUNTS;
  const userInteractions = interactionData?.user_interactions ?? EMPTY_USER_INTERACTIONS;

  // Sort comments: latest first
  const sortedComments = useMemo(() => {
    if (!commentsData?.comments) return [];
    return [...commentsData.comments].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [commentsData?.comments]);

  const pagination = commentsData?.pagination;

  const requireAuth = (actionLabel: string): boolean => {
    if (isAuthenticated) return false;
    setNotice({ message: `Please sign in to ${actionLabel}.`, type: 'error' });
    return true;
  };

  const handleLike = () => {
    if (requireAuth('like articles')) return;
    toggleLike({ articleId });
  };

  const handleBookmark = () => {
    if (requireAuth('bookmark articles')) return;
    toggleBookmark({ articleId });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: articleTitle, text: articleSummary || articleTitle, url });
        recordShare({ articleId, data: { platform: 'native-share' } });
      } else {
        await navigator.clipboard.writeText(url);
        recordShare({ articleId, data: { platform: 'clipboard' } });
        setNotice({ message: 'Link copied to clipboard!', type: 'success' });
        setTimeout(() => setNotice(null), 3000);
      }
    } catch {
      setNotice({ message: 'Share cancelled or unavailable.', type: 'error' });
    }
  };

  const handleCommentSubmit = () => {
    if (requireAuth('join the discussion')) return;
    if (!commentDraft.trim()) return;
    addComment({ articleId, data: { comment: commentDraft.trim() } });
  };

  const handleReplySubmit = (parentId: number) => {
    if (!replyDraft.trim()) return;
    addComment({ articleId, data: { comment: replyDraft.trim(), parent_comment_id: parentId } });
  };

  const handleEditSubmit = (commentId: number) => {
    if (!editDraft.trim()) return;
    updateComment({ articleId, commentId, data: { comment: editDraft.trim() } });
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment({ articleId, commentId });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditDraft('');
  };

  if (countsLoading) {
    return (
      <div className="space-y-6">
        <InteractionBarSkeleton />
        <CommentsSkeleton />
      </div>
    );
  }

  // Prepare current user for CommentCard
  const currentUserForComment = currentUser ? {
    id: currentUser.id,
    name: currentUser.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() : currentUser.name,
    email: currentUser.email,
  } : null;

  return (
    <section className="space-y-6">
      {/* Interaction Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Article Interactions</h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700">
            <Eye className="h-4 w-4" />
            Views
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">{counts.views}</span>
          </button>

          <button
            onClick={handleLike}
            disabled={likePending}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              userInteractions.liked
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {likePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${userInteractions.liked ? 'fill-current' : ''}`} />}
            Likes
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">{counts.likes}</span>
          </button>

          <button
            onClick={handleShare}
            disabled={sharePending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sharePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
            Shares
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">{counts.shares}</span>
          </button>

          <button
            onClick={handleBookmark}
            disabled={bookmarkPending}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              userInteractions.bookmarked
                ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {bookmarkPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className={`h-4 w-4 ${userInteractions.bookmarked ? 'fill-current' : ''}`} />}
            Bookmarks
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">{counts.bookmarks}</span>
          </button>
        </div>

        {!isAuthenticated && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-blue-900">Sign in for likes, bookmarks, and comments</p>
                <p className="text-sm text-blue-700">Anonymous users can still view and share articles.</p>
              </div>
              <Link to={loginPath} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          </div>
        )}

        {notice && (
          <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${notice.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {notice.message}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Comments ({counts.comments})</h3>
        </div>

        {/* Add Comment Form */}
        <div className="mb-6 rounded-2xl bg-gray-50 p-4">
          <textarea
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            disabled={!isAuthenticated || addCommentPending}
            rows={4}
            placeholder={isAuthenticated ? 'Write a thoughtful comment...' : 'Sign in to join the discussion'}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500">Keep it respectful and relevant to the article.</p>
            <button
              disabled={!isAuthenticated || addCommentPending || !commentDraft.trim()}
              onClick={handleCommentSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addCommentPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Post comment
            </button>
          </div>
        </div>

        {/* Comments List */}
        {commentsLoading ? (
          <CommentsSkeleton />
        ) : sortedComments.length > 0 ? (
          <div className="space-y-4">
            {sortedComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                currentUser={currentUserForComment}
                isAuthenticated={isAuthenticated}
                replyingToId={replyingToId}
                setReplyingToId={setReplyingToId}
                replyDraft={replyDraft}
                setReplyDraft={setReplyDraft}
                editingCommentId={editingCommentId}
                setEditingCommentId={setEditingCommentId}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                onReplySubmit={handleReplySubmit}
                onEditSubmit={handleEditSubmit}
                onDelete={handleDeleteComment}
                isSubmitting={addCommentPending}
                isEditing={updateCommentPending}
                isDeleting={deleteCommentPending}
                onCancelEdit={handleCancelEdit}
              />
            ))}

            {pagination && pagination.last_page > 1 && (
              <div className="pt-4">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_page}
                  onPageChange={setCommentsPage}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <MessageSquare className="mx-auto mb-3 h-8 w-8 text-gray-400" />
            <h4 className="font-medium text-gray-900">No comments yet</h4>
            <p className="mt-1 text-sm text-gray-600">Be the first to start the conversation.</p>
          </div>
        )}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentUser = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterIsError, setNewsletterIsError] = useState(false);

  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [bottomAd, setBottomAd] = useState<Ad | null>(null);

  const [relatedPage, setRelatedPage] = useState(parseInt(searchParams.get('relatedPage') || '1', 10));
  const [relatedItemsPerPage, setRelatedItemsPerPage] = useState(parseInt(searchParams.get('relatedPerPage') || '2', 10));

  const [article, setArticle] = useState<ArticleRecord | null>(null);
  const [allRelatedArticles, setAllRelatedArticles] = useState<any[]>([]);
  const [articleLoading, setArticleLoading] = useState(true);
  const [articleError, setArticleError] = useState<string | null>(null);

  const viewTrackedForArticleId = useRef<number | null>(null);

  const { mutate: recordView } = useRecordView();
  const { mutate: subscribe, isPending: newsletterLoading } = useSubscribe({
    onSuccess: (data) => {
      setNewsletterMessage(data.message);
      setNewsletterIsError(false);
      setTimeout(() => setNewsletterMessage(''), 3000);
    },
    onError: (error: any) => {
      setNewsletterMessage(error?.response?.data?.message || 'Subscription failed');
      setNewsletterIsError(true);
      setTimeout(() => setNewsletterMessage(''), 3000);
    },
  });

  useEffect(() => {
    if (isAuthenticated && currentUser?.email) {
      setNewsletterEmail(currentUser.email);
    }
  }, [isAuthenticated, currentUser]);

  // Handle redirect when user needs to login
  const handleRequireAuth = () => {
    // Save current path before redirecting to login
    saveRedirectPath(window.location.pathname + window.location.search);
    navigate(loginPath);
  };

  // Load article
  useEffect(() => {
    let cancelled = false;

    const loadArticle = async () => {
      if (!articleSlug) {
        setArticleError('Article slug is required');
        setArticleLoading(false);
        return;
      }

      try {
        setArticleLoading(true);
        setArticleError(null);

        const articleData = await getArticleBySlug(articleSlug);
        if (cancelled) return;

        if (!articleData) {
          setArticleError('Article not found');
          return;
        }

        // Use the converter function to properly type the data
        const normalizedArticle = convertToArticleRecord(articleData);
        setArticle(normalizedArticle);

        setSidebarAd(selectRandomAd(normalizedArticle.category, 'sidebar'));
        setBottomAd(selectRandomAd(normalizedArticle.category, 'bottom'));
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load article:', error);
          setArticleError('Failed to load article content');
        }
      } finally {
        if (!cancelled) setArticleLoading(false);
      }
    };

    loadArticle();
    return () => { cancelled = true; };
  }, [articleSlug]);

  // Load related articles - FIXED: Convert article to proper type for getRelatedArticles
  useEffect(() => {
    let cancelled = false;

    const loadRelated = async () => {
      if (!article) return;
      try {
        // Convert ArticleRecord to the format expected by getRelatedArticles
        const articleForRelated = {
          ...article,
          id: String(article.id), // Convert id to string for the API
        };
        const related = await getRelatedArticles(articleForRelated as any, 12);
        if (!cancelled) setAllRelatedArticles(related || []);
      } catch (error) {
        if (!cancelled) console.error('Failed to load related articles:', error);
      }
    };

    loadRelated();
    return () => { cancelled = true; };
  }, [article]);

  // Record view
  useEffect(() => {
    if (!article?.id) return;
    if (viewTrackedForArticleId.current === article.id) return;

    viewTrackedForArticleId.current = article.id;
    recordView({ articleId: article.id, data: { referrer: document.referrer || undefined } });
  }, [article?.id, recordView]);

  // Reset scroll and pagination on article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRelatedPage(1);
  }, [articleSlug]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (relatedPage > 1) params.set('relatedPage', relatedPage.toString());
    else params.delete('relatedPage');

    if (relatedItemsPerPage !== 2) params.set('relatedPerPage', relatedItemsPerPage.toString());
    else params.delete('relatedPerPage');

    setSearchParams(params, { replace: true });
  }, [relatedPage, relatedItemsPerPage, searchParams, setSearchParams]);

  const paginatedRelatedArticles = useMemo(() => {
    return paginate(allRelatedArticles, relatedPage, relatedItemsPerPage);
  }, [allRelatedArticles, relatedPage, relatedItemsPerPage]);

  const handleRetry = () => window.location.reload();
  const handleRelatedPageChange = (page: number) => {
    setRelatedPage(page);
    document.getElementById('related-articles-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const handleRelatedItemsPerPageChange = (newItemsPerPage: number) => {
    setRelatedItemsPerPage(newItemsPerPage);
    setRelatedPage(1);
  };
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    subscribe({ email: newsletterEmail.trim() });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      world: 'bg-red-100 text-red-800',
      business: 'bg-green-100 text-green-800',
      technology: 'bg-blue-100 text-blue-800',
      sports: 'bg-orange-100 text-orange-800',
      health: 'bg-purple-100 text-purple-800',
      science: 'bg-indigo-100 text-indigo-800',
      entertainment: 'bg-pink-100 text-pink-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.general;
  };

  if (articleLoading) return <ArticlePageSkeleton />;
  if (articleError || !article) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 mb-4 text-3xl font-bold text-gray-900">Article Not Found</h1>
          <p className="mb-8 text-gray-600">{articleError || 'The requested article does not exist.'}</p>
          <div className="space-x-4">
            <button onClick={handleRetry} className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Try Again</button>
            <Link to={ROUTES.HOME} className="cursor-pointer px-4 py-2 font-medium text-blue-600 hover:text-blue-700">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const contentParagraphs = article.content ? article.content.split('\n\n') : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
        <article className="lg:col-span-3">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <li><Link to={ROUTES.HOME} className="flex items-center hover:text-blue-600"><Home className="mr-1 h-4 w-4" />Home</Link></li>
              <ChevronRight className="h-4 w-4" />
              <li><Link to={ROUTES.buildCategoryRoute(article.category)} className="capitalize hover:text-blue-600">{article.category}</Link></li>
              <ChevronRight className="h-4 w-4" />
              <li className="max-w-md truncate text-gray-700">{article.title}</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
            </div>
            <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">{article.title}</h1>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{article.author}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatFullDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8">
              <img src={article.imageUrl} alt={article.title} className="h-64 w-full rounded-lg object-cover shadow-lg md:h-96" onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg';
              }} />
            </div>
          )}

          {/* Mobile Ad */}
          {sidebarAd && (
            <div className="mb-8 lg:hidden">
              <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 p-2 shadow-sm">
                <AdBanner ad={sidebarAd} placement="inline" className="w-full" />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg mb-10 max-w-none">
            {contentParagraphs.length > 0 ? contentParagraphs.map((p, i) => <p key={i} className="mb-6 text-lg leading-relaxed text-gray-800">{p}</p>) : (
              <p className="mb-6 text-lg leading-relaxed text-gray-800">{article.content || article.summary || 'No content available.'}</p>
            )}
          </div>

          {/* Interactions Panel */}
          <div className="mb-12">
            <ArticleInteractionsPanel articleId={article.id} articleTitle={article.title} articleSummary={article.summary} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"><Tag className="h-5 w-5" />Tags</h3>
              <div className="flex flex-wrap gap-2">{article.tags.map(tag => <span key={tag} className="inline-flex cursor-pointer items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200">#{tag}</span>)}</div>
            </div>
          )}

          {/* Bottom Ad */}
          {bottomAd && (
            <div className="mb-12">
              <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 p-2 shadow-sm">
                <AdBanner ad={bottomAd} placement="bottom" className="w-full" />
              </div>
            </div>
          )}

          {/* Related Articles */}
          <div id="related-articles-section" className="mb-12 scroll-mt-24">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
              {allRelatedArticles.length > 2 && (
                <div className="flex items-center space-x-3">
                  <label className="whitespace-nowrap text-sm font-medium text-gray-700">Show:</label>
                  <select value={relatedItemsPerPage} onChange={(e) => handleRelatedItemsPerPageChange(Number(e.target.value))} className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="2">2 articles</option>
                    <option value="4">4 articles</option>
                    <option value="6">6 articles</option>
                    <option value="12">12 articles</option>
                  </select>
                </div>
              )}
            </div>

            {allRelatedArticles.length > 0 ? (
              <>
                {allRelatedArticles.length > relatedItemsPerPage && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Showing {Math.min((relatedPage - 1) * relatedItemsPerPage + 1, allRelatedArticles.length)}-
                      {Math.min(relatedPage * relatedItemsPerPage, allRelatedArticles.length)} of <span className="font-semibold">{allRelatedArticles.length}</span> related articles
                    </p>
                  </div>
                )}
                <RelatedArticles articles={paginatedRelatedArticles.items} title="" className="" />
                {paginatedRelatedArticles.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={paginatedRelatedArticles.currentPage} totalPages={paginatedRelatedArticles.totalPages} onPageChange={handleRelatedPageChange} />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600">No related articles available right now.</div>
            )}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 lg:space-y-8">
            {sidebarAd && (
              <div className="hidden lg:block">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 shadow-sm">
                  <AdBanner ad={sidebarAd} placement="sidebar" className="w-full" />
                </div>
              </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Article Info</h3>
              <dl className="space-y-3">
                <div><dt className="text-sm font-medium text-gray-500">Category</dt><dd className="mt-1 text-sm capitalize"><Link to={ROUTES.buildCategoryRoute(article.category)} className="text-blue-600 hover:underline">{article.category}</Link></dd></div>
                <div><dt className="text-sm font-medium text-gray-500">Published</dt><dd className="mt-1 text-sm text-gray-900">{formatFullDate(article.publishedAt)}</dd></div>
                <div><dt className="text-sm font-medium text-gray-500">Read Time</dt><dd className="mt-1 text-sm text-gray-900">{article.readTime} minutes</dd></div>
                <div><dt className="text-sm font-medium text-gray-500">Author</dt><dd className="mt-1 text-sm text-gray-900">{article.author}</dd></div>
              </dl>
            </div>

            <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Stay Updated</h3>
              <p className="mb-4 text-sm text-gray-600">Get the latest {article.category} articles delivered to your inbox.</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Your email address" className="w-full cursor-text rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <button type="submit" disabled={newsletterLoading} className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {newsletterMessage && <p className={`mt-3 text-center text-xs ${newsletterIsError ? 'text-red-600' : 'text-green-600'}`}>{newsletterMessage}</p>}
              {isAuthenticated && currentUser?.email && <p className="mt-3 text-xs text-gray-500">Signed in as <span className="font-medium">{currentUser.email}</span></p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticlePage;