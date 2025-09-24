"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  loginWithGoogle,
  loginWithEmail,
  createNewAccount,
} from "@/lib/api-function/test";

type User = {
  id: string;
  name: string;
  email: string;
  provider: string;
};

type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string };

type UserContextType = {
  user: User | null;
  loginGoogle: () => Promise<AuthResult>;
  loginEmail: (email: string, password: string) => Promise<AuthResult>;
  createAccount: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<AuthResult>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type Props = { children: ReactNode };

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  async function loginEmail(
    email: string,
    password: string
  ): Promise<AuthResult> {
    try {
      const json = await loginWithEmail(email, password); // lib/auth returns { success, user?, error? }
      if (!json.success)
        return { success: false, error: json.error || "Login failed" };
      setUser(json.user);
      return { success: true, user: json.user };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, error: err.message || "Network error" };
      }
      return { success: false, error: "Network error" };
    } finally {
    }
  }

  const loginGoogle = async (): Promise<AuthResult> => {
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        setUser(res.user);
        return { success: true, user: res.user };
      } else {
        return { success: false, error: res.error || "Login failed" };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, error: err.message || "Network error" };
      }
      return { success: false, error: "Network error" };
    }
  };

  const createAccount = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthResult> => {
    try {
      const res = await createNewAccount(
        name,
        email,
        password,
        confirmPassword
      );
      if (res.success) {
        setUser(res.user);
        return { success: true, user: res.user };
      } else {
        return {
          success: false,
          error: res.error || "Account creation failed",
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, error: err.message || "Network error" };
      }
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider
      value={{ user, loginGoogle, loginEmail, createAccount, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}

export default UserProvider;
