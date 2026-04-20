import { useState, useEffect } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signInWithPopup } from "firebase/auth";
import { X, Mail, ArrowRight, CheckCircle2, Zap } from "lucide-react";

type AuthModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "sent" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (isSignInWithEmailLink(auth, window.location.href)) {
			setStatus("loading");
			let savedEmail = window.localStorage.getItem("emailForSignIn");

			if (!savedEmail) {
				savedEmail = window.prompt("Please provide your email for confirmation");
			}

			if (savedEmail) {
				signInWithEmailLink(auth, savedEmail, window.location.href)
					.then(() => {
						window.localStorage.removeItem("emailForSignIn");
						setStatus("success");
						setTimeout(() => {
							onClose();
							window.location.href = "/";
						}, 2000);
					})
					.catch((error) => {
						setStatus("error");
						setErrorMessage(error.message);
					});
			}
		}
	}, [onClose]);

	// Handle Google Sign-In
	const handleGoogleSignIn = async () => {
		try {
			setStatus("loading");
			await signInWithPopup(auth, googleProvider);
			setStatus("success");
			setTimeout(() => {
				onClose();
			}, 1000);
		} catch (error: any) {
			setStatus("error");
			setErrorMessage(error.message);
		}
	};

	const handleSendLink = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;

		setStatus("loading");

		const actionCodeSettings = {
			url: window.location.origin,
			handleCodeInApp: true,
		};

		try {
			await sendSignInLinkToEmail(auth, email, actionCodeSettings);
			window.localStorage.setItem("emailForSignIn", email);
			setStatus("sent");
		} catch (error: any) {
			setStatus("error");
			setErrorMessage(error.message);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative border border-neutral-100">
				<button onClick={onClose} className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-800 transition-colors">
					<X size={16} />
				</button>

				<div className="mb-8">
					<h2 className="font-display text-3xl text-neutral-900 mb-2">Welcome</h2>
					<p className="text-neutral-500 text-sm leading-relaxed">Sign in to save your progress to the cloud, or continue as a guest to explore.</p>
				</div>

				{status === "sent" ? (
					<div className="text-center py-6 animate-in zoom-in-95">
						<div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<Mail size={32} />
						</div>
						<h3 className="text-xl font-bold text-neutral-900 mb-2">Check your email</h3>
						<p className="text-neutral-600 text-sm">We sent a magic link to <strong>{email}</strong>. Click it to securely sign in.</p>
					</div>
				) : status === "success" ? (
					<div className="text-center py-6 animate-in zoom-in-95">
						<div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<CheckCircle2 size={32} />
						</div>
						<h3 className="text-xl font-bold text-neutral-900">Successfully signed in!</h3>
					</div>
				) : (
					<div className="space-y-6">

						{/* NEW: Google Sign-In Button */}
						<button
							onClick={handleGoogleSignIn}
							disabled={status === "loading"}
							className="w-full py-4 bg-white border border-neutral-200 text-neutral-800 rounded-xl font-medium shadow-sm hover:bg-neutral-50 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
						>
							<svg className="w-5 h-5" viewBox="0 0 24 24">
								<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
								<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
								<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
								<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
							</svg>
							Continue with Google
						</button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center"><span className="w-full border-t border-neutral-100"></span></div>
							<div className="relative flex justify-center text-xs uppercase tracking-tighter"><span className="bg-white px-2 text-neutral-300">or</span></div>
						</div>

						<form onSubmit={handleSendLink} className="space-y-4">
							<div>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="hello@example.com"
									className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-4 px-5 outline-none focus:border-neutral-400 focus:bg-white transition-all text-neutral-800"
								/>
							</div>

							{status === "error" && (
								<p className="text-red-500 text-xs font-medium px-1 bg-red-50 py-2 rounded-lg border border-red-100">{errorMessage}</p>
							)}

							<button
								type="submit"
								disabled={status === "loading" || !email.trim()}
								className="w-full py-4 bg-neutral-900 text-white rounded-xl font-medium shadow-md hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
							>
								Send Magic Link
								<ArrowRight size={18} />
							</button>
						</form>

						<div className="relative pt-2">
							<button
								onClick={onClose}
								className="w-full py-3 flex items-center justify-center gap-2 text-neutral-500 text-sm font-medium hover:text-neutral-900 transition-colors group"
							>
								<Zap size={16} className="text-app-yellow group-hover:fill-app-yellow transition-all" />
								Continue as Guest - For Sleepover project reviewers, you can use the demo mode to see the features of the app without signing up
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}