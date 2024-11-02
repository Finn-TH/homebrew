import { Github } from "lucide-react";
import { signInWithGithub } from "./actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#8B4513]">
            Welcome to HomeBrew
          </h2>
          <p className="text-[#A0522D]/60">Sign in to start brewing</p>
        </div>

        <form action={signInWithGithub}>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#8B4513] rounded-lg hover:bg-[#8B4513]/5 transition-colors">
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
