import { TimeSlot } from "@/types/studio";
import { cn } from "@/lib/utils";

interface TimeSlotGridProps {
  slots: TimeSlot[];
  compact?: boolean;
}

export function TimeSlotGrid({ slots, compact = false }: TimeSlotGridProps) {
  const availableCount = slots.filter((s) => s.available).length;

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">오늘 빈 시간</span>
          <span className="text-xs font-semibold text-available">
            {availableCount}개 가능
          </span>
        </div>
        <div className="flex gap-1">
          {slots.map((slot) => (
            <div
              key={slot.time}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-all",
                slot.available ? "bg-available" : "bg-booked"
              )}
              title={`${slot.time} - ${slot.available ? "예약 가능" : "예약됨"}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>10:00</span>
          <span>16:00</span>
          <span>22:00</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">시간대별 예약 현황</span>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-available" />
            <span className="text-muted-foreground">예약 가능</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-booked" />
            <span className="text-muted-foreground">예약됨</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-7 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.time}
            disabled={!slot.available}
            className={cn(
              "time-slot flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-xs font-medium",
              slot.available
                ? "time-slot-available"
                : "time-slot-booked"
            )}
          >
            <span className={slot.available ? "text-available" : "text-muted-foreground"}>
              {slot.time}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
