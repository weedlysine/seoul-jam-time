import { Music, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface HeaderProps {
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function Header({ isLoading, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
            <Music className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">밴드룸</h1>
            <p className="text-xs text-muted-foreground">서울 합주실 빈 시간 검색</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-1.5 text-xs text-primary">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>검색 중...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-available animate-pulse" />
              <span>실시간</span>
            </div>
          )}
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
              className="text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
