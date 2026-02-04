import { cn } from "@/lib/utils";
import { regionRooms } from "@/types/studio";
import { Building2, CheckCircle2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RoomSelectorProps {
  region: string;
  selectedRooms: string[];
  onRoomsChange: (rooms: string[]) => void;
}

export function RoomSelector({ region, selectedRooms, onRoomsChange }: RoomSelectorProps) {
  const rooms = regionRooms[region] || [];
  const allSelected = rooms.length > 0 && selectedRooms.length === rooms.length;
  const noneSelected = selectedRooms.length === 0;

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
    <div className="space-y-4">
      {/* 빠른 선택 버튼 */}
      <div className="flex gap-3">
        <Button
          onClick={selectAll}
          variant={allSelected ? "default" : "outline"}
          className={cn(
            "flex-1 h-12 text-base font-semibold transition-all",
            allSelected 
              ? "bg-gradient-primary text-primary-foreground" 
              : "hover:border-primary hover:text-primary"
          )}
        >
          <Check className="h-5 w-5 mr-2" />
          전체 선택 ({rooms.length}개)
        </Button>
        <Button
          onClick={clearAll}
          variant="outline"
          className="h-12 px-4"
          disabled={noneSelected}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 또는 개별 선택 안내 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">또는 개별 선택</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* 개별 합주실 선택 */}
      <div className="flex flex-wrap gap-2">
        {rooms.map((room) => {
          const isSelected = selectedRooms.includes(room);
          return (
            <button
              key={room}
              onClick={() => toggleRoom(room)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2",
                isSelected
                  ? "bg-primary/15 text-primary border-primary/40 shadow-sm"
                  : "bg-card text-foreground border-border hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
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
        <div className="bg-secondary/50 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm">
              <strong className="text-primary">{selectedRooms.length}개</strong> 합주실 선택됨
            </span>
          </div>
          {!allSelected && (
            <button
              onClick={selectAll}
              className="text-xs text-primary hover:underline"
            >
              전체 선택
            </button>
          )}
        </div>
      )}
      
      {rooms.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          지역을 선택해주세요
        </p>
      )}
    </div>
  );
}
