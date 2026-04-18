import { Leaf, Sprout, TreeDeciduous, Award, ChevronRight } from "lucide-react";

type GrowthEngineProps = {
	totalResisted: number;
};

export default function GrowthEngine({ totalResisted }: GrowthEngineProps) {
	const stages = [
		{ threshold: 0, name: "The Seed", icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-50", border: "border-emerald-200", message: "Every forest starts with a single seed." },
		{ threshold: 5, name: "The Sprout", icon: Sprout, color: "text-app-green", bg: "bg-app-green/10", border: "border-app-green/30", message: "Keep going, roots are beginning to grow." },
		{ threshold: 15, name: "The Sapling", icon: TreeDeciduous, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", message: "You are growing stronger every day." },
		{ threshold: 30, name: "The Mighty Tree", icon: Award, color: "text-app-purple", bg: "bg-app-purple/10", border: "border-app-purple/30", message: "Deeply rooted. Unshakable." },
	];

	let currentStageIndex = 0;
	for (let i = 0; i < stages.length; i++) {
		if (totalResisted >= stages[i].threshold) {
			currentStageIndex = i;
		}
	}

	const currentStage = stages[currentStageIndex];
	const nextStage = currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : null;
	const CurrentIcon = currentStage.icon;

	let progressPercentage = 100;
	let remainingForNext = 0;

	if (nextStage) {
		const range = nextStage.threshold - currentStage.threshold;
		const progressIntoStage = totalResisted - currentStage.threshold;
		progressPercentage = (progressIntoStage / range) * 100;
		remainingForNext = nextStage.threshold - totalResisted;
	}

	return (
		<div className={`w-full border rounded-3xl p-6 transition-all shadow-sm ${currentStage.bg} ${currentStage.border}`}>
			<div className="flex justify-between items-start mb-6">
				<div>
					<h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Your Growth</h3>
					<h2 className={`font-display text-2xl ${currentStage.color.replace('text-', 'text-').replace('-400', '-700')}`}>
						{currentStage.name}
					</h2>
				</div>
				<div className={`w-16 h-16 rounded-2xl bg-white shadow-sm border ${currentStage.border} flex items-center justify-center ${currentStage.color}`}>
					<CurrentIcon size={32} />
				</div>
			</div>

			<p className="text-sm font-medium text-neutral-700 mb-6">
				"{currentStage.message}"
			</p>

			<div className="space-y-2">
				<div className="flex justify-between items-end text-xs font-bold uppercase tracking-wider">
					<span className="text-neutral-500">{totalResisted} Resisted</span>
					{nextStage ? (
						<span className="text-neutral-400 text-[10px]">{remainingForNext} more to next stage</span>
					) : (
						<span className="text-app-purple">Max Level</span>
					)}
				</div>

				<div className="h-3 w-full bg-white rounded-full overflow-hidden border border-neutral-200/50">
					<div
						className={`h-full ${currentStage.color.replace('text-', 'bg-')} transition-all duration-1000 ease-out rounded-full`}
						style={{ width: `${progressPercentage}%` }}
					/>
				</div>
			</div>

			{nextStage && (
				<button className="w-full mt-6 py-3 bg-white/50 hover:bg-white transition-colors border border-white/60 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-center gap-1 group">
					Next: {nextStage.name} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
				</button>
			)}
		</div>
	);
}