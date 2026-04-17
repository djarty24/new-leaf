import { useState } from "react";
import { PenLine, Smile, Save, ChevronDown, CalendarDays, ChevronRight } from "lucide-react";

export default function Journal() {
  const [mood, setMood] = useState<string | null>(null);
  const [entry, setEntry] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const prompts = [
    "What is one thing that felt easier today than it did yesterday?",
    "What was one moment today where you felt proud of yourself?",
    "How did your body feel during your hardest moment today?",
    "What is one small thing you can do tomorrow to protect your peace?",
  ];
  
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);

  const moodOptions = [
    { id: "calm", label: "Calm", activeClass: "bg-app-green/20 border-app-green text-teal-900" },
    { id: "steady", label: "Steady", activeClass: "bg-app-yellow/30 border-app-yellow text-yellow-900" },
    { id: "sensitive", label: "Sensitive", activeClass: "bg-app-pink/20 border-app-pink text-pink-900" },
    { id: "reflective", label: "Reflective", activeClass: "bg-app-purple/20 border-app-purple text-purple-900" },
  ];

  const pastEntries = [
    { id: 1, date: "Yesterday", mood: "sensitive", text: "Felt really overwhelmed after class, but taking a walk instead of vaping actually helped." },
    { id: 2, date: "April 14", mood: "steady", text: "No strong cravings today. Just focused on getting my calculus homework done and stayed busy." },
    { id: 3, date: "April 12", mood: "reflective", text: "Realized that my main trigger is definitely boredom during my free periods at school." },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setEntry("");
      setMood(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="font-display text-3xl text-neutral-800">Journal</h1>
        <p className="text-neutral-500 mt-1">A safe space for your thoughts.</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-medium text-neutral-700 mb-4 flex items-center gap-2">
          <Smile size={18} className="text-neutral-400" />
          How is your energy right now?
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {moodOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setMood(option.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                mood === option.id 
                  ? `${option.activeClass} ring-2 ring-offset-2 ring-offset-neutral-50 shadow-sm` 
                  : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-neutral-300"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${option.activeClass.split(' ')[0]}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={() => setIsPromptOpen(!isPromptOpen)}
          className="w-full bg-white border border-neutral-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:border-neutral-300 transition-colors text-left"
        >
          <div className="p-2 bg-neutral-100 rounded-xl shrink-0">
            <PenLine size={20} className="text-neutral-700" />
          </div>
          <div className="flex-1 pr-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Prompt of the Day</h4>
            <p className="text-sm font-medium text-neutral-800 leading-snug">
              "{selectedPrompt}"
            </p>
          </div>
          <ChevronDown size={20} className={`text-neutral-400 transition-transform mt-1 ${isPromptOpen ? "rotate-180" : ""}`} />
        </button>

        {isPromptOpen && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-neutral-200 rounded-2xl shadow-lg z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {prompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedPrompt(prompt);
                  setIsPromptOpen(false);
                }}
                className={`w-full text-left p-4 text-sm transition-colors border-b border-neutral-100 last:border-0 hover:bg-neutral-50 ${
                  selectedPrompt === prompt ? "bg-neutral-50 font-medium text-neutral-900" : "text-neutral-600"
                }`}
              >
                "{prompt}"
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative space-y-2">
        <p className="text-xs font-medium text-neutral-400 px-2">
          * Prompts are completely optional. Feel free to just write what's on your mind.
        </p>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Start writing..."
          className="w-full h-56 p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-400 focus:border-transparent outline-none transition-all placeholder:text-neutral-300 resize-none"
        />
        <button
          onClick={handleSave}
          disabled={!entry}
          className={`absolute bottom-4 right-4 px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
            isSaved 
              ? "bg-app-green text-teal-900" 
              : entry 
              ? "bg-neutral-900 text-white shadow-lg active:scale-95 hover:bg-neutral-800" 
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }`}
        >
          {isSaved ? "Saved" : "Save Entry"}
          <Save size={18} />
        </button>
      </div>

      <div className="pt-6">
        <h3 className="font-display text-xl text-neutral-800 mb-4 px-1">Recent Entries</h3>
        <div className="space-y-4">
          {pastEntries.map((past) => {
            const moodConfig = moodOptions.find(m => m.id === past.mood) || moodOptions[0];
            return (
              <div key={past.id} className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm group hover:border-neutral-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium uppercase tracking-wider">
                    <CalendarDays size={14} />
                    {past.date}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${moodConfig.activeClass}`}>
                    {moodConfig.label}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed line-clamp-2 pr-6 relative">
                  {past.text}
                  <ChevronRight size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}