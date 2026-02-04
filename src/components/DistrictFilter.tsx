import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { districts } from "@/data/mockStudios";

interface DistrictFilterProps {
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
}

export function DistrictFilter({ selectedDistrict, onDistrictChange }: DistrictFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>지역</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {districts.map((district) => (
          <button
            key={district}
            onClick={() => onDistrictChange(district)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
              selectedDistrict === district
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            )}
          >
            {district}
          </button>
        ))}
      </div>
    </div>
  );
}
