import { X, MapPin, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Studio } from "@/types/studio";
import { TimeSlotGrid } from "./TimeSlotGrid";

interface StudioDetailProps {
  studio: Studio;
  onClose: () => void;
}

export function StudioDetail({ studio, onClose }: StudioDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl overflow-hidden shadow-elevated animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 이미지 */}
        <div className="relative h-48">
          <img
            src={studio.imageUrl}
            alt={studio.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1 text-primary">
                <Star className="h-4 w-4 fill-primary" />
                <span className="text-sm font-semibold">{studio.rating}</span>
              </div>
              <Badge variant="secondary">{studio.district}</Badge>
            </div>
            <h2 className="text-2xl font-bold">{studio.name}</h2>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="p-5 space-y-5">
          {/* 위치 & 가격 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{studio.location}</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-primary">
                ₩{studio.pricePerHour.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">/시간</span>
            </div>
          </div>

          {/* 편의시설 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">편의시설</h3>
            <div className="flex flex-wrap gap-2">
              {studio.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline" className="px-3 py-1">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* 시간대 상세 */}
          <TimeSlotGrid slots={studio.timeSlots} />

          {/* 예약 버튼 */}
          <Button
            className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground text-base font-semibold"
            onClick={() => window.open(studio.naverBookingUrl, "_blank")}
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            네이버 예약 페이지로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
