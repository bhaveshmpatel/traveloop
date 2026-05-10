"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Send,
  Plus,
  X,
  ArrowUpDown,
  Image as ImageIcon,
  Link2,
  Loader2,
  Users,
} from "lucide-react";

interface PostComment {
  id: string;
  content: string;
  createdAt: string;
  user: { firstName: string; lastName: string };
}

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  likes: number;
  createdAt: string;
  user: { firstName: string; lastName: string };
  trip: { name: string } | null;
  comments: PostComment[];
  _count: { comments: number };
}

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "likes", label: "Most Liked" },
  { value: "comments", label: "Most Commented" },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [showCreate, setShowCreate] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // Create post
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [posting, setPosting] = useState(false);

  // Comment
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [commentingOn, setCommentingOn] = useState<string | null>(null);

  const fetchPosts = () => {
    setLoading(true);
    fetch(`/api/community?sortBy=${sortBy}`)
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, [sortBy]);

  const handleCreatePost = async () => {
    if (!newTitle || !newContent) return;
    setPosting(true);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });
    if (res.ok) {
      setNewTitle("");
      setNewContent("");
      setShowCreate(false);
      fetchPosts();
    }
    setPosting(false);
  };

  const handleLike = async (postId: string) => {
    await fetch(`/api/community/${postId}/like`, { method: "POST" });
    setPosts(posts.map((p) => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleComment = async (postId: string) => {
    const text = commentText[postId];
    if (!text) return;
    setCommentingOn(postId);
    const res = await fetch(`/api/community/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    if (res.ok) {
      const data = await res.json();
      setPosts(posts.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, data.comment], _count: { comments: p._count.comments + 1 } }
          : p
      ));
      setCommentText({ ...commentText, [postId]: "" });
    }
    setCommentingOn(null);
  };

  const toggleComments = (postId: string) => {
    const next = new Set(expandedComments);
    if (next.has(postId)) next.delete(postId);
    else next.add(postId);
    setExpandedComments(next);
  };

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">Community 🌐</h1>
        <p className="mt-2 text-text-secondary">Share your travel experiences and discover others&apos;</p>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-text-muted" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer">
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-all text-sm">
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreate ? "Cancel" : "New Post"}
        </button>
      </div>

      {/* Create post form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden">
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Post title..."
                className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm font-medium" />
              <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Share your travel experience..."
                rows={4} className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"><ImageIcon className="w-5 h-5" /></button>
                  <button className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"><Link2 className="w-5 h-5" /></button>
                </div>
                <button onClick={handleCreatePost} disabled={posting || !newTitle || !newContent}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Post
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts feed */}
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-surface-elevated rounded-2xl animate-pulse" />)}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-16 h-16 mx-auto text-text-muted mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">No posts yet</h3>
          <p className="text-text-secondary">Be the first to share your travel experience!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold">
                    {post.user.firstName[0]}{post.user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary text-sm">{post.user.firstName} {post.user.lastName}</p>
                    <p className="text-xs text-text-muted">{timeAgo(post.createdAt)}</p>
                  </div>
                  {post.trip && (
                    <span className="ml-auto px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{post.trip.name}</span>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold font-[var(--font-outfit)] text-text-primary mb-2">{post.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
                  <button onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-sm text-text-muted hover:text-red-500 transition-colors">
                    <Heart className="w-4.5 h-4.5" />{post.likes}
                  </button>
                  <button onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
                    <MessageCircle className="w-4.5 h-4.5" />{post._count.comments}
                  </button>
                </div>
              </div>

              {/* Comments section */}
              {expandedComments.has(post.id) && (
                <div className="px-5 pb-5 border-t border-border pt-4 bg-surface-elevated/30">
                  {post.comments.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/60 to-primary-light/60 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {comment.user.firstName[0]}{comment.user.lastName[0]}
                          </div>
                          <div className="flex-1 bg-surface rounded-xl p-3">
                            <p className="text-xs font-medium text-text-primary">{comment.user.firstName} {comment.user.lastName} <span className="text-text-muted font-normal">· {timeAgo(comment.createdAt)}</span></p>
                            <p className="text-sm text-text-secondary mt-1">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment */}
                  <div className="flex gap-2">
                    <input type="text" value={commentText[post.id] || ""} onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <button onClick={() => handleComment(post.id)} disabled={commentingOn === post.id}
                      className="px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors">
                      {commentingOn === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
