import { cn } from "@/lib/utils";
import { regions } from "@/types/studio";
import { MapPin } from "lucide-react";

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export function RegionSelector({ selectedRegion, onRegionChange }: RegionSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>지역 선택</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => onRegionChange(region)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              selectedRegion === region
                ? "bg-primary text-primary-foreground shadow-elevated"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            )}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  );
}
