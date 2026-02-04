import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { DateFilter } from "@/components/DateFilter";
import { DistrictFilter } from "@/components/DistrictFilter";
import { StudioList } from "@/components/StudioList";
import { StatsBar } from "@/components/StatsBar";
import { mockStudios } from "@/data/mockStudios";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDistrict, setSelectedDistrict] = useState("전체");

  const filteredStudios = useMemo(() => {
    return mockStudios.filter((studio) => {
      if (selectedDistrict !== "전체" && studio.district !== selectedDistrict) {
        return false;
      }
      return true;
    });
  }, [selectedDistrict]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* 필터 섹션 */}
        <section className="space-y-4">
          <DateFilter
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <DistrictFilter
            selectedDistrict={selectedDistrict}
            onDistrictChange={setSelectedDistrict}
          />
        </section>

        {/* 통계 */}
        <StatsBar studios={filteredStudios} />

        {/* 결과 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {selectedDistrict === "전체" ? "서울" : selectedDistrict}{" "}
            <span className="text-muted-foreground font-normal">
              합주실 {filteredStudios.length}개
            </span>
          </h2>
          <select className="bg-secondary border-none rounded-lg px-3 py-1.5 text-sm text-foreground">
            <option>빈 시간 많은 순</option>
            <option>가격 낮은 순</option>
            <option>평점 높은 순</option>
          </select>
        </div>

        {/* 합주실 목록 */}
        <StudioList studios={filteredStudios} />
      </main>

      {/* 푸터 */}
      <footer className="border-t border-border mt-12 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>데이터는 네이버 예약에서 실시간으로 수집됩니다</p>
          <p className="mt-1">© 2024 합주실 빈자리. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
