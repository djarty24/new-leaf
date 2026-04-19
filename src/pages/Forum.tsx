import { useState, useEffect } from "react";
import { MessageSquare, Heart, MessageCircle, Send, AlertCircle, X, ChevronLeft, Plus } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, Timestamp, updateDoc, doc, increment, arrayUnion } from "firebase/firestore";

type Comment = { id: string; text: string; createdAt: Date };
type Post = { id: string; text: string; category: string; supportCount: number; comments: Comment[]; createdAt: Date };

const initialMockPosts: Post[] = [
	{ id: "m1", text: "Just hit 3 days without the vape! The 4-2-4 breathing is literally saving my life right now.", category: "Wins", supportCount: 12, comments: [{ id: "c1", text: "You got this! Day 3 is the hardest, keep pushing.", createdAt: new Date() }], createdAt: new Date(Date.now() - 3600000) },
	{ id: "m2", text: "Really struggling tonight. All my friends are doing it and I feel so left out.", category: "Struggles", supportCount: 24, comments: [], createdAt: new Date(Date.now() - 7200000) },
	{ id: "m3", text: "Tip: Throw out your chargers. If you can't charge it, you can't use it when it dies.", category: "Tips", supportCount: 8, comments: [], createdAt: new Date(Date.now() - 86400000) }
];

const categories = [
	{ id: "All", label: "All Posts", color: "text-neutral-600 bg-white" },
	{ id: "Wins", label: "Wins", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
	{ id: "Struggles", label: "Struggles", color: "text-pink-700 bg-app-pink/20 border-app-pink/30" },
	{ id: "Tips", label: "Tips", color: "text-app-purple bg-purple-50 border-purple-200" }
];

export default function Forum() {
	const user = auth.currentUser;

	// --- State ---
	const [posts, setPosts] = useState<Post[]>([]);
	const [activeCategory, setActiveCategory] = useState("All");
	const [isWriting, setIsWriting] = useState(false);
	const [newPostText, setNewPostText] = useState("");
	const [newPostCategory, setNewPostCategory] = useState("Struggles");

	// Single Post View (for comments)
	const [activePost, setActivePost] = useState<Post | null>(null);
	const [commentText, setCommentText] = useState("");

	// --- Hybrid Data Fetching ---
	useEffect(() => {
		// We always fetch from Firebase if possible so even guests can READ live posts
		const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			if (!snapshot.empty) {
				const cloudPosts = snapshot.docs.map(doc => {
					const data = doc.data();
					return {
						id: doc.id,
						text: data.text,
						category: data.category,
						supportCount: data.supportCount || 0,
						comments: (data.comments || []).map((c: any) => ({
							...c,
							createdAt: c.createdAt instanceof Timestamp ? c.createdAt.toDate() : new Date()
						})),
						createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
					} as Post;
				});
				setPosts(cloudPosts);

				if (activePost) {
					const updatedActive = cloudPosts.find(p => p.id === activePost.id);
					if (updatedActive) setActivePost(updatedActive);
				}
			} else {
				setPosts(initialMockPosts);
			}
		}, (error) => {
			console.error("Forum Read Error:", error);
			setPosts(initialMockPosts);
		});

		return () => unsubscribe();
	}, [activePost?.id]);

	const handleCreatePost = async () => {
		if (!newPostText.trim()) return;

		if (user) {
			await addDoc(collection(db, "posts"), {
				text: newPostText,
				category: newPostCategory,
				supportCount: 0,
				comments: [],
				createdAt: serverTimestamp(),
			});
		} else {
			const newPost: Post = {
				id: `demo-${Date.now()}`, text: newPostText, category: newPostCategory, supportCount: 0, comments: [], createdAt: new Date()
			};
			setPosts([newPost, ...posts]);
		}
		setNewPostText("");
		setIsWriting(false);
	};

	const handleSupport = async (postId: string) => {
		if (user) {
			await updateDoc(doc(db, "posts", postId), { supportCount: increment(1) });
		} else {
			setPosts(posts.map(p => p.id === postId ? { ...p, supportCount: p.supportCount + 1 } : p));
			if (activePost?.id === postId) {
				setActivePost({ ...activePost, supportCount: activePost.supportCount + 1 });
			}
		}
	};

	const handleAddComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!commentText.trim() || !activePost) return;

		const newComment = { id: `c-${Date.now()}`, text: commentText, createdAt: new Date() };

		if (user) {
			await updateDoc(doc(db, "posts", activePost.id), {
				comments: arrayUnion(newComment)
			});
		} else {
			const updatedPost = { ...activePost, comments: [...activePost.comments, newComment] };
			setPosts(posts.map(p => p.id === activePost.id ? updatedPost : p));
			setActivePost(updatedPost);
		}
		setCommentText("");
	};

	const filteredPosts = activeCategory === "All" ? posts : posts.filter(p => p.category === activeCategory);

	if (activePost) {
		return (
			<div className="space-y-6 animate-in slide-in-from-right-8 duration-300 pb-24">
				<button onClick={() => setActivePost(null)} className="flex items-center gap-2 text-neutral-500 font-medium hover:text-neutral-800 transition-colors">
					<ChevronLeft size={20} /> Back to Community
				</button>

				<div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
					<div className="flex justify-between items-start">
						<span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${categories.find(c => c.id === activePost.category)?.color}`}>{activePost.category}</span>
						<span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">{activePost.createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
					</div>
					<p className="text-neutral-800 text-lg leading-relaxed">"{activePost.text}"</p>
					<div className="pt-4 border-t border-neutral-100">
						<button onClick={() => handleSupport(activePost.id)} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors active:scale-95">
							<Heart size={16} className={activePost.supportCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
							Send Support ({activePost.supportCount})
						</button>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Replies ({activePost.comments.length})</h3>

					<div className="space-y-3">
						{activePost.comments.map(comment => (
							<div key={comment.id} className="bg-white/60 border border-neutral-200 rounded-2xl p-4 ml-4 shadow-sm animate-in fade-in">
								<p className="text-sm text-neutral-700">{comment.text}</p>
							</div>
						))}
					</div>

					<form onSubmit={handleAddComment} className="relative mt-6">
						<input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write an encouraging reply..." className="w-full bg-white border border-neutral-200 rounded-full py-4 pl-6 pr-14 text-sm outline-none focus:border-neutral-400 shadow-sm transition-all" />
						<button type="submit" disabled={!commentText.trim()} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${commentText.trim() ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-400"}`}>
							<Send size={18} className={commentText.trim() ? "-translate-y-px translate-x-px" : ""} />
						</button>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-500 pb-20 relative">
			<div className="flex justify-between items-end">
				<div>
					<h1 className="font-display text-3xl text-neutral-800">Community</h1>
					<p className="text-neutral-500 mt-1">Anonymous, shame-free peer support.</p>
				</div>
				{!user && (
					<div className="flex items-center gap-1 text-[10px] font-bold text-app-yellow uppercase tracking-widest bg-app-yellow/10 px-2 py-1 rounded-md border border-app-yellow/20">
						<AlertCircle size={10} /> Demo Mode
					</div>
				)}
			</div>

			<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
				{categories.map(cat => (
					<button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${activeCategory === cat.id ? "bg-neutral-900 text-white border-neutral-900 shadow-md" : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"}`}>
						{cat.label}
					</button>
				))}
			</div>

			<button onClick={() => setIsWriting(true)} className="w-full bg-white border border-neutral-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-neutral-300 transition-colors group">
				<span className="font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">Share anonymously...</span>
				<div className="p-2 bg-neutral-100 rounded-full text-neutral-600"><Plus size={18} /></div>
			</button>

			<div className="space-y-4">
				{filteredPosts.map(post => (
					<div key={post.id} className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md animate-in slide-in-from-bottom-2 cursor-pointer" onClick={() => setActivePost(post)}>
						<div className="flex justify-between items-start">
							<span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${categories.find(c => c.id === post.category)?.color}`}>{post.category}</span>
							<span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">{post.createdAt.toLocaleDateString()}</span>
						</div>
						<p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">"{post.text}"</p>
						<div className="flex items-center gap-4 pt-2 border-t border-neutral-50">
							<button onClick={(e) => { e.stopPropagation(); handleSupport(post.id); }} className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-rose-600 transition-colors p-1 z-10">
								<Heart size={16} className={post.supportCount > 0 ? "fill-rose-500 text-rose-500" : ""} /> {post.supportCount}
							</button>
							<div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 p-1">
								<MessageCircle size={16} /> {post.comments.length}
							</div>
						</div>
					</div>
				))}
			</div>

			{isWriting && (
				<div className="fixed inset-0 z-50 bg-neutral-50 overflow-y-auto pb-24 animate-in slide-in-from-bottom-full duration-300">
					<div className="max-w-md mx-auto p-4 pt-12 space-y-8">
						<div className="flex justify-between items-center">
							<h3 className="font-display text-3xl text-neutral-800">New Post</h3>
							<button onClick={() => setIsWriting(false)} className="p-2 bg-neutral-200 rounded-full text-neutral-600 hover:bg-neutral-300"><X size={20} /></button>
						</div>

						<div className="space-y-3">
							<h4 className="text-sm font-medium text-neutral-700">Category</h4>
							<div className="flex flex-wrap gap-2">
								{categories.filter(c => c.id !== "All").map(cat => (
									<button key={cat.id} onClick={() => setNewPostCategory(cat.id)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${newPostCategory === cat.id ? `${cat.color} ring-2 ring-offset-2 ring-offset-neutral-50` : "bg-white text-neutral-500 border-neutral-200"}`}>{cat.label}</button>
								))}
							</div>
						</div>

						<div className="space-y-3">
							<h4 className="text-sm font-medium text-neutral-700">Your message</h4>
							<textarea value={newPostText} onChange={(e) => setNewPostText(e.target.value)} placeholder="Share your experience, struggle, or advice..." className="w-full h-48 p-5 rounded-3xl bg-white border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-400 outline-none transition-all resize-none text-sm leading-relaxed" />
						</div>

						<div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-800 text-xs">
							<MessageSquare size={16} className="shrink-0 mt-0.5" />
							<p>Your post is completely anonymous. No name or profile will be attached to it.</p>
						</div>

						<button disabled={!newPostText.trim()} onClick={handleCreatePost} className={`w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all ${newPostText.trim() ? "bg-neutral-900 text-white shadow-xl" : "bg-neutral-200 text-neutral-400 cursor-not-allowed"}`}>
							Post Anonymously
						</button>
					</div>
				</div>
			)}
		</div>
	);
}