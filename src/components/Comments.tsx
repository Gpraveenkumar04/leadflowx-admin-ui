import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { t } from '../i18n';
import { 
  PaperAirplaneIcon, 
  UserCircleIcon,
  AtSymbolIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { User } from '../types';
import clsx from 'clsx';

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: string;
  mentions?: string[];
}

interface CommentsProps {
  entityId: string | number;
  entityType: 'lead' | 'job' | 'task';
  comments: Comment[];
  onAddComment: (text: string, mentions: string[]) => void;
  onDeleteComment?: (commentId: string) => void;
  availableUsers?: User[];
  loading?: boolean;
}

const Comments: React.FC<CommentsProps> = ({
  entityId,
  entityType,
  comments,
  onAddComment,
  onDeleteComment,
  availableUsers = [],
  loading = false
}) => {
  const [newComment, setNewComment] = useState('');
  const [showMentionsDropdown, setShowMentionsDropdown] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Handle @ mentions
  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatRelativeTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  }, []);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const cursorPos = e.currentTarget.selectionStart || 0;
    setCursorPosition(cursorPos);
    
    const textBeforeCursor = newComment.slice(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1 && !textBeforeCursor.slice(lastAtSymbol + 1).includes(' ')) {
      setShowMentionsDropdown(true);
      setMentionFilter(textBeforeCursor.slice(lastAtSymbol + 1));
    } else {
      setShowMentionsDropdown(false);
    }
  }, [newComment]);

  const insertMention = useCallback((user: User) => {
    const beforeMention = newComment.slice(0, cursorPosition - mentionFilter.length - 1);
    const afterMention = newComment.slice(cursorPosition);
    const mentionText = `@${user.name} `;
    
    setNewComment(`${beforeMention}${mentionText}${afterMention}`);
    setMentions(prev => [...prev, user.id]);
    setShowMentionsDropdown(false);
    
    // Set focus back to textarea and position cursor
    if (textareaRef.current) {
      const newCursorPos = beforeMention.length + mentionText.length;
      textareaRef.current.focus();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newCursorPos;
          textareaRef.current.selectionEnd = newCursorPos;
        }
      }, 0);
    }
  }, [newComment, cursorPosition, mentionFilter]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (newComment.trim()) {
      onAddComment(newComment, mentions);
      setNewComment('');
      setMentions([]);
    }
  }, [newComment, mentions, onAddComment]);

  // Memoize filtered users for mentions dropdown
  const filteredUsers = useMemo(() => {
    if (!showMentionsDropdown) return [];
    return availableUsers.filter(user => 
      user.name.toLowerCase().includes(mentionFilter.toLowerCase())
    );
  }, [availableUsers, showMentionsDropdown, mentionFilter]);

  // Handle adding @ symbol
  const handleAddMention = useCallback(() => {
    if (textareaRef.current) {
      const pos = textareaRef.current.selectionStart || textareaRef.current.value.length;
      const textBefore = newComment.substring(0, pos);
      const textAfter = newComment.substring(pos);
      setNewComment(`${textBefore}@${textAfter}`);
      textareaRef.current.focus();
      setCursorPosition(pos + 1);
      setShowMentionsDropdown(true);
      setMentionFilter('');
    }
  }, [newComment]);

  return (
    <section 
      className="space-y-4 rounded-lg" 
      aria-labelledby="comments-heading"
    >
      <h3 id="comments-heading" className="text-lg font-medium text-gray-900 flex items-center">
        Comments
        {loading && (
          <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" 
                aria-hidden="true" />
        )}
      </h3>
      
      {/* Comment list */}
      <div 
        className="space-y-3 max-h-80 overflow-y-auto rounded-lg"
        role="log"
        aria-live="polite"
        aria-label="Comments list"
      >
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <span className="sr-only">{t('comments.loading')}</span>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-gray-500 border-r-transparent" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 p-3">{t('comments.empty')}</p>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className="flex space-x-3 p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              role="article"
            >
              <div className="flex-shrink-0">
                {comment.userAvatar ? (
                  <img
                    src={comment.userAvatar}
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
                  <h4 className="text-sm font-medium text-gray-900">{comment.userName}</h4>
                  <div className="flex items-center space-x-2">
                    <time 
                      dateTime={comment.timestamp} 
                      className="text-xs text-gray-500 flex items-center"
                      title={new Date(comment.timestamp).toLocaleString()}
                    >
                      <ClockIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      <span>{formatRelativeTime(comment.timestamp)}</span>
                    </time>
                    {onDeleteComment && (
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-1"
                        aria-label={t('comments.delete_by', { user: comment.userName })}
                        title={t('comments.delete')}
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 break-words">
                  {comment.text.split(' ').map((word, i) => {
                    if (word.startsWith('@')) {
                      return (
                        <span key={i} className="text-blue-600 font-medium">
                          {word}{' '}
                        </span>
                      );
                    }
                    return word + ' ';
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* New comment form */}
      <form 
        onSubmit={handleSubmit} 
        className="mt-4"
        aria-label="Add comment"
      >
        <div className="relative">
          <label htmlFor="comment-text" className="sr-only">{t('comments.add_label')}</label>
          <textarea
            id="comment-text"
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyUp={handleKeyUp}
            className={clsx(
              "input w-full min-h-[80px] transition-shadow",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            )}
            placeholder={t('comments.placeholder')}
            aria-describedby="comment-instructions"
            disabled={loading}
          />
          <span id="comment-instructions" className="sr-only">
            {t('comments.instructions')}
          </span>
          
          {/* Mentions dropdown */}
          {showMentionsDropdown && availableUsers.length > 0 && (
            <div 
              className="absolute left-0 mt-1 w-full sm:w-64 max-h-48 overflow-y-auto bg-white rounded-md shadow-lg z-10 border border-gray-200"
              role="listbox"
              aria-label="User mentions"
            >
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-blue-50 focus:outline-none flex items-center"
                  onClick={() => insertMention(user)}
                  role="option"
                  aria-selected="false"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="" 
                      aria-hidden="true"
                      className="h-5 w-5 rounded-full mr-2" 
                    />
                  ) : (
                    <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                  )}
                  <span className="text-sm">{user.name}</span>
                  <span className="text-xs text-gray-500 ml-1">({user.role})</span>
                </button>
              ))}
              {filteredUsers.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">{t('user.search.no_results')}</div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-2">
            <button
            type="button"
            className="btn btn-sm btn-secondary flex items-center w-full sm:w-auto justify-center"
            onClick={handleAddMention}
            disabled={loading}
            aria-label="Mention a team member"
          >
            <AtSymbolIcon className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>{t('comments.mention')}</span>
          </button>
            <button
            type="submit"
            className={clsx(
              "btn btn-sm btn-primary flex items-center w-full sm:w-auto justify-center",
              "transition-all duration-150 ease-in-out",
              "focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            )}
            disabled={!newComment.trim() || loading}
            aria-label="Send comment"
          >
            <PaperAirplaneIcon className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>{t('comments.send')}</span>
          </button>
        </div>
      </form>
    </section>
  );
};

export default Comments;
