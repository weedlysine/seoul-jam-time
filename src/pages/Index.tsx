import { useState, useCallback, useRef } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Search, Calendar } from "lucide-react";
import { Header } from "@/components/Header";
import { RegionSelector } from "@/components/RegionSelector";
import { RoomSelector } from "@/components/RoomSelector";
import { DateFilter } from "@/components/DateFilter";
import { StudioList } from "@/components/StudioList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Studio } from "@/types/studio";
import { searchStudios } from "@/lib/api";
import { toast } from "sonner";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState("홍대");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedRooms([]); // 지역 변경 시 선택 초기화
  };

  const handleSearch = useCallback(() => {
    if (selectedRooms.length === 0) {
      toast.error("합주실을 선택해주세요", {
        description: "최소 1개 이상의 합주실을 선택해야 합니다",
      });
      return;
    }

    // 기존 연결 정리
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    setIsLoading(true);
    setHasSearched(true);
    setStudios([]);

    toast.info("검색을 시작합니다", {
      description: `${selectedRooms.length}개 합주실의 빈 시간을 조회합니다`,
    });

    cleanupRef.current = searchStudios({
      date: selectedDate,
      rooms: selectedRooms,
      onData: (newStudios) => {
        setStudios((prev) => [...prev, ...newStudios]);
      },
      onComplete: () => {
        setIsLoading(false);
        toast.success("검색 완료!", {
          description: "결과를 확인해보세요",
        });
      },
      onError: (error) => {
        setIsLoading(false);
        toast.error("검색 중 오류가 발생했습니다", {
          description: error.message,
        });
      },
    });
  }, [selectedDate, selectedRooms]);

  const availableCount = studios.reduce(
    (acc, s) => acc + s.timeSlots.filter((t) => t.available).length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header isLoading={isLoading} />
      
      <main className="container py-6 space-y-6">
        {/* 검색 조건 카드 */}
        <section className="bg-card border border-border rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              검색 조건
            </h2>
            <Badge variant="outline" className="text-xs">
              {format(selectedDate, "M월 d일 (EEE)", { locale: ko })}
            </Badge>
          </div>

          {/* 날짜 선택 */}
          <DateFilter
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* 지역 선택 */}
          <RegionSelector
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
          />

          {/* 합주실 선택 */}
          <RoomSelector
            region={selectedRegion}
            selectedRooms={selectedRooms}
            onRoomsChange={setSelectedRooms}
          />

          {/* 검색 버튼 */}
          <Button
            onClick={handleSearch}
            disabled={isLoading || selectedRooms.length === 0}
            className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Search className="h-5 w-5 mr-2 animate-pulse" />
                검색 중...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                빈 시간 검색하기
              </>
            )}
          </Button>
        </section>

        {/* 결과 통계 */}
        {hasSearched && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{studios.length}</p>
              <p className="text-xs text-muted-foreground">검색된 합주실</p>
            </div>
            <div className="bg-secondary rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-available">{availableCount}</p>
              <p className="text-xs text-muted-foreground">예약 가능 시간</p>
            </div>
          </div>
        )}

        {/* 합주실 목록 */}
        <StudioList 
          studios={studios} 
          isLoading={isLoading}
          hasSearched={hasSearched}
        />
      </main>

      {/* 푸터 */}
      <footer className="border-t border-border mt-12 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>데이터는 네이버 예약에서 실시간으로 수집됩니다</p>
          <p className="mt-1">© 2024 밴드룸. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
