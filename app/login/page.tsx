"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GobackButton from "../../components/GobackButton";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const { user, loginGoogle, loginEmail, logout } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (provider: string) => {
    let result;
    if (provider === "google") {
      result = await loginGoogle();
    } else {
      result = await loginEmail(email, password);
    }

    if (result.success) {
      toast.success("Logged in successfully!");
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <Button onClick={logout}>Logout</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-8">
          <GobackButton destination="/" />
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600">Sign in to access your recipes</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
              onClick={() => handleLogin("google")}
            >
              <FcGoogle className="w-5 h-5" /> Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <div className="space-y-3 text-black">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="w-full bg-neutral-600 hover:bg-gray-700 text-white"
                onClick={() => handleLogin("email")}
              >
                Sign In
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link
                href="/create-account"
                className="text-gray-800 hover:underline font-medium"
              >
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
