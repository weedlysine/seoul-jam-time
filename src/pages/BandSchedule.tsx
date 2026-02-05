 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { format, parseISO, startOfWeek, addDays, isSameDay } from "date-fns";
 import { ko } from "date-fns/locale";
 import { useAuth } from "@/contexts/AuthContext";
 import { useBand } from "@/contexts/BandContext";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Calendar } from "@/components/ui/calendar";
 import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
 } from "@/components/ui/card";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Badge } from "@/components/ui/badge";
 import {
   CalendarDays,
   Plus,
   Clock,
   MapPin,
   Trash2,
   ChevronLeft,
   ChevronRight,
   Users,
 } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 export default function BandSchedule() {
   const { user } = useAuth();
   const { bands, currentBand, schedules, members, selectBand, addSchedule, deleteSchedule } =
     useBand();
   const navigate = useNavigate();
   const { toast } = useToast();
 
   const [showAddDialog, setShowAddDialog] = useState(false);
   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
   const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
 
   // New schedule form
   const [newTitle, setNewTitle] = useState("");
   const [newDate, setNewDate] = useState<Date | undefined>(new Date());
   const [newStartTime, setNewStartTime] = useState("19:00");
   const [newEndTime, setNewEndTime] = useState("21:00");
   const [newLocation, setNewLocation] = useState("");
   const [newMemo, setNewMemo] = useState("");
 
   if (!user) {
     return (
       <div className="container py-8">
         <Card className="max-w-md mx-auto">
           <CardHeader className="text-center">
             <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <CardTitle>로그인이 필요합니다</CardTitle>
             <CardDescription>
               밴드 일정 기능을 사용하려면 로그인해주세요.
             </CardDescription>
           </CardHeader>
           <CardContent>
             <Button className="w-full" onClick={() => navigate("/auth")}>
               로그인하기
             </Button>
           </CardContent>
         </Card>
       </div>
     );
   }
 
   if (bands.length === 0) {
     return (
       <div className="container py-8">
         <Card className="max-w-md mx-auto">
           <CardHeader className="text-center">
             <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <CardTitle>밴드가 없습니다</CardTitle>
             <CardDescription>
               먼저 밴드를 만들거나 가입해주세요.
             </CardDescription>
           </CardHeader>
           <CardContent>
             <Button className="w-full" onClick={() => navigate("/bands")}>
               밴드 관리로 이동
             </Button>
           </CardContent>
         </Card>
       </div>
     );
   }
 
   const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
 
   const handleAddSchedule = () => {
     if (!newTitle.trim() || !newDate || !currentBand) {
       toast({
         title: "필수 정보를 입력해주세요",
         variant: "destructive",
       });
       return;
     }
 
     addSchedule({
       bandId: currentBand.id,
       title: newTitle,
       date: format(newDate, "yyyy-MM-dd"),
       startTime: newStartTime,
       endTime: newEndTime,
       location: newLocation,
       memo: newMemo,
     });
 
     toast({
       title: "일정 추가 완료!",
       description: `${format(newDate, "M월 d일")} ${newTitle}`,
     });
 
     setShowAddDialog(false);
     setNewTitle("");
     setNewDate(new Date());
     setNewStartTime("19:00");
     setNewEndTime("21:00");
     setNewLocation("");
     setNewMemo("");
   };
 
   const handleDeleteSchedule = (scheduleId: string, title: string) => {
     deleteSchedule(scheduleId);
     toast({
       title: "일정 삭제됨",
       description: `"${title}" 일정이 삭제되었습니다.`,
     });
   };
 
   const getSchedulesForDate = (date: Date) => {
     return schedules.filter((s) => s.date === format(date, "yyyy-MM-dd"));
   };
 
   const getMemberName = (userId: string) => {
     const member = members.find((m) => m.id === userId);
     return member?.nickname || "알 수 없음";
   };
 
   const timeSlots = Array.from({ length: 24 }, (_, i) => {
     const hour = i.toString().padStart(2, "0");
     return `${hour}:00`;
   });
 
   return (
     <div className="container py-8">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
         <div>
           <h1 className="text-2xl font-bold mb-2">밴드 일정</h1>
           <p className="text-muted-foreground">
             밴드 멤버들과 합주 일정을 공유하세요
           </p>
         </div>
 
         <div className="flex items-center gap-3">
           <Select
             value={currentBand?.id || ""}
             onValueChange={(id) => selectBand(id)}
           >
             <SelectTrigger className="w-[180px]">
               <SelectValue placeholder="밴드 선택" />
             </SelectTrigger>
             <SelectContent>
               {bands.map((band) => (
                 <SelectItem key={band.id} value={band.id}>
                   {band.name}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
 
           {currentBand && (
             <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
               <DialogTrigger asChild>
                 <Button>
                   <Plus className="h-4 w-4 mr-2" />
                   일정 추가
                 </Button>
               </DialogTrigger>
               <DialogContent className="max-w-md">
                 <DialogHeader>
                   <DialogTitle>새 일정 추가</DialogTitle>
                   <DialogDescription>
                     {currentBand.name}의 새 일정을 추가합니다.
                   </DialogDescription>
                 </DialogHeader>
                 <div className="space-y-4 py-4">
                   <div className="space-y-2">
                     <Label>일정 제목</Label>
                     <Input
                       placeholder="예: 정기 합주"
                       value={newTitle}
                       onChange={(e) => setNewTitle(e.target.value)}
                     />
                   </div>
 
                   <div className="space-y-2">
                     <Label>날짜</Label>
                     <Calendar
                       mode="single"
                       selected={newDate}
                       onSelect={setNewDate}
                       className="rounded-md border"
                       locale={ko}
                     />
                   </div>
 
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>시작 시간</Label>
                       <Select value={newStartTime} onValueChange={setNewStartTime}>
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           {timeSlots.map((time) => (
                             <SelectItem key={time} value={time}>
                               {time}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <Label>종료 시간</Label>
                       <Select value={newEndTime} onValueChange={setNewEndTime}>
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           {timeSlots.map((time) => (
                             <SelectItem key={time} value={time}>
                               {time}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
 
                   <div className="space-y-2">
                     <Label>장소</Label>
                     <Input
                       placeholder="예: 홍대 OO합주실"
                       value={newLocation}
                       onChange={(e) => setNewLocation(e.target.value)}
                     />
                   </div>
 
                   <div className="space-y-2">
                     <Label>메모</Label>
                     <Textarea
                       placeholder="추가 정보를 입력하세요"
                       value={newMemo}
                       onChange={(e) => setNewMemo(e.target.value)}
                     />
                   </div>
                 </div>
                 <DialogFooter>
                   <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                     취소
                   </Button>
                   <Button onClick={handleAddSchedule}>추가</Button>
                 </DialogFooter>
               </DialogContent>
             </Dialog>
           )}
         </div>
       </div>
 
       {!currentBand ? (
         <Card className="text-center py-12">
           <CardContent>
             <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <p className="text-muted-foreground">
               밴드를 선택하면 일정이 표시됩니다.
             </p>
           </CardContent>
         </Card>
       ) : (
         <>
           {/* Week navigation */}
           <div className="flex items-center justify-between mb-4">
             <Button
               variant="outline"
               size="icon"
               onClick={() => setWeekStart(addDays(weekStart, -7))}
             >
               <ChevronLeft className="h-4 w-4" />
             </Button>
             <span className="font-medium">
               {format(weekStart, "yyyy년 M월", { locale: ko })}
             </span>
             <Button
               variant="outline"
               size="icon"
               onClick={() => setWeekStart(addDays(weekStart, 7))}
             >
               <ChevronRight className="h-4 w-4" />
             </Button>
           </div>
 
           {/* Week calendar */}
           <div className="grid grid-cols-7 gap-2 mb-8">
             {weekDays.map((day) => {
               const daySchedules = getSchedulesForDate(day);
               const isToday = isSameDay(day, new Date());
               const isSelected = isSameDay(day, selectedDate);
 
               return (
                 <Card
                   key={day.toISOString()}
                   className={`cursor-pointer transition-all min-h-[120px] ${
                     isSelected ? "ring-2 ring-primary" : ""
                   } ${isToday ? "bg-primary/5" : ""}`}
                   onClick={() => setSelectedDate(day)}
                 >
                   <CardHeader className="p-2 pb-1">
                     <div className="text-center">
                       <p className="text-xs text-muted-foreground">
                         {format(day, "EEE", { locale: ko })}
                       </p>
                       <p
                         className={`text-lg font-semibold ${
                           isToday ? "text-primary" : ""
                         }`}
                       >
                         {format(day, "d")}
                       </p>
                     </div>
                   </CardHeader>
                   <CardContent className="p-2 pt-0">
                     {daySchedules.slice(0, 2).map((schedule) => (
                       <Badge
                         key={schedule.id}
                         variant="secondary"
                         className="w-full justify-start text-xs mb-1 truncate"
                       >
                         {schedule.title}
                       </Badge>
                     ))}
                     {daySchedules.length > 2 && (
                       <p className="text-xs text-muted-foreground text-center">
                         +{daySchedules.length - 2}개
                       </p>
                     )}
                   </CardContent>
                 </Card>
               );
             })}
           </div>
 
           {/* Selected day schedules */}
           <div>
             <h2 className="text-lg font-semibold mb-4">
               {format(selectedDate, "M월 d일 (EEE)", { locale: ko })} 일정
             </h2>
 
             {getSchedulesForDate(selectedDate).length === 0 ? (
               <Card className="text-center py-8">
                 <CardContent>
                   <p className="text-muted-foreground">
                     이 날에는 일정이 없습니다.
                   </p>
                 </CardContent>
               </Card>
             ) : (
               <div className="space-y-3">
                 {getSchedulesForDate(selectedDate).map((schedule) => (
                   <Card key={schedule.id}>
                     <CardContent className="p-4">
                       <div className="flex items-start justify-between">
                         <div className="flex-1">
                           <h3 className="font-medium mb-2">{schedule.title}</h3>
                           <div className="space-y-1 text-sm text-muted-foreground">
                             <div className="flex items-center gap-2">
                               <Clock className="h-4 w-4" />
                               <span>
                                 {schedule.startTime} - {schedule.endTime}
                               </span>
                             </div>
                             {schedule.location && (
                               <div className="flex items-center gap-2">
                                 <MapPin className="h-4 w-4" />
                                 <span>{schedule.location}</span>
                               </div>
                             )}
                           </div>
                           {schedule.memo && (
                             <p className="mt-2 text-sm bg-muted p-2 rounded">
                               {schedule.memo}
                             </p>
                           )}
                           <p className="text-xs text-muted-foreground mt-2">
                             작성자: {getMemberName(schedule.createdBy)}
                           </p>
                         </div>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="text-destructive hover:text-destructive"
                           onClick={() =>
                             handleDeleteSchedule(schedule.id, schedule.title)
                           }
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             )}
           </div>
         </>
       )}
 
       <div className="mt-8 text-center">
         <p className="text-xs text-muted-foreground">
           ⚠️ 데모 버전: 데이터는 브라우저에만 저장됩니다
         </p>
       </div>
     </div>
   );
 }