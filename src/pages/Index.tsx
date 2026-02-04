import { useState, useCallback, useRef, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Search, MapPin, Building2, Calendar, ChevronRight, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { RegionSelector } from "@/components/RegionSelector";
import { RoomSelector } from "@/components/RoomSelector";
import { DateFilter } from "@/components/DateFilter";
import { StudioList } from "@/components/StudioList";
import { Button } from "@/components/ui/button";
import { Studio, regions, regionRooms } from "@/types/studio";
import { searchStudios } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const cleanupRef = useRef<(() => void) | null>(null);

  // 지역 선택 시 다음 스텝으로 + 기본 전체 선택
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    // 기본으로 전체 선택
    setSelectedRooms(regionRooms[region] || []);
    setCurrentStep(2);
  };

  // 합주실 선택 시 자동으로 다음 스텝
  useEffect(() => {
    if (selectedRooms.length > 0 && currentStep === 2) {
      setCurrentStep(3);
    }
  }, [selectedRooms, currentStep]);

  const handleSearch = useCallback(() => {
    if (selectedRooms.length === 0) {
      toast.error("합주실을 선택해주세요");
      setCurrentStep(2);
      return;
    }

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
        toast.success("검색 완료!");
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

  const steps = [
    { 
      step: 1 as Step, 
      label: "지역", 
      icon: MapPin, 
      completed: !!selectedRegion,
      value: selectedRegion 
    },
    { 
      step: 2 as Step, 
      label: "합주실", 
      icon: Building2, 
      completed: selectedRooms.length > 0,
      value: selectedRooms.length > 0 ? `${selectedRooms.length}개 선택` : "" 
    },
    { 
      step: 3 as Step, 
      label: "날짜", 
      icon: Calendar, 
      completed: currentStep === 3,
      value: format(selectedDate, "M/d (EEE)", { locale: ko })
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isLoading={isLoading} />
      
      <main className="container py-6 space-y-6">
        {/* 스텝 인디케이터 */}
        <div className="flex items-center justify-center gap-2 py-4">
          {steps.map((s, index) => (
            <div key={s.step} className="flex items-center">
              <button
                onClick={() => {
                  if (s.step === 1 || (s.step === 2 && selectedRegion) || (s.step === 3 && selectedRooms.length > 0)) {
                    setCurrentStep(s.step);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                  currentStep === s.step
                    ? "bg-primary text-primary-foreground shadow-elevated"
                    : s.completed
                      ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {s.completed && currentStep !== s.step ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{s.label}</span>
                {s.value && currentStep !== s.step && (
                  <span className="text-xs opacity-70">{s.value}</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* 스텝 1: 지역 선택 */}
        {currentStep === 1 && (
          <section className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">어디서 합주하세요?</h2>
              <p className="text-muted-foreground">지역을 선택해주세요</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-2xl mx-auto">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionChange(region)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105",
                    selectedRegion === region
                      ? "bg-primary text-primary-foreground border-primary shadow-elevated"
                      : "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  <MapPin className="h-6 w-6 mb-2" />
                  <span className="font-semibold">{region}</span>
                  <span className="text-xs opacity-70 mt-1">
                    {regionRooms[region]?.length || 0}개 합주실
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 스텝 2: 합주실 선택 */}
        {currentStep === 2 && selectedRegion && (
          <section className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">
                <span className="text-primary">{selectedRegion}</span>에서 어느 합주실?
              </h2>
              <p className="text-muted-foreground">검색할 합주실을 선택해주세요</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <RoomSelector
                region={selectedRegion}
                selectedRooms={selectedRooms}
                onRoomsChange={setSelectedRooms}
              />
              {selectedRooms.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="bg-gradient-primary text-primary-foreground px-8"
                  >
                    다음: 날짜 선택
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 스텝 3: 날짜 선택 & 검색 */}
        {currentStep === 3 && selectedRooms.length > 0 && (
          <section className="animate-fade-in space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">언제 합주하세요?</h2>
              <p className="text-muted-foreground">
                {selectedRegion} · {selectedRooms.length}개 합주실 선택됨
              </p>
            </div>

            <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-5">
              <DateFilter
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>

            {/* 검색 버튼 */}
            <div className="flex justify-center">
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground text-lg font-semibold px-12 h-14"
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
            </div>

            {/* 선택 요약 */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="px-3 py-1 bg-secondary rounded-full">
                📍 {selectedRegion}
              </span>
              <span className="px-3 py-1 bg-secondary rounded-full">
                🏠 {selectedRooms.slice(0, 2).join(", ")}
                {selectedRooms.length > 2 && ` 외 ${selectedRooms.length - 2}개`}
              </span>
              <span className="px-3 py-1 bg-secondary rounded-full">
                📅 {format(selectedDate, "M월 d일 (EEE)", { locale: ko })}
              </span>
            </div>
          </section>
        )}

        {/* 결과 영역 */}
        {hasSearched && (
          <section className="space-y-4 pt-4 border-t border-border">
            {/* 결과 통계 */}
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

            {/* 합주실 목록 */}
            <StudioList 
              studios={studios} 
              isLoading={isLoading}
              hasSearched={hasSearched}
            />
          </section>
        )}
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
