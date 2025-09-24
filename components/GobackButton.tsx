import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";

export default function GobackButton({
  destination,
  text = "",
}: {
  destination?: string;
  text?: string;
}) {
  const { theme } = useTheme();

  const colors = {
    light: "text-gray-800 hover:text-gray-600",
    dark: "text-white-200 hover:text-white-400",
  };

  return (
    <Link
      href={destination || "/"}
      className={`flex items-center gap-2 ${colors[theme]}`}
    >
      <ArrowLeft className="w-7 h-7" />
      <span className="font-medium">{text}</span>
    </Link>
  );
}
