import { TimeSlot } from "@/types/studio";
import { cn } from "@/lib/utils";

interface TimeSlotGridProps {
  slots: TimeSlot[];
  availableSlots: TimeSlot[];
}

export function TimeSlotGrid({ slots, availableSlots }: TimeSlotGridProps) {
  if (availableSlots.length === 0) {
    return (
      <div className="py-3 text-center text-sm text-muted-foreground bg-muted/50 rounded-lg">
        예약 가능한 시간이 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* 고정 높이 시간 칩 */}
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
      
      {/* 전체 시간 바 + 시간 레이블 */}
      <div className="space-y-1">
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
        {/* 시간 레이블 (10시 ~ 24시) */}
        <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
          <span>10</span>
          <span>14</span>
          <span>18</span>
          <span>22</span>
          <span>24</span>
        </div>
      </div>
    </div>
  );
}
