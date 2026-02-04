import { TimeSlot } from "@/types/studio";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { ChevronRight } from "lucide-react";

interface TimeSlotGridProps {
  slots: TimeSlot[];
  availableSlots: TimeSlot[];
  variant?: "wrap" | "scroll" | "fixed";
}

// 옵션 1: 최대 6개 + 더보기 (wrap)
function WrapVariant({ availableSlots }: { availableSlots: TimeSlot[] }) {
  const [expanded, setExpanded] = useState(false);
  const maxShow = 6;
  const hasMore = availableSlots.length > maxShow;
  const displaySlots = expanded ? availableSlots : availableSlots.slice(0, maxShow);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {displaySlots.map((slot) => (
          <span
            key={slot.time}
            className="px-2.5 py-1 text-sm font-medium bg-available/15 text-available border border-available/30 rounded-full"
          >
            {slot.time}
          </span>
        ))}
        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="px-2.5 py-1 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 rounded-full transition-colors"
          >
            +{availableSlots.length - maxShow}개
          </button>
        )}
      </div>
    </div>
  );
}

// 옵션 2: 가로 스크롤 (scroll)
function ScrollVariant({ availableSlots }: { availableSlots: TimeSlot[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1"
      >
        {availableSlots.map((slot) => (
          <span
            key={slot.time}
            className="px-2.5 py-1 text-sm font-medium bg-available/15 text-available border border-available/30 rounded-full whitespace-nowrap shrink-0"
          >
            {slot.time}
          </span>
        ))}
      </div>
      {availableSlots.length > 5 && (
        <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none flex items-center justify-end">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

// 옵션 3: 고정 높이 + 세로 스크롤 (fixed)
function FixedVariant({ availableSlots }: { availableSlots: TimeSlot[] }) {
  return (
    <div className="max-h-[72px] overflow-y-auto scrollbar-hide">
      <div className="flex flex-wrap gap-1.5">
        {availableSlots.map((slot) => (
          <span
            key={slot.time}
            className="px-2.5 py-1 text-sm font-medium bg-available/15 text-available border border-available/30 rounded-full"
          >
            {slot.time}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TimeSlotGrid({ slots, availableSlots, variant = "wrap" }: TimeSlotGridProps) {
  if (availableSlots.length === 0) {
    return (
      <div className="py-3 text-center text-sm text-muted-foreground bg-muted/50 rounded-lg">
        예약 가능한 시간이 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {variant === "wrap" && <WrapVariant availableSlots={availableSlots} />}
      {variant === "scroll" && <ScrollVariant availableSlots={availableSlots} />}
      {variant === "fixed" && <FixedVariant availableSlots={availableSlots} />}
      
      {/* 전체 시간 바 - 간략한 시각화 */}
      <div className="flex gap-px rounded overflow-hidden">
        {slots.map((slot) => (
          <div
            key={slot.time}
            className={cn(
              "flex-1 h-1.5 transition-all",
              slot.available ? "bg-available" : "bg-muted"
            )}
            title={`${slot.time} - ${slot.available ? "예약 가능" : "예약됨"}`}
          />
        ))}
      </div>
    </div>
  );
}
