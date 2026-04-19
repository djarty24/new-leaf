import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Wind, BookOpen, MessageSquare, GraduationCap, User as UserIcon, LogOut, Loader2 } from "lucide-react";
import AuthModal from "./AuthModal";

export default function Layout() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false); // Tell the app Firebase is done checking
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { path: "/", label: "Today", icon: Wind },
    { path: "/journal", label: "Journal", icon: BookOpen },
    { path: "/forum", label: "Community", icon: MessageSquare },
    { path: "/education", label: "Learn", icon: GraduationCap },
  ];

  const handleSignOut = () => {
    signOut(auth);
    setShowUserMenu(false);
  };

  // If Firebase is still thinking, show a clean loading screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 pb-24">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 z-40 px-4">
        <div className="max-w-md mx-auto h-full flex justify-between items-center">
          <span className="font-display text-xl text-neutral-800">New Leaf</span>
          
          <div className="relative">
            {user ? (
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-app-purple/10 border border-app-purple/20 flex items-center justify-center text-app-purple font-bold text-sm"
              >
                {user.email?.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-sm hover:bg-neutral-800 transition-all"
              >
                <UserIcon size={14} />
                Sign In
              </button>
            )}

            {/* Dropdown Menu for Logged In User */}
            {showUserMenu && user && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-2xl shadow-xl p-2 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Account</p>
                  <p className="text-xs text-neutral-600 truncate">{user.email}</p>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto pt-24 px-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-lg border-t border-neutral-200 z-50 px-6">
        <div className="max-w-md mx-auto h-full flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? "text-app-green" : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${isActive ? "bg-app-green/10" : ""}`}>
                  <Icon size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}