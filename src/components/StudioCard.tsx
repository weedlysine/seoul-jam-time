import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Studio } from "@/types/studio";
import { TimeSlotGrid } from "./TimeSlotGrid";


interface StudioCardProps {
  studio: Studio;
}

export function StudioCard({ studio }: StudioCardProps) {
  const availableSlots = studio.timeSlots.filter((s) => s.available);

  return (
    <Card className="group overflow-hidden bg-card border-border card-hover">
      <CardContent className="p-4 space-y-3">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base text-foreground truncate">
              {studio.name}
            </h3>
            {studio.roomName && (
              <p className="text-sm text-muted-foreground truncate">
                {studio.roomName}
              </p>
            )}
          </div>
        </div>

        {/* 예약 가능 시간 */}
        <TimeSlotGrid slots={studio.timeSlots} availableSlots={availableSlots} />

        {/* 예약 버튼 */}
        <Button
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground h-9"
          onClick={() => window.open(studio.naverBookingUrl, "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          예약하기
        </Button>
      </CardContent>
    </Card>
  );
}
