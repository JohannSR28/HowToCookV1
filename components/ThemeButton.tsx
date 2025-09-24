"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { DarkModeLogo, LightModeLogo } from "./logos";

export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === "dark" ? LightModeLogo : DarkModeLogo}
    </button>
  );
}
