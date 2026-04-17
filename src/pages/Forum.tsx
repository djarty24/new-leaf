import { useState, useRef } from "react";
import { Heart, Plus, X, ShieldAlert, Sparkles, MessageSquare, Send, CornerDownRight } from "lucide-react";

const initialPosts = [
  {
    id: 1,
    tag: "win",
    text: "Just threw my last pod in a public trash can. My hands are shaking but I actually did it.",
    time: "2 hours ago",
    supportCount: 24,
    hasSupported: false,
    comments: [
      { id: 101, text: "So proud of you! The first step is the hardest.", time: "1 hour ago", replyToId: null }
    ]
  },
  {
    id: 2,
    tag: "struggle",
    text: "Day 3 is hard. I keep reaching for my pocket and it's empty. Just breathing through it.",
    time: "4 hours ago",
    supportCount: 89,
    hasSupported: true,
    comments: [
      { id: 102, text: "Day 3 is notoriously the peak. Get through today and it gets easier, I promise.", time: "3 hours ago", replyToId: null },
      { id: 105, text: "This is so true. Day 4 was a breeze for me compared to day 3. Hang in there!", time: "1 hour ago", replyToId: 102 },
      { id: 103, text: "You've got this. Drink ice water through a straw, it really helps the oral fixation!", time: "2 hours ago", replyToId: null }
    ]
  },
  {
    id: 3,
    tag: "tip",
    text: "Chewing on cinnamon sticks completely kills the oral fixation for me. Highly recommend trying it!",
    time: "6 hours ago",
    supportCount: 12,
    hasSupported: false,
    comments: []
  },
  {
    id: 4,
    tag: "struggle",
    text: "Relapsed at a party last night. Feeling so much shame today. Starting over.",
    time: "12 hours ago",
    supportCount: 156,
    hasSupported: false,
    comments: [
      { id: 104, text: "Relapse is part of recovery. Don't beat yourself up, just start again.", time: "10 hours ago", replyToId: null }
    ]
  },
];

export default function Forum() {
  const [posts, setPosts] = useState(initialPosts);
  const [activeFilter, setActiveFilter] = useState<"all" | "win" | "struggle" | "tip">("all");
  
  const [isPosting, setIsPosting] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostTag, setNewPostTag] = useState<"win" | "struggle" | "tip">("win");

  const [viewingPostId, setViewingPostId] = useState<number | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  
  const [replyingTo, setReplyingTo] = useState<{id: number | 'post', text: string} | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const filters = [
    { id: "all", label: "Everything" },
    { id: "win", label: "Wins" },
    { id: "struggle", label: "Struggles" },
    { id: "tip", label: "Tips" },
  ];

  const tagConfig = {
    win: { label: "Win", color: "bg-app-green/20 text-teal-900 border-app-green" },
    struggle: { label: "Struggle", color: "bg-app-purple/20 text-purple-900 border-app-purple" },
    tip: { label: "Tip", color: "bg-app-yellow/40 text-yellow-900 border-app-yellow" },
  };

  const handleSupport = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          supportCount: post.hasSupported ? post.supportCount - 1 : post.supportCount + 1,
          hasSupported: !post.hasSupported
        };
      }
      return post;
    }));
  };

  const handleSubmitPost = () => {
    const newPost = {
      id: Date.now(),
      tag: newPostTag,
      text: newPostText,
      time: "Just now",
      supportCount: 0,
      hasSupported: false,
      comments: []
    };
    setPosts([newPost, ...posts]);
    setIsPosting(false);
    setNewPostText("");
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || viewingPostId === null) return;
    
    setPosts(posts.map(post => {
      if (post.id === viewingPostId) {
        return {
          ...post,
          comments: [...post.comments, { 
            id: Date.now(), 
            text: newCommentText, 
            time: "Just now",
            replyToId: (replyingTo && replyingTo.id !== 'post') ? replyingTo.id as number : null 
          }]
        };
      }
      return post;
    }));
    
    setNewCommentText("");
    setReplyingTo(null);
  };

  const initiateReply = (commentId: number, commentText: string) => {
    setReplyingTo({ id: commentId, text: commentText });
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
  };

  const initiatePostReply = () => {
    setReplyingTo({ id: 'post', text: 'Original Post' });
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
  };

  const filteredPosts = activeFilter === "all" ? posts : posts.filter(p => p.tag === activeFilter);
  const viewingPost = posts.find(p => p.id === viewingPostId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative">
      <div>
        <h1 className="font-display text-3xl text-neutral-800">Community</h1>
        <p className="text-neutral-500 mt-1">You are not alone in this.</p>
      </div>

      <button
        onClick={() => setIsPosting(true)}
        className="w-full bg-white border border-neutral-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-neutral-300 transition-colors text-left group"
      >
        <div className="p-3 bg-neutral-100 rounded-full group-hover:bg-neutral-200 transition-colors">
          <Plus size={20} className="text-neutral-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-neutral-800">Share a note</h3>
          <p className="text-sm text-neutral-500">Post anonymously safely...</p>
        </div>
      </button>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 border ${
              activeFilter === f.id
                ? "bg-neutral-900 border-neutral-900 text-white shadow-md"
                : "bg-white/60 border-neutral-200 text-neutral-600 hover:bg-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div 
            key={post.id} 
            onClick={() => setViewingPostId(post.id)}
            className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm space-y-4 hover:border-neutral-300 transition-colors cursor-pointer animate-in slide-in-from-bottom-2"
          >
            <div className="flex justify-between items-start">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${tagConfig[post.tag as keyof typeof tagConfig].color}`}>
                {tagConfig[post.tag as keyof typeof tagConfig].label}
              </span>
              <span className="text-xs font-medium text-neutral-400">{post.time}</span>
            </div>
            
            <p className="text-neutral-700 leading-relaxed text-sm">
              {post.text}
            </p>

            <div className="pt-2 flex justify-between items-center border-t border-neutral-100">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium uppercase tracking-wider">
                <MessageSquare size={14} />
                {post.comments.length} {post.comments.length === 1 ? 'Reply' : 'Replies'}
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSupport(post.id);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  post.hasSupported
                    ? "bg-app-pink/20 border-app-pink text-pink-900"
                    : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                <Heart size={14} className={post.hasSupported ? "fill-app-pink text-app-pink animate-in zoom-in" : ""} />
                {post.supportCount}
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewingPostId !== null && viewingPost && (
        <div className="fixed inset-0 z-50 bg-neutral-50 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-md mx-auto h-[100dvh] flex flex-col">
            
            <div className="shrink-0 bg-neutral-50 px-4 py-4 flex justify-between items-center border-b border-neutral-200">
              <h3 className="font-display text-xl text-neutral-800">Thread</h3>
              <button onClick={() => { setViewingPostId(null); setReplyingTo(null); }} className="p-2 bg-neutral-200 rounded-full text-neutral-600 hover:bg-neutral-300 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-6">
              <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${tagConfig[viewingPost.tag as keyof typeof tagConfig].color}`}>
                    {tagConfig[viewingPost.tag as keyof typeof tagConfig].label}
                  </span>
                  <span className="text-xs font-medium text-neutral-400">{viewingPost.time}</span>
                </div>
                <p className="text-neutral-800 leading-relaxed text-lg">
                  {viewingPost.text}
                </p>
                <div className="pt-3 flex justify-between items-center border-t border-neutral-100">
                  <button 
                    onClick={initiatePostReply}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors uppercase tracking-wider"
                  >
                    <MessageSquare size={14} />
                    Reply to Post
                  </button>

                  <button 
                    onClick={() => handleSupport(viewingPost.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                      viewingPost.hasSupported
                        ? "bg-app-pink/20 border-app-pink text-pink-900"
                        : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100"
                    }`}
                  >
                    <Heart size={14} className={viewingPost.hasSupported ? "fill-app-pink text-app-pink animate-in zoom-in" : ""} />
                    {viewingPost.supportCount} Support
                  </button>
                </div>
              </div>

              <div className="space-y-4 border-l-2 border-neutral-200 ml-2 pl-4">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Replies</h4>
                {viewingPost.comments.length === 0 ? (
                  <p className="text-sm text-neutral-500 italic">No replies yet. Be the first to share some support.</p>
                ) : (
                  viewingPost.comments.map(comment => (
                    <div key={comment.id} className="relative bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm space-y-2 group">
                      
                      {comment.replyToId && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50 p-2 rounded-lg border border-neutral-100 mb-2">
                          <CornerDownRight size={12} />
                          Replying to an earlier comment
                        </div>
                      )}

                      <p className="text-sm text-neutral-700 leading-relaxed">{comment.text}</p>
                      
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">{comment.time}</p>
                        <button 
                          onClick={() => initiateReply(comment.id, comment.text)}
                          className="text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors uppercase tracking-wider"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="shrink-0 bg-white border-t border-neutral-200 p-4 pb-28 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <div className="relative">
                {replyingTo && (
                  <div className="flex justify-between items-center bg-neutral-100 border border-neutral-200 rounded-t-2xl px-4 py-2 -mb-2 pb-4">
                    <span className="text-xs text-neutral-500 font-medium truncate pr-4">
                      <span className="font-bold">Replying:</span> {replyingTo.id === 'post' ? replyingTo.text : `"${replyingTo.text}"`}
                    </span>
                    <button onClick={() => setReplyingTo(null)} className="text-neutral-400 hover:text-neutral-700">
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="relative">
                  <input
                    ref={commentInputRef}
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={replyingTo ? "Write your reply..." : "Add a general comment..."}
                    className={`w-full bg-white border focus:bg-neutral-50 py-3 pl-5 pr-12 text-sm outline-none transition-all placeholder:text-neutral-400 shadow-sm ${
                      replyingTo ? "border-neutral-200 rounded-b-2xl rounded-t-none" : "border-neutral-200 focus:border-neutral-400 rounded-full"
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment();
                    }}
                  />
                  <button 
                    onClick={handleAddComment}
                    disabled={!newCommentText.trim()}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
                      newCommentText.trim() ? "bg-neutral-900 text-white shadow-md hover:scale-105" : "bg-transparent text-neutral-400"
                    }`}
                  >
                    <Send size={16} className={newCommentText.trim() ? "-translate-x-px translate-y-px" : ""} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {isPosting && (
        <div className="fixed inset-0 z-50 bg-neutral-50 overflow-y-auto pb-24 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-md mx-auto p-4 pt-12 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-3xl text-neutral-800">Share a note</h3>
              <button onClick={() => setIsPosting(false)} className="p-2 bg-neutral-200 rounded-full text-neutral-600 hover:bg-neutral-300 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex gap-3 items-start">
              <ShieldAlert className="text-emerald-700 shrink-0 mt-0.5" size={20} />
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                This space is completely anonymous. Share your truth safely. No judgment, just support.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">What kind of note is this?</h4>
                <div className="flex gap-2">
                  {(["win", "struggle", "tip"] as const).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setNewPostTag(tag)}
                      className={`flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                        newPostTag === tag
                          ? `${tagConfig[tag].color} ring-2 ring-offset-2 ring-offset-neutral-50 shadow-sm`
                          : "bg-white border-neutral-200 text-neutral-500"
                      }`}
                    >
                      {tagConfig[tag].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Write your note here..."
                  className="w-full h-48 p-5 rounded-3xl bg-white border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-400 focus:border-transparent outline-none transition-all placeholder:text-neutral-300 resize-none"
                  maxLength={280}
                />
                <div className="text-right mt-2 text-xs font-medium text-neutral-400">
                  {newPostText.length} / 280
                </div>
              </div>

              <button 
                disabled={!newPostText.trim()}
                onClick={handleSubmitPost}
                className={`w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all ${
                  newPostText.trim()
                    ? "bg-neutral-900 text-white shadow-xl hover:scale-[1.02]"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }`}
              >
                Post anonymously <Sparkles size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}