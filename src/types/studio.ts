export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Studio {
  id: string;
  name: string;
  roomName: string;
  fullLabel: string;
  location: string;
  district: string;
  pricePerHour?: number;
  imageUrl?: string;
  amenities?: string[];
  rating?: number;
  timeSlots: TimeSlot[];
  naverBookingUrl: string;
}

export interface FilterState {
  date: Date;
  district: string | null;
  timeRange: [number, number];
}

// API 응답 타입
export interface RoomApiResponse {
  roomLabel: string;
  availableTimes: string[];
  url: string;
  error?: boolean;
}

// 지역별 합주실 목록
export const regionRooms: Record<string, string[]> = {
  "홍대": [
    "라온합주실", "사운드홀릭", "오렌지플레이", "홍대노리터", 
    "플레이스튜디오", "뮤직인사이드", "사운드플레이"
  ],
  "신촌": [
    "신촌사운드", "뮤직팩토리", "밴드플레이"
  ],
  "강남": [
    "리듬앤블루스", "사운드웨이브", "강남스튜디오"
  ],
  "건대": [
    "잼스테이션", "뮤직박스", "사운드랩"
  ],
  "합정": [
    "합정사운드", "뮤직플레이"
  ],
};

export const regions = Object.keys(regionRooms);
