import { Metadata } from "next";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login - Our Romantic Space",
  description: "Login to access our cute and romantic photo gallery",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff5f7] px-4 bg-gradient-to-b from-[#fff5f7] to-[#ffebf1]">
      <div className="romantic-card w-full max-w-md relative p-2 transition-all duration-300 hover:scale-[1.01] animate-fadeIn">
        {/* Decorative hearts with transparency */}
        <div className="absolute -top-6 -left-6 text-pink-300 text-4xl opacity-70 z-10">❤</div>
        <div className="absolute -bottom-6 -right-6 text-pink-300 text-4xl opacity-70 z-10">❤</div>
        <div className="absolute top-10 -right-4 text-pink-200 text-2xl opacity-80 z-10">❤</div>
        <div className="absolute bottom-10 -left-4 text-pink-200 text-2xl opacity-80 z-10">❤</div>
        
        <div className="space-y-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}