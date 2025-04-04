"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { FiLock, FiUser, FiHeart } from "react-icons/fi";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Redirect to homepage on successful login
      router.push("/");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg bg-white/90 backdrop-blur-sm relative overflow-visible rounded-2xl border border-pink-100 p-2">
      {/* Add more decorative floating hearts inside the card */}
      <div className="absolute top-6 right-6 text-pink-300 text-xl opacity-50 z-10 animate-pulse">❤</div>
      <div className="absolute bottom-10 left-8 text-pink-300 text-xl opacity-50 z-10 animate-pulse" style={{ animationDelay: "1s" }}>❤</div>
      <div className="absolute top-12 left-6 text-pink-200 text-sm opacity-40 z-10 animate-pulse" style={{ animationDelay: "0.5s" }}>❤</div>
      <div className="absolute bottom-16 right-10 text-pink-200 text-sm opacity-40 z-10 animate-pulse" style={{ animationDelay: "1.5s" }}>❤</div>
      
      {/* Add a soft glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 to-purple-100/20 rounded-2xl"></div>
      
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center shadow-inner border border-pink-200">
            <FiHeart className="h-8 w-8 text-pink-500" strokeWidth={1.5} />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-pink-500">Welcome Back</CardTitle>
        <CardDescription className="text-pink-400/80">
          Enter your credentials to access your romantic space
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm bg-red-50 text-red-500 rounded-lg border border-red-200 animate-pulse">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-pink-700">
              Username
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FiUser className="h-4 w-4 text-pink-400" />
              </div>
              <Input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="pl-10 bg-pink-50/50 border-pink-200 focus:border-pink-300 focus:ring-pink-200 rounded-xl"
                disabled={isLoading}
                placeholder="Enter your username"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-pink-700">
                Password
              </Label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FiLock className="h-4 w-4 text-pink-400" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="pl-10 bg-pink-50/50 border-pink-200 focus:border-pink-300 focus:ring-pink-200 rounded-xl"
                disabled={isLoading}
                placeholder="Enter your password"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-medium rounded-xl py-2.5 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 border-none"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Sign In with Love ❤️"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-center text-pink-400 mt-2">
          Protected by our love and security ❤️
        </p>
        <div className="flex justify-center mt-3 space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-pink-200"></span>
          <span className="inline-block w-2 h-2 rounded-full bg-pink-300"></span>
          <span className="inline-block w-2 h-2 rounded-full bg-pink-400"></span>
        </div>
      </CardFooter>
    </Card>
  );
}