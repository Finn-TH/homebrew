export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#8B4513]">
            Check your email
          </h2>
          <p className="text-[#A0522D]/60">
            We've sent you an email with a confirmation link. Please check your
            inbox and click the link to verify your account.
          </p>
        </div>
      </div>
    </div>
  );
}
