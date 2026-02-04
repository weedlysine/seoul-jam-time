import { Studio } from "@/types/studio";

interface StatsBarProps {
  studios: Studio[];
}

export function StatsBar({ studios }: StatsBarProps) {
  const totalSlots = studios.reduce((acc, s) => acc + s.timeSlots.length, 0);
  const availableSlots = studios.reduce(
    (acc, s) => acc + s.timeSlots.filter((t) => t.available).length,
    0
  );
  const avgPrice = Math.round(
    studios.reduce((acc, s) => acc + s.pricePerHour, 0) / studios.length
  );

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-secondary rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-foreground">{studios.length}</p>
        <p className="text-xs text-muted-foreground">합주실</p>
      </div>
      <div className="bg-secondary rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-available">{availableSlots}</p>
        <p className="text-xs text-muted-foreground">예약 가능 시간</p>
      </div>
      <div className="bg-secondary rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-primary">
          ₩{avgPrice.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">평균 시간당</p>
      </div>
    </div>
  );
}
