import { useEffect, useRef, useState } from "react";
import { MapPin, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 합주실 위치 데이터 (실제 데이터로 교체 필요)
export const roomLocations: Record<string, { lat: number; lng: number; name: string }> = {
  "라온합주실": { lat: 37.5563, lng: 126.9220, name: "라온합주실" },
  "사운드홀릭": { lat: 37.5571, lng: 126.9245, name: "사운드홀릭" },
  "오렌지플레이": { lat: 37.5548, lng: 126.9198, name: "오렌지플레이" },
  "홍대노리터": { lat: 37.5582, lng: 126.9267, name: "홍대노리터" },
  "플레이스튜디오": { lat: 37.5539, lng: 126.9212, name: "플레이스튜디오" },
  "뮤직인사이드": { lat: 37.5555, lng: 126.9235, name: "뮤직인사이드" },
  "사운드플레이": { lat: 37.5577, lng: 126.9189, name: "사운드플레이" },
};

// 지역별 중심 좌표
const regionCenters: Record<string, { lat: number; lng: number }> = {
  "홍대": { lat: 37.5563, lng: 126.9220 },
  "신촌": { lat: 37.5596, lng: 126.9426 },
  "강남": { lat: 37.4979, lng: 127.0276 },
  "건대": { lat: 37.5407, lng: 127.0699 },
  "합정": { lat: 37.5495, lng: 126.9139 },
};

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  region: string;
  selectedRooms: string[];
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function KakaoMap({ region, selectedRooms, expanded, onToggleExpand }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<any[]>([]);

  // 카카오맵 SDK 로드
  useEffect(() => {
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const center = regionCenters[region] || regionCenters["홍대"];
    const options = {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level: 4,
    };

    const newMap = new window.kakao.maps.Map(mapRef.current, options);
    setMap(newMap);
  }, [isLoaded, region]);

  // 마커 업데이트
  useEffect(() => {
    if (!map) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
    selectedRooms.forEach((room) => {
      const location = roomLocations[room];
      if (!location) return;

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(location.lat, location.lng),
        map: map,
      });

      // 인포윈도우
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:8px 12px;font-size:13px;font-weight:600;white-space:nowrap;">${location.name}</div>`,
      });

      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        infoWindow.open(map, marker);
      });

      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        infoWindow.close();
      });

      markersRef.current.push(marker);
    });

    // 선택된 합주실이 있으면 범위에 맞게 조정
    if (markersRef.current.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      markersRef.current.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });
      map.setBounds(bounds);
    }
  }, [map, selectedRooms]);

  // 지도 크기 변경 시 재조정
  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.relayout();
      }, 100);
    }
  }, [map, expanded]);

  if (!isLoaded) {
    return (
      <div className={cn(
        "bg-card border border-border rounded-2xl flex items-center justify-center",
        expanded ? "h-[400px]" : "h-[200px]"
      )}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MapPin className="h-8 w-8 animate-pulse" />
          <span className="text-sm">지도 로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className={cn(
          "w-full rounded-2xl overflow-hidden border border-border transition-all duration-300",
          expanded ? "h-[400px]" : "h-[200px]"
        )}
      />
      
      {/* 확장/축소 버튼 */}
      {onToggleExpand && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 bg-background/90 backdrop-blur-sm shadow-md"
          onClick={onToggleExpand}
        >
          {expanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* 마커 정보 */}
      {selectedRooms.length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 inline mr-1" />
          {selectedRooms.length}개 합주실 표시 중
        </div>
      )}
    </div>
  );
}
