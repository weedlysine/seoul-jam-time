import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ThemeKey = "orange" | "ocean" | "cafe" | "purple" | "mint";

interface Theme {
  key: ThemeKey;
  name: string;
  emoji: string;
  colors: {
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
  };
}

const themes: Theme[] = [
  {
    key: "orange",
    name: "Orange Dark",
    emoji: "🔥",
    colors: {
      background: "0 0% 7%",
      foreground: "0 0% 95%",
      card: "0 0% 10%",
      primary: "32 95% 55%",
      primaryForeground: "0 0% 5%",
      secondary: "0 0% 15%",
      muted: "0 0% 18%",
      mutedForeground: "0 0% 60%",
      border: "0 0% 20%",
      accent: "32 95% 55%",
    },
  },
  {
    key: "ocean",
    name: "Ocean Dark",
    emoji: "🌊",
    colors: {
      background: "210 20% 8%",
      foreground: "210 20% 95%",
      card: "210 20% 11%",
      primary: "175 70% 45%",
      primaryForeground: "210 20% 5%",
      secondary: "210 20% 15%",
      muted: "210 15% 20%",
      mutedForeground: "210 10% 55%",
      border: "210 15% 22%",
      accent: "175 70% 45%",
    },
  },
  {
    key: "cafe",
    name: "Warm Cafe",
    emoji: "☕",
    colors: {
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
    },
  },
  {
    key: "purple",
    name: "Night Purple",
    emoji: "🌙",
    colors: {
      background: "260 20% 8%",
      foreground: "260 10% 95%",
      card: "260 20% 11%",
      primary: "270 60% 60%",
      primaryForeground: "260 20% 98%",
      secondary: "260 15% 16%",
      muted: "260 12% 20%",
      mutedForeground: "260 10% 55%",
      border: "260 12% 22%",
      accent: "270 60% 60%",
    },
  },
  {
    key: "mint",
    name: "Soft Mint",
    emoji: "🍃",
    colors: {
      background: "160 15% 95%",
      foreground: "160 15% 12%",
      card: "160 20% 98%",
      primary: "160 55% 40%",
      primaryForeground: "160 15% 98%",
      secondary: "160 15% 88%",
      muted: "160 10% 85%",
      mutedForeground: "160 10% 45%",
      border: "160 12% 80%",
      accent: "160 55% 40%",
    },
  },
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("orange");

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
    // Also update ring color
    root.style.setProperty("--ring", theme.colors.primary);
    root.style.setProperty("--input", theme.colors.secondary);
    setCurrentTheme(theme.key);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeKey | null;
    if (savedTheme) {
      const theme = themes.find((t) => t.key === savedTheme);
      if (theme) applyTheme(theme);
    }
  }, []);

  const handleThemeChange = (theme: Theme) => {
    applyTheme(theme);
    localStorage.setItem("theme", theme.key);
  };

  const currentThemeData = themes.find((t) => t.key === currentTheme);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground px-2 py-1">테마 선택</p>
          {themes.map((theme) => (
            <button
              key={theme.key}
              onClick={() => handleThemeChange(theme)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                currentTheme === theme.key
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-muted"
              )}
            >
              <span className="text-lg">{theme.emoji}</span>
              <span className="flex-1 text-left">{theme.name}</span>
              {/* 색상 미리보기 */}
              <div className="flex gap-1">
                <div
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: `hsl(${theme.colors.background})` }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                />
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
