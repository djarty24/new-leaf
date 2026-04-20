import { useState, useEffect, useRef } from "react";
import { Wind, AlertCircle, CheckCircle2, X, Plus, Minus, ChevronLeft, ChevronRight, Clock, Activity, Square, Send, Eye, Hand, Ear, Sparkles, Info } from "lucide-react";
import GrowthEngine from "../components/GrowthEngine";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, query, where, onSnapshot, Timestamp } from "firebase/firestore";

type LogEntry = {
	id: string;
	timestamp: Date;
	intensity: string | null;
	tags: string[];
	vapes: number;
};

type DayData = {
	cravings: number;
	vapes: number;
	logs: LogEntry[];
};

const formatDateKey = (date: Date) => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const contextOptions = [
	{ id: "stressed", label: "Stressed", activeClass: "bg-app-purple/10 border-app-purple text-purple-900" },
	{ id: "anxious", label: "Anxious", activeClass: "bg-app-pink/10 border-app-pink text-pink-900" },
	{ id: "bored", label: "Bored", activeClass: "bg-app-yellow/20 border-app-yellow text-yellow-900" },
	{ id: "sad", label: "Sad", activeClass: "bg-blue-50 border-blue-300 text-blue-900" },
	{ id: "lonely", label: "Lonely", activeClass: "bg-slate-100 border-slate-400 text-slate-800" },
	{ id: "angry", label: "Angry", activeClass: "bg-rose-50 border-rose-300 text-rose-900" },
	{ id: "tired", label: "Tired", activeClass: "bg-indigo-50 border-indigo-300 text-indigo-900" },
	{ id: "happy", label: "Happy", activeClass: "bg-teal-50 border-teal-300 text-teal-900" },
	{ id: "excited", label: "Excited", activeClass: "bg-fuchsia-50 border-fuchsia-300 text-fuchsia-900" },
	{ id: "social", label: "Socializing", activeClass: "bg-emerald-50 border-emerald-300 text-emerald-900" },
	{ id: "party", label: "Partying", activeClass: "bg-violet-50 border-violet-300 text-violet-900" },
	{ id: "school", label: "School/Studying", activeClass: "bg-neutral-100 border-neutral-400 text-neutral-800" },
	{ id: "waking", label: "Just Woke Up", activeClass: "bg-sky-50 border-sky-300 text-sky-900" },
	{ id: "eating", label: "After Eating", activeClass: "bg-orange-50 border-orange-300 text-orange-900" },
	{ id: "driving", label: "Driving", activeClass: "bg-zinc-100 border-zinc-400 text-zinc-800" },
	{ id: "sleep", label: "Can't Sleep", activeClass: "bg-cyan-50 border-cyan-300 text-cyan-900" },
];

const getTagConfig = (id: string) => contextOptions.find(t => t.id === id) || contextOptions[0];

const intensityOptions = [
	{ id: "Mild", label: "Just a passing thought", activeClass: "border-app-yellow bg-app-yellow/10 text-yellow-900", badgeClass: "bg-app-yellow/40 text-yellow-950" },
	{ id: "Moderate", label: "Feeling the pull, but manageable", activeClass: "border-app-pink bg-app-pink/10 text-pink-900", badgeClass: "bg-app-pink/50 text-pink-950" },
	{ id: "Severe", label: "Strong urge, hard to focus", activeClass: "border-app-purple bg-app-purple/10 text-purple-900", badgeClass: "bg-app-purple/40 text-purple-950" },
];

const getIntensityBadge = (id: string | null) => {
	if (!id) return "bg-neutral-200 text-neutral-700";
	return intensityOptions.find(i => i.id === id)?.badgeClass || "bg-neutral-200 text-neutral-700";
};

// Mock data generator for Guest Mode
const generateInitialHistory = () => {
	const data: Record<string, DayData> = {};
	const today = new Date();

	for (let i = 1; i <= today.getDate() - 1; i++) {
		const pastDate = new Date(today.getFullYear(), today.getMonth(), i);
		const dateKey = formatDateKey(pastDate);
		const daysAgo = today.getDate() - i;

		if (daysAgo === 2 || daysAgo === 4) {
			const isBadDay = daysAgo === 2;
			const time1 = new Date(pastDate); time1.setHours(9, 15);
			const time2 = new Date(pastDate); time2.setHours(14, 30);
			const time3 = new Date(pastDate); time3.setHours(21, 45);

			data[dateKey] = {
				cravings: isBadDay ? 3 : 2,
				vapes: isBadDay ? 2 : 0,
				logs: [
					{ id: `demo-${i}-1`, timestamp: time1, intensity: "Moderate", tags: ["waking", "anxious"], vapes: isBadDay ? 1 : 0 },
					{ id: `demo-${i}-2`, timestamp: time2, intensity: "Severe", tags: ["school", "stressed"], vapes: isBadDay ? 1 : 0 },
					...(isBadDay ? [{ id: `demo-${i}-3`, timestamp: time3, intensity: "Mild", tags: ["bored", "lonely"], vapes: 0 }] : [])
				]
			};
		} else {
			const vapes = Math.random() > 0.8 ? 1 : 0;
			const cravings = Math.floor(Math.random() * 2);
			const logs: LogEntry[] = [];
			if (cravings > 0 || vapes > 0) {
				const t = new Date(pastDate); t.setHours(12 + Math.floor(Math.random() * 6), 0);
				logs.push({ id: `gen-${i}`, timestamp: t, intensity: cravings > 0 ? "Mild" : null, tags: ["bored"], vapes });
			}
			data[dateKey] = { cravings, vapes, logs };
		}
	}
	return data;
};

export default function Tracker() {
	const user = auth.currentUser;

	const [isSurging, setIsSurging] = useState(false);
	const [activeSurgeTab, setActiveSurgeTab] = useState<"424" | "box" | "letgo" | "54321" | "anchor">("424");
	const [isLogging, setIsLogging] = useState(false);
	const [showAbout, setShowAbout] = useState(false);

	const [historyData, setHistoryData] = useState<Record<string, DayData>>({});
	const [cravingLevel, setCravingLevel] = useState<string | null>(null);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [vapeCount, setVapeCount] = useState(0);
	const [isLogged, setIsLogged] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [viewMonth, setViewMonth] = useState(new Date());
	const [popupDate, setPopupDate] = useState<Date | null>(null);
	const [viewingTimelineDate, setViewingTimelineDate] = useState<Date | null>(null);

	useEffect(() => {
		if (user) {
			const q = query(
				collection(db, "cravings"),
				where("userId", "==", user.uid)
			);

			const unsubscribe = onSnapshot(q, (snapshot) => {
				const rebuiltData: Record<string, DayData> = {};

				snapshot.docs.forEach(doc => {
					const data = doc.data();
					const timestampDate = data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date();
					const dateKey = formatDateKey(timestampDate);

					if (!rebuiltData[dateKey]) {
						rebuiltData[dateKey] = { cravings: 0, vapes: 0, logs: [] };
					}

					rebuiltData[dateKey].cravings += (data.intensity ? 1 : 0);
					rebuiltData[dateKey].vapes += (data.vapes || 0);
					rebuiltData[dateKey].logs.push({
						id: doc.id,
						timestamp: timestampDate,
						intensity: data.intensity,
						tags: data.tags || [],
						vapes: data.vapes || 0
					});
				});

				Object.keys(rebuiltData).forEach(key => {
					rebuiltData[key].logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
				});

				setHistoryData(rebuiltData);
			});

			return () => unsubscribe();
		} else {
			setHistoryData(generateInitialHistory());
		}
	}, [user]);

	const [breathePhase, setBreathePhase] = useState<"start" | "inhale" | "hold1" | "exhale" | "hold2">("start");
	const [timeLeft, setTimeLeft] = useState(3);
	const [worryText, setWorryText] = useState("");
	const [bubbles, setBubbles] = useState<{ id: number, text: string }[]>([]);
	const [groundingStep, setGroundingStep] = useState(0);
	const [holdProgress, setHoldProgress] = useState(0);
	const holdIntervalRef = useRef<number | null>(null);

	const groundingPrompts = [
		{ num: 5, text: "things you can SEE right now.", icon: Eye, color: "text-blue-500", bg: "bg-blue-100" },
		{ num: 4, text: "things you can FEEL physically.", icon: Hand, color: "text-emerald-500", bg: "bg-emerald-100" },
		{ num: 3, text: "things you can HEAR around you.", icon: Ear, color: "text-app-yellow", bg: "bg-yellow-100" },
		{ num: 2, text: "things you can SMELL.", icon: Wind, color: "text-app-purple", bg: "bg-purple-100" },
		{ num: 1, text: "thing you can TASTE.", icon: Sparkles, color: "text-app-pink", bg: "bg-pink-100" },
	];

	const realToday = new Date();
	realToday.setHours(0, 0, 0, 0);
	const isViewingCurrentMonth = viewMonth.getFullYear() === realToday.getFullYear() && viewMonth.getMonth() === realToday.getMonth();

	const calculateTotalResisted = () => {
		let resisted = 0;
		Object.values(historyData).forEach(day => {
			day.logs.forEach(log => {
				if (log.intensity !== null && log.vapes === 0) resisted += 1;
			});
		});
		return resisted;
	};
	const totalResisted = calculateTotalResisted();

	useEffect(() => {
		if (!isSurging || (activeSurgeTab !== "424" && activeSurgeTab !== "box")) return;
		let tick = 0;
		setBreathePhase("start");
		setTimeLeft(1);

		const interval = window.setInterval(() => {
			tick++;
			if (activeSurgeTab === "424") {
				if (tick === 1) { setBreathePhase("inhale"); setTimeLeft(4); }
				else if (tick > 1 && tick < 5) { setTimeLeft(5 - tick); }
				else if (tick === 5) { setBreathePhase("hold1"); setTimeLeft(2); }
				else if (tick === 6) { setTimeLeft(1); }
				else if (tick === 7) { setBreathePhase("exhale"); setTimeLeft(4); }
				else if (tick > 7 && tick < 11) { setTimeLeft(11 - tick); }
				else if (tick === 11) { tick = 1; setBreathePhase("inhale"); setTimeLeft(4); }
			} else {
				if (tick === 1) { setBreathePhase("inhale"); setTimeLeft(4); }
				else if (tick > 1 && tick < 5) { setTimeLeft(5 - tick); }
				else if (tick === 5) { setBreathePhase("hold1"); setTimeLeft(4); }
				else if (tick > 5 && tick < 9) { setTimeLeft(9 - tick); }
				else if (tick === 9) { setBreathePhase("exhale"); setTimeLeft(4); }
				else if (tick > 9 && tick < 13) { setTimeLeft(13 - tick); }
				else if (tick === 13) { setBreathePhase("hold2"); setTimeLeft(4); }
				else if (tick > 13 && tick < 17) { setTimeLeft(17 - tick); }
				else if (tick === 17) { tick = 1; setBreathePhase("inhale"); setTimeLeft(4); }
			}
		}, 1000);
		return () => window.clearInterval(interval);
	}, [isSurging, activeSurgeTab]);

	const handleLetGo = (e: React.FormEvent) => {
		e.preventDefault();
		if (!worryText.trim()) return;
		const newBubble = { id: Date.now(), text: worryText };
		setBubbles(prev => [...prev, newBubble]);
		setWorryText("");
		setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== newBubble.id)), 5000);
	};

	const startAnchorHold = () => {
		if (holdProgress >= 100) return;
		holdIntervalRef.current = window.setInterval(() => {
			setHoldProgress(prev => {
				if (prev >= 100) { window.clearInterval(holdIntervalRef.current!); return 100; }
				return prev + 1;
			});
		}, 100);
	};

	const stopAnchorHold = () => {
		if (holdIntervalRef.current) window.clearInterval(holdIntervalRef.current);
		if (holdProgress < 100) setHoldProgress(0);
	};

	const handleCloseSurge = () => {
		setIsSurging(false); setActiveSurgeTab("424"); setHoldProgress(0);
	};

	const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

	const handleLog = async () => {
		setIsSaving(true);

		const dateKey = formatDateKey(selectedDate);
		const isToday = formatDateKey(new Date()) === dateKey;

		const logTimestamp = isToday ? new Date() : new Date(selectedDate.setHours(12, 0, 0, 0));

		if (user) {
			await addDoc(collection(db, "cravings"), {
				userId: user.uid,
				timestamp: logTimestamp,
				intensity: cravingLevel,
				tags: selectedTags,
				vapes: vapeCount
			});
		} else {
			const existingData = historyData[dateKey] || { cravings: 0, vapes: 0, logs: [] };
			const newCravingIncrement = cravingLevel ? 1 : 0;
			const newLog: LogEntry = {
				id: `log-${Date.now()}`,
				timestamp: logTimestamp,
				intensity: cravingLevel,
				tags: [...selectedTags],
				vapes: vapeCount
			};
			setHistoryData(prev => ({
				...prev,
				[dateKey]: {
					cravings: existingData.cravings + newCravingIncrement,
					vapes: existingData.vapes + vapeCount,
					logs: [newLog, ...existingData.logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
				}
			}));
		}


		setIsLogged(true);
		setTimeout(() => {
			setIsLogged(false);
			setIsLogging(false);
			setIsSaving(false);
			setCravingLevel(null);
			setSelectedTags([]);
			setVapeCount(0);
			setSelectedDate(new Date());
		}, 1500);
	};

	const getVapeRingClass = (vapes: number, isFuture: boolean) => {
		if (isFuture || vapes === 0) return "border border-transparent";
		if (vapes === 1) return "bg-app-pink/20 border border-app-pink/40";
		return "bg-app-pink/50 border border-app-pink/80";
	};

	const getCravingRingClass = (cravings: number, isFuture: boolean) => {
		if (isFuture) return "bg-transparent";
		if (cravings === 0) return "bg-white/40 border border-transparent";
		if (cravings === 1) return "bg-app-yellow/40 border border-app-yellow/50";
		if (cravings === 2) return "bg-app-yellow/70 border border-app-yellow/80";
		return "bg-app-yellow border border-yellow-400 font-bold shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]";
	};

	const year = viewMonth.getFullYear();
	const month = viewMonth.getMonth();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDayOfMonth = new Date(year, month, 1).getDay();

	const handlePrevMonth = () => setViewMonth(new Date(year, month - 1, 1));
	const handleNextMonth = () => { if (!isViewingCurrentMonth) setViewMonth(new Date(year, month + 1, 1)); };

	const selectedDateKey = formatDateKey(selectedDate);
	const selectedDayStats = historyData[selectedDateKey] || { cravings: 0, vapes: 0, logs: [] };
	const isTodaySelected = formatDateKey(realToday) === selectedDateKey;

	if (isSurging) {
		const renderSurgeContent = () => {
			if (activeSurgeTab === "424" || activeSurgeTab === "box") {
				const config = activeSurgeTab === "424" ? {
					start: { text: "Get ready", circleClass: "scale-100", color: "text-app-purple", border: "border-app-pink", bg: "bg-app-pink/20" },
					inhale: { text: "Breathe in", circleClass: "scale-[1.75] transition-transform duration-[4000ms] ease-out", color: "text-app-purple", border: "border-app-pink", bg: "bg-app-pink/20" },
					hold1: { text: "Hold", circleClass: "scale-[1.75] transition-transform duration-[2000ms] ease-in-out", color: "text-app-purple", border: "border-app-pink", bg: "bg-app-pink/20" },
					exhale: { text: "Breathe out", circleClass: "scale-100 transition-transform duration-[4000ms] ease-in-out", color: "text-app-purple", border: "border-app-pink", bg: "bg-app-pink/20" },
					hold2: { text: "", circleClass: "", color: "", border: "", bg: "" }
				} : {
					start: { text: "Get ready", circleClass: "scale-100 rounded-3xl", color: "text-teal-800", border: "border-app-green", bg: "bg-app-green/20" },
					inhale: { text: "Breathe in", circleClass: "scale-[1.5] transition-transform duration-[4000ms] ease-out rounded-3xl", color: "text-teal-800", border: "border-app-green", bg: "bg-app-green/20" },
					hold1: { text: "Hold", circleClass: "scale-[1.5] transition-transform duration-[4000ms] ease-linear rounded-3xl", color: "text-teal-800", border: "border-app-green", bg: "bg-app-green/20" },
					exhale: { text: "Breathe out", circleClass: "scale-100 transition-transform duration-[4000ms] ease-in rounded-3xl", color: "text-teal-800", border: "border-app-green", bg: "bg-app-green/20" },
					hold2: { text: "Hold empty", circleClass: "scale-100 transition-transform duration-[4000ms] ease-linear rounded-3xl", color: "text-teal-800", border: "border-app-green", bg: "bg-app-green/20" }
				};
				const current = config[breathePhase as keyof typeof config];

				return (
					<div className="flex flex-col items-center justify-center h-[40vh] space-y-12 animate-in fade-in duration-500 overflow-hidden">
						<div className="h-24 flex flex-col items-center justify-center space-y-2">
							<h2 key={breathePhase} className={`font-display text-4xl ${current.color} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
								{current.text}
							</h2>
							<p className="text-3xl font-medium text-neutral-400 font-sans tabular-nums animate-in fade-in duration-300">
								{breathePhase !== "start" ? timeLeft : "..."}
							</p>
						</div>
						<div className="relative flex items-center justify-center w-64 h-64">
							<div className={`absolute w-32 h-32 border-4 flex items-center justify-center ${current.bg} ${current.border} ${activeSurgeTab === "424" ? "rounded-full" : "rounded-3xl"} ${current.circleClass}`}>
								{activeSurgeTab === "424" ? <Wind size={32} className={`text-app-pink ${breathePhase === "start" ? "animate-pulse" : ""}`} /> : <Square size={32} className={`text-app-green ${breathePhase === "start" ? "animate-pulse" : ""}`} />}
							</div>
						</div>
					</div>
				);
			}

			if (activeSurgeTab === "letgo") {
				return (
					<div className="flex flex-col items-center justify-end h-[40vh] w-full animate-in fade-in duration-500 relative overflow-hidden pb-4 px-2">
						<style>{`@keyframes floatUp { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-60vh) scale(1.5); opacity: 0; } } .bubble-float { animation: floatUp 4.5s ease-in forwards; }`}</style>
						{bubbles.map(bubble => (
							<div key={bubble.id} className="absolute bottom-24 bubble-float bg-white border border-neutral-200 shadow-md px-6 py-3 rounded-full text-neutral-700 font-medium z-10 max-w-[80%] text-center">
								{bubble.text}
							</div>
						))}
						<div className="w-full text-center mb-8">
							<h2 className="font-display text-3xl text-neutral-800 mb-2">Let it go</h2>
							<p className="text-neutral-500 text-sm">Type your craving or worry, and send it away.</p>
						</div>
						<form onSubmit={handleLetGo} className="w-full relative z-20">
							<input type="text" value={worryText} onChange={e => setWorryText(e.target.value)} placeholder="I'm feeling..." className="w-full bg-white border border-neutral-200 rounded-full py-4 pl-6 pr-14 text-sm outline-none focus:border-neutral-400 shadow-sm transition-all" />
							<button type="submit" disabled={!worryText.trim()} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${worryText.trim() ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-400"}`}>
								<Send size={18} className={worryText.trim() ? "-translate-y-px translate-x-px" : ""} />
							</button>
						</form>
					</div>
				);
			}

			if (activeSurgeTab === "54321") {
				if (groundingStep >= 5) {
					return (
						<div className="flex flex-col items-center justify-center w-full space-y-6 animate-in zoom-in-95 duration-500">
							<div className="w-20 h-20 bg-app-green/20 text-app-green rounded-full flex items-center justify-center mb-2"><CheckCircle2 size={40} /></div>
							<h2 className="font-display text-3xl text-neutral-800">You are grounded.</h2>
							<button onClick={() => setGroundingStep(0)} className="text-neutral-500 font-medium hover:text-neutral-800 transition-colors">Start over</button>
						</div>
					);
				}
				const current = groundingPrompts[groundingStep];
				const Icon = current.icon;
				return (
					<div className="flex flex-col items-center justify-center w-full animate-in slide-in-from-bottom-4 duration-300">
						<h2 className="font-display text-xl text-neutral-500 mb-4">Take a look around...</h2>
						<div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm w-full text-center space-y-4">
							<div className={`w-12 h-12 mx-auto rounded-2xl ${current.bg} ${current.color} flex items-center justify-center`}><Icon size={24} /></div>
							<div>
								<p className="text-neutral-500 text-sm font-medium mb-1">Name</p>
								<h3 className="font-display text-3xl text-neutral-900 mb-1">{current.num}</h3>
								<p className="text-base text-neutral-700">{current.text}</p>
							</div>
							<button onClick={() => setGroundingStep(p => p + 1)} className="w-full py-3 bg-neutral-900 text-white rounded-xl font-medium shadow-md active:scale-95 transition-transform">Done</button>
						</div>
					</div>
				);
			}

			if (activeSurgeTab === "anchor") {
				return (
					<div className="flex flex-col items-center justify-center h-[40vh] w-full animate-in fade-in duration-500 select-none">
						<div className="text-center mb-12">
							<h2 className="font-display text-3xl text-neutral-800 mb-2">The Anchor</h2>
							<p className="text-neutral-500 text-sm px-4">Press and hold the button below for 10 seconds to physically ground yourself.</p>
						</div>
						<div className="relative w-48 h-48 flex items-center justify-center">
							<svg className="absolute inset-0 w-full h-full transform -rotate-90">
								<circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-neutral-100" />
								<circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-app-purple transition-all duration-100 ease-linear" strokeDasharray="552" strokeDashoffset={552 - (552 * holdProgress) / 100} />
							</svg>
							<button onMouseDown={startAnchorHold} onMouseUp={stopAnchorHold} onMouseLeave={stopAnchorHold} onTouchStart={startAnchorHold} onTouchEnd={stopAnchorHold} className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center gap-2 transition-all duration-300 ${holdProgress === 100 ? "bg-app-purple text-white shadow-xl scale-110" : holdProgress > 0 ? "bg-purple-100 text-purple-900 scale-95" : "bg-white border-2 border-neutral-200 text-neutral-500 shadow-sm"}`}>
								{holdProgress === 100 ? (<><CheckCircle2 size={32} /><span className="font-bold text-sm uppercase tracking-wider">Anchored</span></>) : (<><Hand size={28} className={holdProgress > 0 ? "animate-pulse" : ""} /><span className="font-bold text-xs uppercase tracking-wider">{holdProgress > 0 ? "Hold..." : "Press & Hold"}</span></>)}
							</button>
						</div>
						{holdProgress === 100 && (<button onClick={() => setHoldProgress(0)} className="mt-8 px-6 py-2 bg-neutral-200 rounded-full text-neutral-600 font-medium hover:bg-neutral-300 transition-colors animate-in fade-in">Re-anchor</button>)}
					</div>
				);
			}
		};

		return (
			<div className="fixed inset-0 z-50 bg-neutral-50 overflow-y-auto animate-in slide-in-from-bottom-full duration-300">
				<div className="max-w-md mx-auto min-h-[100dvh] flex flex-col justify-between pt-8 pb-32 px-4 relative">
					<div className="flex justify-between items-center mb-4 shrink-0">
						<h3 className="font-display text-xl text-neutral-800">Grounding Toolkit</h3>
						<button onClick={handleCloseSurge} className="p-2 bg-neutral-200 rounded-full text-neutral-600 hover:bg-neutral-300 transition-colors"><X size={20} /></button>
					</div>
					<div className="flex-1 flex flex-col justify-center">{renderSurgeContent()}</div>
					<div className="space-y-6 mt-8 shrink-0">
						<div>
							<h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 px-2">Toolkit</h4>
							<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
								{[{ id: "424", label: "4-2-4 Breath" }, { id: "box", label: "Box Breath" }, { id: "letgo", label: "Let Go" }, { id: "54321", label: "5-Senses" }, { id: "anchor", label: "Anchor" }].map(tab => (
									<button key={tab.id} onClick={() => setActiveSurgeTab(tab.id as any)} className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${activeSurgeTab === tab.id ? "bg-neutral-900 border-neutral-900 text-white shadow-md" : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-100"}`}>{tab.label}</button>
								))}
							</div>
						</div>
						<button onClick={handleCloseSurge} className="w-full py-4 bg-white border border-neutral-200 text-neutral-800 shadow-sm rounded-2xl font-medium transition-colors active:scale-95">I'm feeling better, exit toolkit</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 relative pb-20">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-3">
					<h1 className="font-display text-3xl text-neutral-800">New Leaf</h1>
					{!user && (
						<div className="flex items-center gap-1 text-[10px] font-bold text-app-yellow uppercase tracking-widest bg-app-yellow/10 px-2 py-1 rounded-md border border-app-yellow/20">
							<AlertCircle size={10} /> Demo Mode - if you don't want to sign up but still want to explore the app, you can use the demo mode!
						</div>
					)}
				</div>
				<button onClick={() => setShowAbout(true)} className="p-2 bg-white/80 backdrop-blur-md border border-neutral-200 rounded-full shadow-sm text-neutral-400 hover:text-neutral-800 transition-colors z-30">
					<Info size={20} />
				</button>
			</div>

			<GrowthEngine totalResisted={totalResisted} />

			<button onClick={() => setIsSurging(true)} className="w-full bg-white/60 backdrop-blur-md border border-app-pink/30 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all active:scale-95 hover:bg-white/80">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-app-pink/20 rounded-full"><AlertCircle className="text-app-pink" size={24} /></div>
					<div className="text-left"><h3 className="font-medium text-neutral-800">I need help right now</h3><p className="text-sm text-neutral-500">Tap for immediate grounding tools</p></div>
				</div>
			</button>

			<button onClick={() => setIsLogging(true)} className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-medium shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
				<Plus size={20} /> Log a craving
			</button>

			<div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-display text-xl text-neutral-800">{viewMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</h3>
					<div className="flex gap-2">
						<button onClick={handlePrevMonth} className="p-1.5 bg-white rounded-lg text-neutral-500 hover:text-neutral-800 shadow-sm transition-colors border border-neutral-100"><ChevronLeft size={18} /></button>
						<button onClick={handleNextMonth} disabled={isViewingCurrentMonth} className={`p-1.5 rounded-lg shadow-sm transition-colors border ${isViewingCurrentMonth ? "bg-neutral-50 border-transparent text-neutral-300 cursor-not-allowed" : "bg-white border-neutral-100 text-neutral-500 hover:text-neutral-800"}`}><ChevronRight size={18} /></button>
					</div>
				</div>

				<div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-medium text-neutral-400">
					<div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
				</div>

				<div className="grid grid-cols-7 gap-2">
					{Array.from({ length: firstDayOfMonth }).map((_, i) => (<div key={`empty-${i}`} className="aspect-square" />))}
					{Array.from({ length: daysInMonth }).map((_, i) => {
						const dayNum = i + 1;
						const loopDate = new Date(year, month, dayNum);
						const loopDateKey = formatDateKey(loopDate);
						const stats = historyData[loopDateKey] || { cravings: 0, vapes: 0, logs: [] };
						const isActiveDay = selectedDateKey === loopDateKey;
						const isFuture = loopDate.getTime() > realToday.getTime();

						return (
							<button key={dayNum} onClick={() => !isFuture && setPopupDate(loopDate)} disabled={isFuture} className={`flex items-center justify-center aspect-square transition-all ${isFuture ? "opacity-30 cursor-not-allowed grayscale" : ""}`}>
								<div className={`w-full h-full rounded-full flex items-center justify-center p-0.5 transition-all ${getVapeRingClass(stats.vapes, isFuture)} ${isActiveDay && !isFuture ? "ring-2 ring-neutral-400 ring-offset-1" : ""}`}>
									<div className={`w-full h-full rounded-full flex items-center justify-center transition-all ${getCravingRingClass(stats.cravings, isFuture)}`}>
										<span className={`text-xs font-medium ${isFuture ? 'text-neutral-400' : stats.cravings >= 3 ? 'text-yellow-950' : 'text-neutral-700'}`}>{dayNum}</span>
									</div>
								</div>
							</button>
						);
					})}
				</div>
				<div className="mt-6 p-4 bg-emerald-50 rounded-xl text-center border border-emerald-100">
					<p className="text-teal-900 font-medium">{isTodaySelected ? "Today" : `On ${selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`}, you had <span className="font-bold">{selectedDayStats.cravings} cravings</span>.</p>
				</div>
			</div>

			{/* Popups and Modals */}
			{popupDate !== null && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/20 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200">
						<div className="flex justify-between items-center mb-6">
							<h3 className="font-display text-2xl text-neutral-800">{popupDate.toLocaleDateString('default', { month: 'long', day: 'numeric' })}</h3>
							<button onClick={() => setPopupDate(null)} className="p-2 bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-800"><X size={16} /></button>
						</div>
						<div className="space-y-4 mb-8">
							<div className="flex justify-between items-center p-4 bg-app-yellow/40 rounded-2xl border border-app-yellow/50">
								<span className="font-medium text-yellow-900">Total Cravings</span><span className="text-xl font-bold text-yellow-900">{historyData[formatDateKey(popupDate)]?.cravings || 0}</span>
							</div>
							<div className="flex justify-between items-center p-4 bg-app-pink/30 rounded-2xl border border-app-pink/40">
								<span className="font-medium text-pink-900">Times Vaped</span><span className="text-xl font-bold text-pink-900">{historyData[formatDateKey(popupDate)]?.vapes || 0}</span>
							</div>
						</div>
						<div className="space-y-3">
							{(historyData[formatDateKey(popupDate)]?.logs?.length || 0) > 0 && (
								<button onClick={() => { setViewingTimelineDate(popupDate); setPopupDate(null); }} className="w-full py-3 bg-neutral-100 text-neutral-800 rounded-xl font-medium border border-neutral-200 hover:bg-neutral-200 transition-colors">View detailed logs</button>
							)}
							<button onClick={() => { setSelectedDate(popupDate); setPopupDate(null); setIsLogging(true); }} className="w-full py-3 bg-neutral-900 text-white rounded-xl font-medium shadow-md">Log entry for this day</button>
						</div>
					</div>
				</div>
			)}

			{viewingTimelineDate !== null && (
				<div className="fixed inset-0 z-50 bg-neutral-50 overflow-y-auto pb-24 animate-in slide-in-from-bottom-full duration-300">
					<div className="max-w-md mx-auto p-4 pt-12 space-y-6">
						<div className="flex justify-between items-center mb-4">
							<div><h3 className="font-display text-3xl text-neutral-800">Timeline</h3><p className="text-neutral-500">{viewingTimelineDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}</p></div>
							<button onClick={() => setViewingTimelineDate(null)} className="p-2 bg-neutral-200 rounded-full text-neutral-600 hover:bg-neutral-300 transition-colors"><X size={20} /></button>
						</div>
						<div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-300 before:to-transparent">
							{historyData[formatDateKey(viewingTimelineDate)]?.logs.map((log) => (
								<div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
									<div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-neutral-50 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"><Clock size={16} className="text-neutral-400" /></div>
									<div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3">
										<div className="flex justify-between items-start">
											<span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
											{log.intensity && <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getIntensityBadge(log.intensity)}`}>{log.intensity}</span>}
										</div>
										{log.tags.length > 0 && (
											<div className="flex flex-wrap gap-1.5">{log.tags.map(tagId => {
												const config = getTagConfig(tagId); return <span key={tagId} className={`px-2 py-1 rounded-md text-[11px] font-medium border ${config.activeClass}`}>{config.label}</span>;
											})}</div>
										)}
										{log.vapes > 0 && (<div className="flex items-center gap-1.5 text-xs font-medium text-pink-700 bg-app-pink/10 p-2 rounded-lg border border-app-pink/20"><Activity size={14} /> Vaped {log.vapes} time{log.vapes > 1 ? 's' : ''}</div>)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{isLogging && (
				<div className="fixed inset-0 z-50 bg-neutral-50 overflow-y-auto pb-24 animate-in slide-in-from-bottom-full duration-300">
					<div className="max-w-md mx-auto p-4 space-y-8 pt-12">
						<div className="flex justify-between items-center">
							<div><h3 className="font-display text-3xl text-neutral-800">Log your state</h3><p className="text-neutral-500 font-medium">{isTodaySelected ? "Right now" : `For ${selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`}</p></div>
							<button onClick={() => setIsLogging(false)} className="p-2 bg-neutral-200 rounded-full text-neutral-600 hover:bg-neutral-300 transition-colors"><X size={20} /></button>
						</div>
						<div className="space-y-8">
							<div className="flex items-center justify-between bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm">
								<span className="text-sm font-medium text-neutral-700 max-w-[60%]">Did you vape? How many times?</span>
								<div className="flex items-center gap-3">
									<button onClick={() => setVapeCount(Math.max(0, vapeCount - 1))} className="p-2 bg-neutral-100 rounded-xl text-neutral-500 hover:text-neutral-800 transition-colors"><Minus size={16} /></button>
									<span className="w-6 text-center font-bold text-lg text-neutral-800">{vapeCount}</span>
									<button onClick={() => setVapeCount(vapeCount + 1)} className="p-2 bg-neutral-100 rounded-xl text-neutral-800 hover:bg-neutral-200 transition-colors"><Plus size={16} /></button>
								</div>
							</div>
							<div>
								<h4 className="text-sm font-medium text-neutral-700 mb-3">How intense is the craving?</h4>
								<div className="flex flex-col gap-3">
									{intensityOptions.map((level) => (
										<button key={level.id} onClick={() => setCravingLevel(level.id)} className={`w-full py-4 px-5 rounded-2xl text-sm font-medium transition-all text-left border ${cravingLevel === level.id ? `${level.activeClass} ring-2 ring-offset-2 ring-offset-neutral-50` : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"}`}><span className="font-bold mr-2">{level.id}:</span> {level.label}</button>
									))}
								</div>
							</div>
							<div>
								<h4 className="text-sm font-medium text-neutral-700 mb-3">What's going on right now?</h4>
								<div className="flex flex-wrap gap-2">
									{contextOptions.map((tag) => {
										const isSelected = selectedTags.includes(tag.id);
										return <button key={tag.id} onClick={() => toggleTag(tag.id)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${isSelected ? `${tag.activeClass} shadow-sm` : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}>{tag.label}</button>;
									})}
								</div>
							</div>
							<button disabled={(!cravingLevel && vapeCount === 0) || isSaving} onClick={handleLog} className={`w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all ${isLogged ? "bg-app-green text-teal-900" : (cravingLevel || vapeCount > 0) ? "bg-neutral-900 text-white shadow-xl" : "bg-neutral-200 text-neutral-400 cursor-not-allowed"}`}>
								{isLogged ? (<><CheckCircle2 size={20} /> Saved to {user ? 'Cloud' : 'Demo'}</>) : isSaving ? "Saving..." : "Save log"}
							</button>
						</div>
					</div>
				</div>
			)}

			{showAbout && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/20 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 border border-neutral-100">
						<div className="flex justify-between items-center mb-6">
							<h3 className="font-display text-2xl text-neutral-800">About this project</h3>
							<button onClick={() => setShowAbout(false)} className="p-2 bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-800 transition-colors"><X size={16} /></button>
						</div>
						<div className="space-y-4 text-xs text-neutral-700 leading-relaxed mb-8">
							<p>New Leaf was developed as a project for my high school's TUPE (Tobacco-Use Prevention Education) initiative, where students were encouraged to create an app/website that addresses the issue of teen tobacco/vape use.</p>
							<p>As a student, I noticed that traditional quitting apps rely heavily on streak counters. When a user slips up, the counter resets to zero, which induces shame. This is ineffective because it lacks empathy for the fact that addiction is a neurobiological condition. The shame from breaking a streak can lead to feelings of hopelessness, which is counterproductive to recovery.</p>
							<p>I built this application to provide a more compassionate alternative to existing solutions. Instead of focusing on streaks, it emphasizes reflection, allowing users to track their cravings and triggers without judgment. The goal is to empower users to understand their patterns and progress in a postive way.</p>
						</div>
						<button onClick={() => setShowAbout(false)} className="w-full py-3 bg-neutral-900 text-white rounded-xl font-medium shadow-md active:scale-95 transition-transform">Close</button>
					</div>
				</div>
			)}
		</div>
	);
}