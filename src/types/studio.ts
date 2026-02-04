export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Studio {
  id: string;
  name: string;
  location: string;
  district: string;
  pricePerHour: number;
  imageUrl: string;
  amenities: string[];
  rating: number;
  timeSlots: TimeSlot[];
  naverBookingUrl: string;
}

export interface FilterState {
  date: Date;
  district: string | null;
  timeRange: [number, number];
  priceRange: [number, number];
}
