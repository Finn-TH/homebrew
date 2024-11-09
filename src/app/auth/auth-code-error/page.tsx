import Link from "next/link";

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#8B4513]">
            Authentication Error
          </h2>
          <p className="text-[#A0522D]/60">
            There was an error processing your request. Please try again.
          </p>
          <Link
            href="/login"
            className="block mt-4 text-[#8B4513] hover:underline"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
