 import { useState } from "react";
 import { 
   Building2, 
   MapPin, 
   Clock, 
   Star, 
   Music, 
   Mic2, 
   Drum,
   Guitar,
   Speaker,
   Wifi,
   Car,
   Coffee,
   ChevronRight,
   MessageSquare,
   ExternalLink
 } from "lucide-react";
 import { Card, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { cn } from "@/lib/utils";
 
 interface Studio {
   id: string;
   name: string;
   region: string;
   address: string;
   priceRange: string;
   rating: number;
   reviewCount: number;
   imageUrl: string;
   amenities: string[];
   rooms: number;
   openHours: string;
   description: string;
   naverUrl?: string;
 }
 
 const amenityIcons: Record<string, React.ReactNode> = {
   "드럼": <Drum className="h-3.5 w-3.5" />,
   "기타앰프": <Guitar className="h-3.5 w-3.5" />,
   "베이스앰프": <Music className="h-3.5 w-3.5" />,
   "마이크": <Mic2 className="h-3.5 w-3.5" />,
   "PA시스템": <Speaker className="h-3.5 w-3.5" />,
   "와이파이": <Wifi className="h-3.5 w-3.5" />,
   "주차": <Car className="h-3.5 w-3.5" />,
   "음료": <Coffee className="h-3.5 w-3.5" />,
 };
 
 const regions = ["전체", "홍대", "신촌", "강남", "건대", "합정"];

const Studios = () => {
   const [selectedRegion, setSelectedRegion] = useState("전체");
 
   const studios: Studio[] = [
     {
       id: "1",
       name: "라온합주실",
       region: "홍대",
       address: "서울 마포구 와우산로 123",
       priceRange: "15,000원~/시간",
       rating: 4.8,
       reviewCount: 127,
       imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop",
       amenities: ["드럼", "기타앰프", "베이스앰프", "마이크", "PA시스템"],
       rooms: 5,
       openHours: "10:00 - 02:00",
       description: "홍대 최고의 시설을 자랑하는 합주실입니다. Pearl 드럼과 Marshall 앰프 구비.",
     },
     {
       id: "2",
       name: "사운드홀릭",
       region: "홍대",
       address: "서울 마포구 홍익로 45",
       priceRange: "12,000원~/시간",
       rating: 4.5,
       reviewCount: 89,
       imageUrl: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=300&fit=crop",
       amenities: ["드럼", "기타앰프", "마이크", "와이파이", "음료"],
       rooms: 4,
       openHours: "12:00 - 24:00",
       description: "아늑한 분위기의 합주실. 무료 음료 제공.",
     },
     {
       id: "3",
       name: "리듬앤블루스",
       region: "강남",
       address: "서울 강남구 테헤란로 234",
       priceRange: "20,000원~/시간",
       rating: 4.9,
       reviewCount: 203,
       imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
       amenities: ["드럼", "기타앰프", "베이스앰프", "마이크", "PA시스템", "주차"],
       rooms: 8,
       openHours: "09:00 - 03:00",
       description: "강남 최대 규모 합주실. 녹음 스튜디오 병설. 주차 가능.",
     },
     {
       id: "4",
       name: "잼스테이션",
       region: "건대",
       address: "서울 광진구 능동로 78",
       priceRange: "10,000원~/시간",
       rating: 4.3,
       reviewCount: 56,
       imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
       amenities: ["드럼", "기타앰프", "마이크", "와이파이"],
       rooms: 3,
       openHours: "14:00 - 24:00",
       description: "건대 근처 가성비 좋은 합주실. 학생 할인 있음.",
     },
     {
       id: "5",
       name: "신촌사운드",
       region: "신촌",
       address: "서울 서대문구 연세로 56",
       priceRange: "13,000원~/시간",
       rating: 4.6,
       reviewCount: 94,
       imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop",
       amenities: ["드럼", "기타앰프", "베이스앰프", "마이크", "음료"],
       rooms: 4,
       openHours: "11:00 - 01:00",
       description: "신촌역 도보 3분. 깨끗한 시설과 친절한 서비스.",
     },
     {
       id: "6",
       name: "합정사운드",
       region: "합정",
       address: "서울 마포구 양화로 89",
       priceRange: "14,000원~/시간",
       rating: 4.7,
       reviewCount: 78,
       imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop",
       amenities: ["드럼", "기타앰프", "마이크", "PA시스템", "와이파이"],
       rooms: 3,
       openHours: "12:00 - 02:00",
       description: "합정역 근처 분위기 좋은 합주실. 방음 최고.",
     },
   ];
 
   const filteredStudios = selectedRegion === "전체"
     ? studios
     : studios.filter((s) => s.region === selectedRegion);
 
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">합주실 정보</h1>
          <p className="text-sm text-muted-foreground">서울 합주실 상세 정보 및 리뷰</p>
        </div>
      </div>

       {/* Region Filter */}
       <div className="flex items-center gap-2 overflow-x-auto pb-1">
         {regions.map((region) => (
           <button
             key={region}
             onClick={() => setSelectedRegion(region)}
             className={cn(
               "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
               selectedRegion === region
                 ? "bg-primary text-primary-foreground"
                 : "bg-secondary hover:bg-muted text-foreground"
             )}
           >
             {region}
           </button>
         ))}
       </div>
 
       {/* Studios Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredStudios.map((studio) => (
           <Card key={studio.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
             {/* Image */}
             <div className="relative h-40 overflow-hidden">
               <img
                 src={studio.imageUrl}
                 alt={studio.name}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               />
               <div className="absolute top-2 left-2">
                 <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                   {studio.region}
                 </Badge>
               </div>
               <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                 <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                 <span className="text-sm font-medium">{studio.rating}</span>
                 <span className="text-xs text-muted-foreground">({studio.reviewCount})</span>
               </div>
             </div>
 
             <CardContent className="p-4">
               {/* Header */}
               <div className="flex items-start justify-between mb-2">
                 <div>
                   <h3 className="font-semibold text-base">{studio.name}</h3>
                   <p className="text-xs text-muted-foreground flex items-center gap-1">
                     <MapPin className="h-3 w-3" />
                     {studio.address}
                   </p>
                 </div>
                 <span className="text-sm font-bold text-primary">{studio.priceRange}</span>
               </div>
 
               {/* Description */}
               <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                 {studio.description}
               </p>
 
               {/* Info */}
               <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                 <span className="flex items-center gap-1">
                   <Clock className="h-3 w-3" />
                   {studio.openHours}
                 </span>
                 <span>{studio.rooms}개 룸</span>
               </div>
 
               {/* Amenities */}
               <div className="flex items-center gap-1.5 flex-wrap mb-3">
                 {studio.amenities.slice(0, 5).map((amenity) => (
                   <Badge key={amenity} variant="secondary" className="text-xs gap-1 py-0.5">
                     {amenityIcons[amenity]}
                     {amenity}
                   </Badge>
                 ))}
                 {studio.amenities.length > 5 && (
                   <Badge variant="secondary" className="text-xs py-0.5">
                     +{studio.amenities.length - 5}
                   </Badge>
                 )}
               </div>
 
               {/* Actions */}
               <div className="flex items-center gap-2 pt-2 border-t">
                 <Button variant="outline" size="sm" className="flex-1 text-xs">
                   <MessageSquare className="h-3.5 w-3.5 mr-1" />
                   후기 {studio.reviewCount}
                 </Button>
                 <Button size="sm" className="flex-1 text-xs">
                   <ExternalLink className="h-3.5 w-3.5 mr-1" />
                   예약하기
                 </Button>
               </div>
             </CardContent>
           </Card>
         ))}
       </div>
 
       {/* Empty State */}
       {filteredStudios.length === 0 && (
         <Card className="border-dashed">
           <CardContent className="py-12 text-center">
             <p className="text-muted-foreground">해당 지역에 등록된 합주실이 없습니다</p>
           </CardContent>
         </Card>
       )}
 
       {/* Info Card */}
       <Card className="bg-muted/50">
         <CardContent className="py-4">
           <h3 className="text-sm font-medium mb-2">💡 합주실 정보 안내</h3>
           <ul className="text-xs text-muted-foreground space-y-1">
             <li>• 가격 및 운영시간은 변경될 수 있으니 예약 전 확인해주세요</li>
             <li>• 합주실 정보 수정 요청은 커뮤니티에 문의해주세요</li>
             <li>• 새로운 합주실 등록을 원하시면 관리자에게 연락주세요</li>
           </ul>
         </CardContent>
       </Card>
    </div>
  );
};

export default Studios;
