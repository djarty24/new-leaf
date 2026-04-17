import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Users, Sparkles } from "lucide-react";

export default function Layout() {
    const location = useLocation();

    const navItems = [
        { path: "/", label: "Today", icon: Home },
        { path: "/journal", label: "Journal", icon: BookOpen },
        { path: "/forum", label: "Community", icon: Users },
        { path: "/education", label: "Learn", icon: Sparkles },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
            <main className="pb-24 pt-8 px-4 max-w-md mx-auto">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 z-50 w-full backdrop-blur-xl bg-white/70 border-t border-neutral-200 shadow-[0_-4px_30px_rgba(0,0,0,0.03)]">
                <div className="max-w-md mx-auto flex justify-between items-center px-6 py-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? "text-app-green scale-110" : "text-neutral-400 hover:text-app-green/70"
                                    }`}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[11px] font-medium tracking-wide">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );


}