import { useState } from "react";
import { Studio } from "@/types/studio";
import { StudioCard } from "./StudioCard";
import { StudioDetail } from "./StudioDetail";

interface StudioListProps {
  studios: Studio[];
}

export function StudioList({ studios }: StudioListProps) {
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

  if (studios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-3xl">🎸</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
        <p className="text-muted-foreground text-sm">
          다른 날짜나 지역을 선택해보세요
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio, index) => (
          <div
            key={studio.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <StudioCard studio={studio} onSelect={setSelectedStudio} />
          </div>
        ))}
      </div>

      {selectedStudio && (
        <StudioDetail
          studio={selectedStudio}
          onClose={() => setSelectedStudio(null)}
        />
      )}
    </>
  );
}
