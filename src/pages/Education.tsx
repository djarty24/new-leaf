import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AlertTriangle, Clock, ChevronLeft, ArrowRight, Brain, Wind, Coffee, Search, HeartPulse } from "lucide-react";

const mockArticles = [
	{
		id: 1,
		title: "Urge Surfing: The Clinical Approach to Craving Management",
		category: "Coping Strategies",
		readTime: "6 min read",
		author: "Dr. Sarah Chen, Behavioral Psychologist",
		date: "April 10, 2026",
		imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
		icon: Wind,
		colorClass: "bg-app-pink/10 border-app-pink/30 text-pink-900",
		iconBg: "bg-app-pink/20 text-app-pink",
		content: `
Cravings are often perceived as escalating physical necessities, but neurological models demonstrate they are transient physiological states. The acute peak of a nicotine craving typically resolves within three to five minutes, provided the neurological loop is not fed by acute panic or internal resistance.

The concept of "Urge Surfing" was developed by Dr. G. Alan Marlatt, a pioneer in the field of addiction and relapse prevention at the University of Washington. His clinical research demonstrated that attempting to actively suppress a craving often exacerbates the psychological distress associated with it.

> "Urges are like ocean waves. They start small, crest, and then subside. By accepting the urge and observing it without acting on it, you allow the wave to run its natural course." — Dr. G. Alan Marlatt

### Implementation of the Technique

Instead of deploying willpower to fight the sensation, patients are taught to observe it objectively using mindfulness protocols.

1. **Acknowledge the physical sensation:** Identify where the somatic stress is located (e.g., tension in the jaw, a fluttering in the chest) without assigning a moral judgment to it.
2. **Observe the trajectory:** Recognize that the sensation is currently peaking and will inevitably decay.
3. **Detachment:** Breathe continuously and observe the physiological symptoms as a biological process occurring in the body, rather than an imperative command that must be obeyed.

> "Fighting a craving is akin to struggling in quicksand; the psychological resistance only serves to pull you under. Observation creates the necessary cognitive distance." — Dr. G. Alan Marlatt

By repeatedly allowing cravings to peak and subside without nicotine administration, the brain undergoes "extinction learning," effectively weakening the trigger-response association over time.
    `
	},
	{
		id: 2,
		title: "Neuroadaptation: Nicotine's Effect on Brain Chemistry",
		category: "The Science",
		readTime: "8 min read",
		author: "James Wilson, Neuroscience Researcher",
		date: "April 12, 2026",
		imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
		icon: Brain,
		colorClass: "bg-app-purple/10 border-app-purple/30 text-purple-900",
		iconBg: "bg-app-purple/20 text-app-purple",
		content: `
Nicotine dependency is not a failure of character; it is a fundamental alteration of neurochemistry. When nicotine binds to nicotinic acetylcholine receptors in the brain, it triggers an unnatural, highly concentrated release of dopamine. Over time, the brain attempts to maintain homeostasis by downregulating its own natural dopamine production.

Dr. Nora Volkow, Director of the National Institute on Drug Abuse (NIDA), has extensively documented how chronic exposure to stimulants alters the brain's reward circuits.

> "Repeated drug exposure alters the brain's reward circuits, essentially blunting the individual's response to natural, everyday reinforcers. The brain becomes reliant on the external chemical to function at a baseline level." — Dr. Nora Volkow

### The Timeline of Neurological Recovery

When nicotine is removed, the brain is temporarily left with a dopamine deficit, resulting in anhedonia (the inability to feel pleasure), lethargy, and heightened anxiety. Understanding the biological timeline of recovery can mitigate the distress of early cessation.

* **0 to 72 Hours:** Nicotine and its metabolites are cleared from the bloodstream. Physical withdrawal symptoms peak during this window as the brain registers the chemical absence.
* **14 to 30 Days:** Neuroplasticity initiates receptor upregulation. Dopamine receptors begin to return to pre-exposure density. Patients typically report a stabilization in baseline mood and a reduction in generalized anxiety.
* **90 Days and Beyond:** The dopaminergic pathways have largely normalized. Cravings are no longer driven by physical withdrawal, but rather by lingering behavioral associations.

> "The brain is remarkably plastic. While the neurological changes caused by addiction are profound, they are not permanent. Abstinence allows the neurochemistry to recalibrate and heal." — Dr. Nora Volkow
    `
	},
	{
		id: 3,
		title: "Behavioral Replacement: The Science of Habit Loops",
		category: "Psychology",
		readTime: "7 min read",
		author: "Dr. Judson Brewer, MD, PhD",
		date: "April 14, 2026",
		imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
		icon: Coffee,
		colorClass: "bg-app-yellow/20 border-app-yellow/40 text-yellow-900",
		iconBg: "bg-app-yellow/40 text-yellow-900",
		content: `
Addiction relies heavily on the "Cue-Routine-Reward" feedback loop initially identified by behavioral psychologists. A specific cue (stress) triggers a routine (vaping), which delivers a reward (dopamine release). To effectively dismantle a habit, clinical evidence suggests that attempting to suppress the routine is less effective than replacing it.

Dr. Judson Brewer, the Director of Research and Innovation at Brown University's Mindfulness Center, emphasizes that willpower alone is insufficient for long-term behavioral change.

> "We cannot simply think our way out of a habit; we have to leverage the brain's own reward-based learning system against itself. We must update the reward value of the behavior." — Dr. Judson Brewer

### Designing a Replacement Strategy

When nicotine is removed, the established cue still demands a routine. Formulating a pre-determined "Dopamine Menu" ensures that healthy, accessible behaviors are readily available to satisfy the neurological loop.

* **Immediate Interventions (1-5 minutes):** Activities designed to alter immediate physiology, such as consuming ice water, utilizing tactical breathing, or engaging in brief, intense physical exertion.
* **Sustained Interventions (30+ minutes):** Activities designed to naturally elevate dopamine over an extended period, such as aerobic exercise, engaging in complex tasks, or social interaction.

> "Habits form because our brain is looking for the path of least resistance to a reward. By mapping out alternative behaviors beforehand, we reduce the cognitive load required to make a healthy choice when a trigger occurs." — Dr. Judson Brewer
    `
	},
	{
		id: 4,
		title: "Context-Dependent Memory and Environmental Cues",
		category: "Behavioral Science",
		readTime: "6 min read",
		author: "Dr. Marcus Thorne",
		date: "April 15, 2026",
		imageUrl: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=800&q=80",
		icon: Search,
		colorClass: "bg-blue-100 border-blue-300 text-blue-900",
		iconBg: "bg-blue-200 text-blue-700",
		content: `
Patients frequently report experiencing intense, unexpected cravings despite feeling no acute physical withdrawal. This phenomenon is explained by "Context-Dependent Memory" and classical conditioning, mechanisms originally observed in B.F. Skinner's operant conditioning models.

The brain meticulously catalogues the environmental data present during dopamine release. Over time, the environment itself becomes a conditioned stimulus.

> "Environmental cues associated with chronic substance use can trigger conditioned physiological responses and intense cravings, entirely independent of physical withdrawal." — The American Psychological Association

### Mitigating Cue Reactivity

If a patient consistently vapes in their car or at a specific desk, simply occupying those spaces will trigger the brain to anticipate nicotine administration. This anticipatory state physically manifests as a craving.

To disrupt this association, environmental modification is required:

1. **Alter the Context:** Rearrange furniture, change the route taken to work, or alter the sensory inputs (e.g., lighting, scent) in areas heavily associated with previous usage.
2. **Break the Chronological Chain:** If usage historically occurred immediately after waking, inserting a new mandatory behavior (such as taking a shower immediately) disrupts the established routine chain.

> "We do not operate in a vacuum. Our environments act as invisible architectures for our habits. If you want to change the behavior permanently, you must first redesign the environment that cues it." — James Clear, Behavioral Researcher
    `
	},
	{
		id: 5,
		title: "The Efficacy of Self-Compassion in Relapse Prevention",
		category: "Mindset",
		readTime: "7 min read",
		author: "Elena Rodriguez, MSW",
		date: "April 16, 2026",
		imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
		icon: HeartPulse,
		colorClass: "bg-emerald-100 border-emerald-300 text-emerald-900",
		iconBg: "bg-emerald-200 text-emerald-700",
		content: `
Traditional, punitive models of addiction recovery rely on strict continuous abstinence tracking, where any lapse results in a total reset of progress. While intended to motivate, longitudinal psychological studies indicate that shame is a primary driver of sustained relapse.

Dr. Kelly McGonigal, a health psychologist at Stanford University, identifies this as the "What the Hell" effect.

> "The 'What the Hell' effect occurs when we view a minor setback as a total failure. The resulting shame drives us back to the exact behavior we were trying to avoid as a mechanism for comfort, leading to a total abandonment of our goals." — Dr. Kelly McGonigal

### The Clinical Value of Self-Compassion

Research conducted by Dr. Kristin Neff at the University of Texas demonstrates that self-compassion is fundamentally distinct from self-indulgence. It is a robust psychological tool that enhances resilience and personal accountability following a failure.

> "Self-compassion does not lower our standards; it provides the psychological safety needed to actually learn from our mistakes without being paralyzed by self-criticism." — Dr. Kristin Neff

When a lapse occurs, clinical best practices recommend shifting the focus from moral failure to data acquisition. By removing the shame associated with the event, the individual can objectively analyze the variables that led to the lapse (e.g., specific stressors, environmental cues) and adjust their behavioral strategies accordingly.
    `
	}
];

export default function Education() {
	const [activeArticleId, setActiveArticleId] = useState<number | null>(null);

	const activeArticle = mockArticles.find(a => a.id === activeArticleId);

	if (activeArticle) {
		return (
			<div className="space-y-6 animate-in slide-in-from-right-8 duration-300 pb-20 relative min-h-[100dvh]">
				<button
					onClick={() => setActiveArticleId(null)}
					className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 transition-colors pt-2"
				>
					<ChevronLeft size={20} />
					<span className="font-medium text-sm">Back to Library</span>
				</button>

				<div className="w-full h-56 rounded-3xl overflow-hidden bg-neutral-200 mt-4 shadow-sm border border-neutral-100">
					<img
						src={activeArticle.imageUrl}
						alt={activeArticle.title}
						className="w-full h-full object-cover"
					/>
				</div>

				<div className="space-y-5 pt-4">
					<div className="flex items-center gap-3">
						<span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${activeArticle.colorClass}`}>
							{activeArticle.category}
						</span>
						<span className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
							<Clock size={12} />
							{activeArticle.readTime}
						</span>
					</div>

					<h1 className="font-display text-4xl text-neutral-900 leading-tight">
						{activeArticle.title}
					</h1>

					<div className="flex items-center gap-2 text-sm text-neutral-500 font-medium pb-4 border-b border-neutral-200">
						<span>By {activeArticle.author}</span>
						<span>•</span>
						<span>{activeArticle.date}</span>
					</div>
				</div>

				<div className="pt-2 pb-12">
					{/* CSS styling for the article content: 
						[&_p]:mb-6 forces a bottom margin on all paragraphs.
						[&_blockquote] styles the clinical citations.
						[&_ol] and [&_li] style the numbered lists.
					*/}
					<div className="text-neutral-700 leading-loose [&_p]:mb-6 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-neutral-900 [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-800 [&_blockquote]:bg-neutral-50 [&_blockquote]:py-3 [&_blockquote]:px-5 [&_blockquote]:my-8 [&_blockquote]:rounded-r-2xl [&_blockquote_p]:mb-0 [&_blockquote_p]:font-medium [&_blockquote_p]:text-neutral-900 [&_strong]:text-neutral-900 [&_strong]:font-bold">
						<ReactMarkdown>
							{activeArticle.content}
						</ReactMarkdown>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-500 pb-20">
			<div>
				<h1 className="font-display text-3xl text-neutral-800">Learn</h1>
				<p className="text-neutral-500 mt-1">Evidence-based resources for your recovery.</p>
			</div>

			<div className="bg-app-yellow/10 border border-app-yellow/40 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
				<AlertTriangle className="text-yellow-700 shrink-0 mt-0.5" size={20} />
				<div>
					<h4 className="text-sm font-bold text-yellow-900 uppercase tracking-wider mb-1">Demo Placeholder</h4>
					<p className="text-xs text-yellow-800/90 leading-relaxed font-medium">
						The articles below are placeholders for now. I'm working to contact addiction experts to feature peer-reviewed resources specifically for teen tobacco/vape use. <strong>This is not medical advice!</strong>
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
									<h4 className="font-medium text-neutral-800 leading-snug group-hover:text-neutral-900 mb-1.5">
										{article.title}
									</h4>
									<p className="text-xs text-neutral-500 font-medium">
										{article.author}
									</p>
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