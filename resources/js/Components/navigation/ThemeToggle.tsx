import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((v) => !v)}
      aria-label="Ganti tema terang/gelap"
      className="relative flex h-9 w-9 items-center justify-center rounded-full
                 bg-matcha-100 text-matcha-700 transition-colors hover:bg-matcha-200
                 dark:bg-matcha-800 dark:text-cream-100 dark:hover:bg-matcha-700"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}