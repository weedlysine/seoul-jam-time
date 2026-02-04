import { Studio } from "@/types/studio";
import { StudioCard } from "./StudioCard";
import { Loader2, SearchX } from "lucide-react";

interface StudioListProps {
  studios: Studio[];
  isLoading?: boolean;
  hasSearched?: boolean;
}

export function StudioList({ studios, isLoading, hasSearched }: StudioListProps) {
  if (isLoading && studios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-semibold mb-2">합주실 검색 중...</h3>
        <p className="text-muted-foreground text-sm">
          네이버 예약에서 실시간으로 정보를 가져오고 있습니다
        </p>
        <p className="text-muted-foreground text-xs mt-2">
          ⏳ 조금 시간이 걸릴 수 있어요
        </p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-3xl">🎸</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">합주실을 검색해보세요</h3>
        <p className="text-muted-foreground text-sm max-w-md">
          지역과 합주실을 선택한 후 검색 버튼을 누르면<br />
          실시간 빈 시간을 확인할 수 있습니다
        </p>
      </div>
    );
  }

  if (studios.length === 0 && hasSearched && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
        <p className="text-muted-foreground text-sm">
          다른 날짜나 합주실을 선택해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-2 text-sm text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>추가 결과를 불러오는 중...</span>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio, index) => (
          <div
            key={studio.id}
            className="animate-slide-up"
            style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
          >
            <StudioCard studio={studio} />
          </div>
        ))}
      </div>
    </div>
  );
}
