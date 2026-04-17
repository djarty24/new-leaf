import { useState } from "react";
import { AlertTriangle, BookOpen, Clock, ChevronLeft, ArrowRight, Brain, Wind, Coffee } from "lucide-react";

// Mock Data for Demo Purposes
const mockArticles = [
  {
    id: 1,
    title: "The 3-Minute Rule: Riding the Wave of a Craving",
    category: "Coping Strategies",
    readTime: "3 min read",
    icon: Wind,
    colorClass: "bg-app-pink/10 border-app-pink/30 text-pink-900",
    iconBg: "bg-app-pink/20 text-app-pink",
    content: `
      Cravings can feel overwhelming, like a tidal wave that is going to pull you under. But neurologically speaking, the acute peak of a craving usually only lasts about 3 to 5 minutes. 
      
      **The technique of "Urge Surfing"** teaches us not to fight the wave, but to ride it out. 
      
      Instead of panicking or telling yourself "I can't have it," try to simply observe the physical sensations in your body. Where do you feel the tension? Is your chest tight? Are your hands restless? 
      
      By acknowledging the feeling without immediately acting on it, you give your brain the 3 minutes it needs for the chemical surge to subside.
    `
  },
  {
    id: 2,
    title: "What Happens to Your Brain When You Quit?",
    category: "The Science",
    readTime: "5 min read",
    icon: Brain,
    colorClass: "bg-app-purple/10 border-app-purple/30 text-purple-900",
    iconBg: "bg-app-purple/20 text-app-purple",
    content: `
      When you stop vaping, your brain has to undergo a period of recalibration. Nicotine alters your brain's dopamine receptors, which is why quitting can leave you feeling flat, anxious, or unmotivated in the first few days.
      
      **Within 72 hours:** The nicotine is entirely out of your system. This is often the peak of physical withdrawal.
      
      **Within 2 to 4 weeks:** Your dopamine receptors begin to return to normal levels. You will start to find joy and baseline focus returning without the need for a chemical stimulant.
      
      Understanding this timeline helps remind you that the discomfort is temporary and purely biological. Your brain is healing.
    `
  },
  {
    id: 3,
    title: "Building a 'Dopamine Menu' for Tough Days",
    category: "Daily Habits",
    readTime: "4 min read",
    icon: Coffee,
    colorClass: "bg-app-yellow/20 border-app-yellow/40 text-yellow-900",
    iconBg: "bg-app-yellow/40 text-yellow-900",
    content: `
      When you remove vaping from your daily routine, you are removing a highly accessible source of instant dopamine. To prevent relapse, you need to replace it with a "Dopamine Menu."
      
      A Dopamine Menu is a list of healthy, accessible activities you can choose from when you feel a craving or a dip in mood. 
      
      **Appetizers (Takes 5 mins):** Stepping outside for fresh air, drinking a glass of ice water, stretching, listening to one hype song.
      
      **Mains (Takes 30+ mins):** Going for a walk, cooking a meal, calling a supportive friend, taking a hot shower.
      
      Having this menu prepared *before* a craving hits removes the friction of having to decide what to do when you are already stressed.
    `
  }
];

export default function Learn() {
  const [activeArticleId, setActiveArticleId] = useState<number | null>(null);

  const activeArticle = mockArticles.find(a => a.id === activeArticleId);

  // Article Reader View
  if (activeArticle) {
    const Icon = activeArticle.icon;
    return (
      <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 pb-20 relative min-h-[80vh]">
        {/* Navigation Bar */}
        <button 
          onClick={() => setActiveArticleId(null)}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 transition-colors pt-2"
        >
          <ChevronLeft size={20} />
          <span className="font-medium text-sm">Back to Library</span>
        </button>

        {/* Article Header */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${activeArticle.colorClass}`}>
              {activeArticle.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
              <Clock size={12} />
              {activeArticle.readTime}
            </span>
          </div>
          
          <h1 className="font-display text-3xl text-neutral-900 leading-tight">
            {activeArticle.title}
          </h1>
        </div>

        {/* Article Content Body */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm mt-8 relative overflow-hidden">
          {/* Decorative Icon Background */}
          <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full ${activeArticle.iconBg} opacity-20 blur-2xl pointer-events-none`} />
          
          <div className="prose prose-neutral prose-p:leading-relaxed prose-p:text-neutral-700 prose-strong:text-neutral-900 prose-strong:font-bold">
            {activeArticle.content.split('\n\n').map((paragraph, idx) => {
              // Simple markdown parser for bolding in our mock text
              const formattedText = paragraph.trim().split('**').map((chunk, i) => 
                i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk
              );
              
              return paragraph.trim() ? (
                <p key={idx} className="mb-4 last:mb-0">
                  {formattedText}
                </p>
              ) : null;
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="font-display text-3xl text-neutral-800">Learn</h1>
        <p className="text-neutral-500 mt-1">Resources for your journey.</p>
      </div>

      {/* disclaimer */}
      <div className="bg-app-yellow/10 border border-app-yellow/40 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
        <AlertTriangle className="text-yellow-700 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-yellow-900 uppercase tracking-wider mb-1">Demo Placeholder</h4>
          <p className="text-xs text-yellow-800/80 leading-relaxed font-medium">
            The articles below are placeholders for demonstration. In a production environment, this space will feature peer-reviewed resources written by addiction specialists. <strong>This is not medical advice.</strong>
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="font-display text-xl text-neutral-800 px-1">Featured Reading</h3>
        
        {mockArticles.map((article) => {
          const Icon = article.icon;
          return (
            <button
              key={article.id}
              onClick={() => setActiveArticleId(article.id)}
              className="w-full bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm hover:border-neutral-300 hover:shadow-md transition-all text-left group relative overflow-hidden"
            >
              <div className="flex items-start gap-4 relative z-10">
                <div className={`p-3 rounded-2xl shrink-0 transition-colors ${article.iconBg}`}>
                  <Icon size={24} />
                </div>
                
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${article.colorClass}`}>
                      {article.category}
                    </span>
                    <span className="text-[10px] font-medium text-neutral-400 flex items-center gap-1">
                      <Clock size={10} /> {article.readTime}
                    </span>
                  </div>
                  <h4 className="font-medium text-neutral-800 leading-snug group-hover:text-neutral-900">
                    {article.title}
                  </h4>
                </div>
              </div>
              
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all">
                <ArrowRight size={20} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}