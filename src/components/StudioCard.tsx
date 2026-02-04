import { ExternalLink, MapPin, Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Studio } from "@/types/studio";
import { TimeSlotGrid } from "./TimeSlotGrid";

interface StudioCardProps {
  studio: Studio;
  onSelect: (studio: Studio) => void;
}

export function StudioCard({ studio, onSelect }: StudioCardProps) {
  const availableCount = studio.timeSlots.filter((s) => s.available).length;

  return (
    <Card 
      className="group overflow-hidden bg-card border-border card-hover cursor-pointer"
      onClick={() => onSelect(studio)}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={studio.imageUrl}
          alt={studio.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* 예약 가능 배지 */}
        <div className="absolute top-3 right-3">
          <Badge 
            className={
              availableCount > 5 
                ? "bg-available/90 text-white border-0" 
                : availableCount > 0 
                  ? "bg-partial/90 text-black border-0"
                  : "bg-booked/90 text-white border-0"
            }
          >
            <Clock className="h-3 w-3 mr-1" />
            {availableCount}개 시간 가능
          </Badge>
        </div>

        {/* 가격 */}
        <div className="absolute bottom-3 left-3">
          <span className="text-2xl font-bold text-foreground">
            ₩{studio.pricePerHour.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">/시간</span>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {studio.name}
            </h3>
            <div className="flex items-center gap-1 text-primary">
              <Star className="h-4 w-4 fill-primary" />
              <span className="text-sm font-semibold">{studio.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{studio.location}</span>
          </div>
        </div>

        {/* 편의시설 */}
        <div className="flex flex-wrap gap-1.5">
          {studio.amenities.slice(0, 4).map((amenity) => (
            <Badge 
              key={amenity} 
              variant="secondary" 
              className="text-[10px] px-2 py-0.5"
            >
              {amenity}
            </Badge>
          ))}
          {studio.amenities.length > 4 && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
              +{studio.amenities.length - 4}
            </Badge>
          )}
        </div>

        {/* 시간대 미니 그리드 */}
        <TimeSlotGrid slots={studio.timeSlots} compact />

        {/* 예약 버튼 */}
        <Button
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground"
          onClick={(e) => {
            e.stopPropagation();
            window.open(studio.naverBookingUrl, "_blank");
          }}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          네이버 예약하기
        </Button>
      </CardContent>
    </Card>
  );
}
