import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { X, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Check if user just clicked the email link
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
            }, 2000);
          })
          .catch((error) => {
            setStatus("error");
            setErrorMessage(error.message);
          });
      }
    }
  }, [onClose]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    
    const actionCodeSettings = {
      // URL you want to redirect back to. Change this when you deploy!
      url: "http://localhost:5173",
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-800 transition-colors">
          <X size={16} />
        </button>

        <div className="mb-8">
          <h2 className="font-display text-3xl text-neutral-900 mb-2">Sign In</h2>
          <p className="text-neutral-500 text-sm">No passwords required. We will send a secure link to your inbox.</p>
        </div>

        {status === "sent" ? (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Check your email</h3>
            <p className="text-neutral-600 text-sm">We sent a magic link to {email}. Click it to securely sign in.</p>
          </div>
        ) : status === "success" ? (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Successfully signed in!</h3>
          </div>
        ) : (
          <form onSubmit={handleSendLink} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-4 px-5 outline-none focus:border-neutral-400 focus:bg-white transition-all text-neutral-800"
              />
            </div>

            {status === "error" && (
              <p className="text-red-500 text-xs font-medium px-1">{errorMessage}</p>
            )}

            <button 
              type="submit" 
              disabled={status === "loading" || !email.trim()}
              className="w-full py-4 bg-neutral-900 text-white rounded-xl font-medium shadow-md hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send Magic Link"}
              <ArrowRight size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}