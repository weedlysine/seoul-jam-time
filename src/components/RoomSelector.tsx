import { cn } from "@/lib/utils";
import { regionRooms } from "@/types/studio";
import { Building2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomSelectorProps {
  region: string;
  selectedRooms: string[];
  onRoomsChange: (rooms: string[]) => void;
}

export function RoomSelector({ region, selectedRooms, onRoomsChange }: RoomSelectorProps) {
  const rooms = regionRooms[region] || [];

  const toggleRoom = (room: string) => {
    if (selectedRooms.includes(room)) {
      onRoomsChange(selectedRooms.filter((r) => r !== room));
    } else {
      onRoomsChange([...selectedRooms, room]);
    }
  };

  const selectAll = () => {
    onRoomsChange(rooms);
  };

  const clearAll = () => {
    onRoomsChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>합주실 선택</span>
          <Badge variant="secondary" className="text-xs">
            {selectedRooms.length}개 선택
          </Badge>
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-primary hover:underline"
          >
            전체 선택
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:underline"
          >
            선택 해제
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {rooms.map((room) => {
          const isSelected = selectedRooms.includes(room);
          return (
            <button
              key={room}
              onClick={() => toggleRoom(room)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                isSelected
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-secondary text-secondary-foreground border-transparent hover:border-border"
              )}
            >
              {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
              {room}
            </button>
          );
        })}
      </div>
      
      {rooms.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          지역을 선택해주세요
        </p>
      )}
    </div>
  );
}
