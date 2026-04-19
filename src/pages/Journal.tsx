import { useState, useEffect } from "react";
import { Plus, X, Book, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy, limit, serverTimestamp, Timestamp } from "firebase/firestore";

// Mock Data for Guest/Demo Mode
const initialMockEntries = [
  {
    id: "m1",
    text: "Woke up feeling a bit restless today, but the 4-2-4 breathing helped. Small wins.",
    mood: "Sensitive",
    createdAt: new Date(Date.now() - 86400000), // Yesterday
  },
  {
    id: "m2",
    text: "Had a great session with the community forum. It really helps knowing I'm not the only one struggling with Day 3.",
    mood: "Steady",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  }
];

const moodOptions = [
  { id: "Calm", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "Steady", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "Sensitive", color: "bg-app-pink/20 text-pink-700 border-app-pink/30" },
  { id: "Reflective", color: "bg-app-purple/10 text-purple-700 border-app-purple/20" },
];

const prompts = [
  "What was one thing that felt easier today?",
  "How did you handle your strongest craving today?",
  "What is one reason you're proud of yourself right now?",
  "Describe a moment today where you felt completely in control.",
];

export default function Journal() {
  const [entries, setEntries] = useState<any[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [selectedMood, setSelectedMood] = useState("Steady");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const user = auth.currentUser;

  // Hybrid Data Logic: Stream from Firebase if logged in, else use Mocks
  useEffect(() => {
    if (user) {
      // PRO-TIP: We added limit(50) here so the app never slows down, even if they have 1,000 entries!
      // NOTE: This requires a composite index. Click the link in your browser console error to build it!
      const q = query(
        collection(db, "journals"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(50) 
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cloudEntries = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Handle Firestore Timestamp conversion safely
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          };
        });
        setEntries(cloudEntries);
      }, (error) => {
        console.error("Firebase Read Error:", error);
      });

      return () => unsubscribe();
    } else {
      setEntries(initialMockEntries);
    }
  }, [user]);

  const handleSave = async () => {
    if (!journalText.trim()) return;
    setIsSaving(true);

    try {
      if (user) {
        // REAL USER: Save to Firestore
        await addDoc(collection(db, "journals"), {
          userId: user.uid,
          text: journalText,
          mood: selectedMood,
          createdAt: serverTimestamp(),
        });
      } else {
        // GUEST MODE: Simulate a save for the demo
        const demoEntry = {
          id: `demo-${Date.now()}`,
          text: journalText,
          mood: selectedMood,
          createdAt: new Date(),
        };
        setEntries([demoEntry, ...entries]);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsWriting(false);
        setJournalText("");
        setIsSaving(false);
      }, 1500);
    } catch (error) {
      console.error("Error saving entry:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl text-neutral-800">Journal</h1>
          <p className="text-neutral-500 mt-1">Reflect on your progress.</p>
        </div>
        {!user && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-app-yellow uppercase tracking-widest bg-app-yellow/10 px-2 py-1 rounded-md border border-app-yellow/20">
            <AlertCircle size={10} /> Demo Mode
          </div>
        )}
      </div>

      {/* New Entry Button */}
      <button
        onClick={() => setIsWriting(true)}
        className="w-full bg-white border border-neutral-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-neutral-300 transition-colors text-left group"
      >
        <div className="p-3 bg-neutral-100 rounded-full group-hover:bg-neutral-200 transition-colors text-neutral-600">
          <Plus size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-neutral-800">New Entry</h3>
          <p className="text-sm text-neutral-500">How are you feeling right now?</p>
        </div>
      </button>

      {/* Entries List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Recent Reflections</h3>
        {entries.length === 0 ? (
          <div className="text-center py-12 bg-white/40 rounded-3xl border border-dashed border-neutral-300">
            <Book className="mx-auto text-neutral-300 mb-3" size={32} />
            <p className="text-sm text-neutral-500">No entries yet. Start writing to track your mood.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm space-y-3 animate-in slide-in-from-bottom-2">
              <div className="flex justify-between items-start">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${moodOptions.find(m => m.id === entry.mood)?.color || ""}`}>
                  {entry.mood}
                </span>
                <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={10} />
                  {entry.createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed italic">"{entry.text}"</p>
            </div>
          ))
        )}
      </div>

      {/* Writing Modal */}
      {isWriting && (
        <div className="fixed inset-0 z-50 bg-neutral-50 overflow-y-auto pb-24 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-md mx-auto p-4 pt-12 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-3xl text-neutral-800">Daily Reflection</h3>
              <button onClick={() => setIsWriting(false)} className="p-2 bg-neutral-200 rounded-full text-neutral-600 hover:bg-neutral-300 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Mood Picker */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-neutral-700">What is your current mood?</h4>
              <div className="grid grid-cols-2 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                      selectedMood === mood.id
                        ? `${mood.color} ring-2 ring-offset-2 ring-offset-neutral-50`
                        : "bg-white border-neutral-200 text-neutral-500"
                    }`}
                  >
                    {mood.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Writing Area */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-neutral-700">Your thoughts</h4>
                <select 
                  onChange={(e) => setJournalText(e.target.value)}
                  className="text-[10px] bg-neutral-100 border-none rounded-md px-2 py-1 text-neutral-500 outline-none"
                >
                  <option value="">Need a prompt?</option>
                  {prompts.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Start writing..."
                className="w-full h-64 p-5 rounded-3xl bg-white border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-400 focus:border-transparent outline-none transition-all placeholder:text-neutral-300 resize-none"
              />
            </div>

            <button 
              disabled={!journalText.trim() || isSaving}
              onClick={handleSave}
              className={`w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all ${
                saveSuccess 
                  ? "bg-app-green text-teal-900" 
                  : journalText.trim() 
                    ? "bg-neutral-900 text-white shadow-xl hover:scale-[1.02]" 
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {saveSuccess ? (
                <><CheckCircle2 size={20} /> Saved to {user ? 'Cloud' : 'Demo'}</>
              ) : isSaving ? (
                "Saving..."
              ) : (
                "Save reflection"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}