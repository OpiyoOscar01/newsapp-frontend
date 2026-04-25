import React from 'react';
import {
  Loader2,
  MessageCircle,
  Pencil,
  Send,
  Trash2,
} from 'lucide-react';

import { formatRelativeDate } from '../../utils/formatDate';
import type { Comment as ArticleComment } from '../../api/article-interraction/ArticleInteractionTypes';

import type { CommentCurrentUser } from './ArticlePage.shared';

interface CommentCardProps {
  comment: ArticleComment;
  currentUser: CommentCurrentUser;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
  isAdmin,
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
  const canDelete = isOwner || isAdmin;
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

  const getUserInitial = () => getUserDisplayName().charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <span className="text-sm font-semibold">{getUserInitial()}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-semibold text-gray-900">{getUserDisplayName()}</p>
            <p className="text-xs text-gray-500">{formatRelativeDate(comment.created_at)}</p>

            {comment.is_edited && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                edited
              </span>
            )}
          </div>

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
                  {isEditing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
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
              )}

              {canDelete && (
                <button
                  onClick={() => onDelete(comment.id)}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </button>
              )}
            </div>
          )}

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
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
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

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-5 space-y-3 border-l-2 border-gray-100 pl-4">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
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

export default CommentCard;
