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

// 목업 데이터 (서버가 꺼져있을 때 사용)
const MOCK_DATA: Record<string, { times: string[]; url: string }[]> = {
  "라온합주실": [
    { times: ["10:00", "11:00", "14:00", "15:00", "20:00", "21:00"], url: "https://booking.naver.com/laon" },
  ],
  "사운드홀릭": [
    { times: ["12:00", "13:00", "18:00", "19:00", "22:00"], url: "https://booking.naver.com/soundholic" },
  ],
  "오렌지플레이": [
    { times: ["10:00", "16:00", "17:00", "23:00"], url: "https://booking.naver.com/orangeplay" },
  ],
  "홍대노리터": [
    { times: ["11:00", "12:00", "13:00", "14:00"], url: "https://booking.naver.com/noritor" },
  ],
  "플레이스튜디오": [
    { times: ["15:00", "16:00", "17:00", "18:00", "19:00"], url: "https://booking.naver.com/playstudio" },
  ],
};

function generateMockStudios(rooms: string[]): Studio[] {
  let index = 0;
  const studios: Studio[] = [];
  
  rooms.forEach((room) => {
    const mockInfo = MOCK_DATA[room];
    if (mockInfo) {
      mockInfo.forEach((info, roomIdx) => {
        const response: RoomApiResponse = {
          roomLabel: `${room}\n${roomIdx === 0 ? "A룸" : `${String.fromCharCode(65 + roomIdx)}룸`}`,
          availableTimes: info.times,
          url: info.url,
        };
        studios.push(transformToStudio(response, index++));
      });
    } else {
      // 목업 데이터가 없는 경우 기본 생성
      const randomTimes = ALL_TIME_SLOTS.filter(() => Math.random() > 0.6);
      const response: RoomApiResponse = {
        roomLabel: `${room}\nA룸`,
        availableTimes: randomTimes,
        url: "https://booking.naver.com",
      };
      studios.push(transformToStudio(response, index++));
    }
  });
  
  return studios;
}

export function searchStudios({ date, rooms, onData, onComplete, onError }: SearchParams): () => void {
  const dateStr = format(date, "yyyy-MM-dd");
  const roomsParam = rooms.join(",");
  
  const url = `${API_BASE_URL}/search1-sse?date=${dateStr}&rooms=${encodeURIComponent(roomsParam)}`;
  
  console.log("🔍 검색 시작:", url);
  
  const eventSource = new EventSource(url);
  let studioIndex = 0;
  let connectionFailed = false;

  // 연결 타임아웃 - 3초 내 연결 안되면 목업 데이터 사용
  const timeoutId = setTimeout(() => {
    if (eventSource.readyState !== 1) { // 1 = OPEN
      console.log("⏱️ 서버 연결 타임아웃 - 목업 데이터 사용");
      connectionFailed = true;
      eventSource.close();
      
      // 목업 데이터 생성 및 전달
      const mockStudios = generateMockStudios(rooms);
      onData(mockStudios);
      onComplete();
    }
  }, 3000);

  eventSource.onopen = () => {
    console.log("✅ SSE 연결 시작");
    clearTimeout(timeoutId);
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
    clearTimeout(timeoutId);
    eventSource.close();
    onComplete();
  });

  eventSource.onerror = (err) => {
    clearTimeout(timeoutId);
    
    if (connectionFailed) return; // 이미 목업으로 처리됨
    
    if (eventSource.readyState === 2) {
      console.log("✅ SSE 자연 종료");
      onComplete();
    } else {
      console.log("⚠️ 서버 연결 실패 - 목업 데이터로 대체");
      // 목업 데이터로 대체
      const mockStudios = generateMockStudios(rooms);
      onData(mockStudios);
      onComplete();
    }
    eventSource.close();
  };

  // cleanup 함수 반환
  return () => {
    clearTimeout(timeoutId);
    eventSource.close();
  };
}
