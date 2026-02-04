import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThemeMode = "light" | "dark";

interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  muted: string;
  mutedForeground: string;
  border: string;
  accent: string;
  available: string;
}

// Warm Cafe (라이트 모드)
const lightTheme: ThemeColors = {
  background: "30 15% 94%",
  foreground: "30 10% 15%",
  card: "30 20% 98%",
  primary: "25 60% 45%",
  primaryForeground: "30 15% 98%",
  secondary: "30 15% 88%",
  muted: "30 10% 85%",
  mutedForeground: "30 10% 45%",
  border: "30 15% 82%",
  accent: "25 60% 45%",
  available: "142 76% 45%",
};

// Slate (다크 모드) - 푸른색 단색
const darkTheme: ThemeColors = {
  background: "220 15% 12%",
  foreground: "220 10% 95%",
  card: "220 15% 15%",
  primary: "210 70% 50%",
  primaryForeground: "0 0% 100%",
  secondary: "220 12% 20%",
  muted: "220 10% 25%",
  mutedForeground: "220 8% 55%",
  border: "220 10% 28%",
  accent: "210 70% 50%",
  available: "142 76% 45%",
};

export function ThemeSwitcher() {
  const [mode, setMode] = useState<ThemeMode>("light");

  const applyTheme = (themeMode: ThemeMode) => {
    const root = document.documentElement;
    const colors = themeMode === "light" ? lightTheme : darkTheme;
    
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
    
    root.style.setProperty("--ring", colors.primary);
    root.style.setProperty("--input", colors.secondary);
    root.style.setProperty("--popover", colors.card);
    root.style.setProperty("--popover-foreground", colors.foreground);
    root.style.setProperty("--card-foreground", colors.foreground);
    
    // Slate(다크)는 단색, Cafe(라이트)는 그라데이션
    if (themeMode === "dark") {
      root.style.setProperty("--gradient-primary", `hsl(${colors.primary})`);
    } else {
      root.style.setProperty("--gradient-primary", `linear-gradient(135deg, hsl(${colors.primary}) 0%, hsl(25 50% 40%) 100%)`);
    }
    
    setMode(themeMode);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as ThemeMode | null;
    if (savedMode) {
      applyTheme(savedMode);
    } else {
      // 시스템 설정 확인
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    applyTheme(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-9 w-9" 
      onClick={toggleTheme}
      aria-label={mode === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
    >
      {mode === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
