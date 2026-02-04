import { format } from "date-fns";
import { RoomApiResponse, Studio, TimeSlot } from "@/types/studio";

const API_BASE_URL = "https://api.band-room.com";

// 시간 슬롯 생성 (10:00 ~ 24:00)
const ALL_TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const hour = 10 + i;
  return `${hour}:00`;
});

// API 응답을 Studio 형태로 변환
function transformToStudio(response: RoomApiResponse, index: number): Studio {
  const [studioName, roomName] = response.roomLabel.split("\n");
  
  // 예약 가능한 시간을 기반으로 TimeSlot 생성
  const timeSlots: TimeSlot[] = ALL_TIME_SLOTS.map((time) => ({
    time,
    available: response.availableTimes.includes(time) || 
               response.availableTimes.includes(time.replace(":00", "")),
  }));

  return {
    id: `${studioName}-${roomName}-${index}`,
    name: studioName || response.roomLabel,
    roomName: roomName || "",
    fullLabel: response.roomLabel,
    location: "",
    district: "",
    timeSlots,
    naverBookingUrl: response.url || "https://booking.naver.com",
  };
}

export interface SearchParams {
  date: Date;
  rooms: string[];
  onData: (studios: Studio[]) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export function searchStudios({ date, rooms, onData, onComplete, onError }: SearchParams): () => void {
  const dateStr = format(date, "yyyy-MM-dd");
  const roomsParam = rooms.join(",");
  
  const url = `${API_BASE_URL}/search1-sse?date=${dateStr}&rooms=${encodeURIComponent(roomsParam)}`;
  
  console.log("🔍 검색 시작:", url);
  
  const eventSource = new EventSource(url);
  let studioIndex = 0;

  eventSource.onopen = () => {
    console.log("✅ SSE 연결 시작");
  };

  eventSource.onmessage = (event) => {
    console.log("📡 SSE 수신:", event.data);
    try {
      const parsed = JSON.parse(event.data);
      const parsedObj = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
      
      // 데이터 변환
      const studios: Studio[] = Object.entries(parsedObj).flatMap(([studioName, rooms]) => {
        return Object.entries(rooms as Record<string, { times?: string[]; url?: string }>).map(([roomName, info]) => {
          const response: RoomApiResponse = {
            roomLabel: `${studioName}\n${roomName}`,
            availableTimes: Array.isArray(info?.times) ? [...new Set(info.times)] : [],
            url: info?.url ?? "",
          };
          return transformToStudio(response, studioIndex++);
        });
      });

      console.log("📥 변환된 데이터:", studios);
      onData(studios);
    } catch (err) {
      console.error("❌ SSE 파싱 오류:", err);
    }
  };

  eventSource.addEventListener("done", () => {
    console.log("✅ SSE 완료");
    eventSource.close();
    onComplete();
  });

  eventSource.onerror = (err) => {
    if (eventSource.readyState === 2) {
      console.log("✅ SSE 자연 종료");
      onComplete();
    } else {
      console.error("❌ SSE 연결 에러:", err);
      onError(new Error("연결 오류가 발생했습니다"));
    }
    eventSource.close();
  };

  // cleanup 함수 반환
  return () => {
    eventSource.close();
  };
}
