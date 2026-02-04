import { ExternalLink, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Studio } from "@/types/studio";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { cn } from "@/lib/utils";

interface StudioCardProps {
  studio: Studio;
}

export function StudioCard({ studio }: StudioCardProps) {
  const availableCount = studio.timeSlots.filter((s) => s.available).length;

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
          <Badge 
            className={cn(
              "shrink-0",
              availableCount > 5 
                ? "bg-available/20 text-available border-available/30" 
                : availableCount > 0 
                  ? "bg-partial/20 text-partial border-partial/30"
                  : "bg-booked/20 text-muted-foreground border-booked/30"
            )}
            variant="outline"
          >
            <Clock className="h-3 w-3 mr-1" />
            {availableCount}개
          </Badge>
        </div>

        {/* 시간대 그리드 */}
        <TimeSlotGrid slots={studio.timeSlots} compact />

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
