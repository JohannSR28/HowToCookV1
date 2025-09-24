"use client";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GobackButton from "../../components/GobackButton";
import { toast } from "react-toastify";

export default function CreateAccountPage() {
  const { user, logout, createAccount } = useUser();

  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = async () => {
    const result = await createAccount(name, email, password, confirmPassword);
    if (result.success) {
      toast.success("Account created successfully!");
    } else {
      toast.error(result.error || "Account creation failed");
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
              Create Account
            </CardTitle>
            <p className="text-gray-600">Join our cooking community</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-black">
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                className="w-full bg-neutral-600 hover:bg-gray-700 text-white"
                onClick={handleCreateAccount}
              >
                Create Account
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-gray-800 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
