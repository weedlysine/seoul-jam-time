import { cn } from "@/lib/utils";
import { regionRooms } from "@/types/studio";
import { Check } from "lucide-react";

interface RoomSelectorProps {
  region: string;
  selectedRooms: string[];
  onRoomsChange: (rooms: string[]) => void;
}

export function RoomSelector({ region, selectedRooms, onRoomsChange }: RoomSelectorProps) {
  const rooms = regionRooms[region] || [];
  const allSelected = rooms.length > 0 && selectedRooms.length === rooms.length;

  const toggleRoom = (room: string) => {
    if (selectedRooms.includes(room)) {
      onRoomsChange(selectedRooms.filter((r) => r !== room));
    } else {
      onRoomsChange([...selectedRooms, room]);
    }
  };

  const selectAll = () => onRoomsChange(rooms);
  const clearAll = () => onRoomsChange([]);

  return (
    <div className="space-y-3">
      {/* 전체 선택 / 해제 */}
      <div className="flex items-center justify-end gap-3 text-sm">
        <button
          onClick={selectAll}
          className={cn(
            "hover:underline",
            allSelected ? "text-primary font-medium" : "text-muted-foreground"
          )}
        >
          전체 선택
        </button>
        <span className="text-border">|</span>
        <button
          onClick={clearAll}
          className="text-muted-foreground hover:underline"
        >
          선택 해제
        </button>
      </div>

      {/* 합주실 목록 */}
      <div className="flex flex-wrap gap-2">
        {rooms.map((room) => {
          const isSelected = selectedRooms.includes(room);
          return (
            <button
              key={room}
              onClick={() => toggleRoom(room)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                isSelected
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "bg-card text-foreground border-border hover:border-primary/30"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded border flex items-center justify-center transition-all",
                isSelected 
                  ? "bg-primary border-primary" 
                  : "border-muted-foreground/40"
              )}>
                {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
              </div>
              {room}
            </button>
          );
        })}
      </div>

      {/* 선택 현황 */}
      {selectedRooms.length > 0 && (
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">{selectedRooms.length}개</span> 선택됨
        </p>
      )}
      
      {rooms.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          지역을 선택해주세요
        </p>
      )}
    </div>
  );
}
