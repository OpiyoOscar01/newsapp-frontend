import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Eye,
  Heart,
  Loader2,
  LogIn,
  MessageSquare,
  Send,
  Share2,
} from 'lucide-react';

import Pagination from '../../components/Pagination';
import { ROUTES } from '../../routes/routes';

import {
  useAddComment,
  useDeleteComment,
  useGetComments,
  useGetInteractionCounts,
  useRecordShare,
  useToggleBookmark,
  useToggleLike,
  useUpdateComment,
} from '../../api/article-interraction/ArticleInteractionQueries';

import { useAppSelector } from '../../../shared/hooks/useRedux';
import {
  selectIsAdmin,
  selectIsAuthenticated,
  selectUser,
} from '../../../features/authentication/store/slices/authSlice';

import CommentCard from './CommentCard';
import {
  EMPTY_COUNTS,
  EMPTY_USER_INTERACTIONS,
} from './ArticlePage.shared';

interface ArticleInteractionsPanelProps {
  articleId: number;
  articleTitle: string;
  articleSummary?: string;
}

const loginPath = ROUTES.LOGIN;

const InteractionBarSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200" />
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-xl bg-gray-100" />
      ))}
    </div>
  </div>
);

const CommentsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4">
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

const ArticleInteractionsPanel: React.FC<ArticleInteractionsPanelProps> = ({
  articleId,
  articleTitle,
  articleSummary,
}) => {
  const currentUser = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);

  const [commentDraft, setCommentDraft] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [commentsPage, setCommentsPage] = useState(1);
  const [notice, setNotice] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

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
    onSuccess: () => refetchCounts(),
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

  const sortedComments = useMemo(() => {
    if (!commentsData?.comments) return [];

    return [...commentsData.comments].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
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
        await navigator.share({
          title: articleTitle,
          text: articleSummary || articleTitle,
          url,
        });
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

    addComment({
      articleId,
      data: { comment: commentDraft.trim() },
    });
  };

  const handleReplySubmit = (parentId: number) => {
    if (!replyDraft.trim()) return;

    addComment({
      articleId,
      data: {
        comment: replyDraft.trim(),
        parent_comment_id: parentId,
      },
    });
  };

  const handleEditSubmit = (commentId: number) => {
    if (!editDraft.trim()) return;

    updateComment({
      articleId,
      commentId,
      data: { comment: editDraft.trim() },
    });
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

  const currentUserForComment = currentUser
    ? {
        id: currentUser.id,
        name: currentUser.first_name
          ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim()
          : currentUser.name,
        email: currentUser.email,
      }
    : null;

  if (countsLoading) {
    return (
      <div className="space-y-6">
        <InteractionBarSkeleton />
        <CommentsSkeleton />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Article Interactions</h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700">
            <Eye className="h-4 w-4" />
            Views
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">
              {counts.views}
            </span>
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
            {likePending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 ${userInteractions.liked ? 'fill-current' : ''}`} />
            )}
            Likes
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">
              {counts.likes}
            </span>
          </button>

          <button
            onClick={handleShare}
            disabled={sharePending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sharePending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            Shares
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">
              {counts.shares}
            </span>
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
            {bookmarkPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bookmark
                className={`h-4 w-4 ${userInteractions.bookmarked ? 'fill-current' : ''}`}
              />
            )}
            Bookmarks
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">
              {counts.bookmarks}
            </span>
          </button>
        </div>

        {!isAuthenticated && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-blue-900">
                  Sign in for likes, bookmarks, and comments
                </p>
                <p className="text-sm text-blue-700">
                  Anonymous users can still view and share articles.
                </p>
              </div>

              <Link
                to={loginPath}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          </div>
        )}

        {notice && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              notice.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {notice.message}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Comments ({counts.comments})
          </h3>
        </div>

        <div className="mb-6 rounded-2xl bg-gray-50 p-4">
          <textarea
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            disabled={!isAuthenticated || addCommentPending}
            rows={4}
            placeholder={
              isAuthenticated
                ? 'Write a thoughtful comment...'
                : 'Sign in to join the discussion'
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Keep it respectful and relevant to the article.
            </p>

            <button
              disabled={!isAuthenticated || addCommentPending || !commentDraft.trim()}
              onClick={handleCommentSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addCommentPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Post comment
            </button>
          </div>
        </div>

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
                isAdmin={isAdmin}
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
            <p className="mt-1 text-sm text-gray-600">
              Be the first to start the conversation.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleInteractionsPanel;
