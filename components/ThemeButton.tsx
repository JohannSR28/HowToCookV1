"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { darkModeLogo, lightModeLogo } from "./logo";

export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === "dark" ? lightModeLogo : darkModeLogo}
    </button>
  );
}
