 import { useState } from "react";
 import { format, addDays } from "date-fns";
 import { ko } from "date-fns/locale";
 import { Calendar, Users, Copy, Check, Plus, Eye } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Calendar as CalendarComponent } from "@/components/ui/calendar";
 import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { ScheduleGrid } from "./ScheduleGrid";
 import { cn } from "@/lib/utils";
 import { toast } from "sonner";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 
 interface Participant {
   name: string;
   availability: Record<string, boolean>;
 }
 
 interface ScheduleSessionData {
   id: string;
   title: string;
   startDate: Date;
   days: number;
   startHour: number;
   endHour: number;
   participants: Participant[];
 }
 
 export function ScheduleSession() {
   const [step, setStep] = useState<"create" | "participate" | "view">("create");
   const [session, setSession] = useState<ScheduleSessionData | null>(null);
   const [copied, setCopied] = useState(false);
   
   // Create form state
   const [title, setTitle] = useState("");
   const [startDate, setStartDate] = useState<Date>(new Date());
   const [days, setDays] = useState(7);
   const [startHour, setStartHour] = useState(10);
   const [endHour, setEndHour] = useState(24);
   
   // Participate state
   const [participantName, setParticipantName] = useState("");
   const [myAvailability, setMyAvailability] = useState<Record<string, boolean>>({});
 
   // View state
   const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
 
   const handleCreateSession = () => {
     if (!title.trim()) {
       toast.error("일정 제목을 입력해주세요");
       return;
     }
 
     const newSession: ScheduleSessionData = {
       id: Math.random().toString(36).substring(7),
       title: title.trim(),
       startDate,
       days,
       startHour,
       endHour,
       participants: [],
     };
 
     setSession(newSession);
     setStep("participate");
     toast.success("일정이 생성되었습니다!");
   };
 
   const handleJoinSession = () => {
     if (!participantName.trim()) {
       toast.error("이름을 입력해주세요");
       return;
     }
 
     if (!session) return;
 
     const newParticipant: Participant = {
       name: participantName.trim(),
       availability: { ...myAvailability },
     };
 
     setSession({
       ...session,
       participants: [...session.participants, newParticipant],
     });
 
     setStep("view");
     toast.success("참여가 완료되었습니다!");
   };
 
   const handleAvailabilityChange = (key: string, value: boolean) => {
     setMyAvailability((prev) => ({
       ...prev,
       [key]: value,
     }));
   };
 
   const getParticipantAvailability = (): { counts: Record<string, number>; names: Record<string, string[]> } => {
     if (!session) return { counts: {}, names: {} };
     
     const counts: Record<string, number> = {};
     const names: Record<string, string[]> = {};
     session.participants.forEach((p) => {
       Object.entries(p.availability).forEach(([key, value]) => {
         if (value) {
           counts[key] = (counts[key] || 0) + 1;
           if (!names[key]) names[key] = [];
           names[key].push(p.name);
         }
       });
     });
     return { counts, names };
   };
 
   const copyLink = () => {
     navigator.clipboard.writeText(window.location.href);
     setCopied(true);
     toast.success("링크가 복사되었습니다");
     setTimeout(() => setCopied(false), 2000);
   };
 
   const handleAddAnother = () => {
     setParticipantName("");
     setMyAvailability({});
     setStep("participate");
   };
 
   const handleReset = () => {
     setStep("create");
     setSession(null);
     setTitle("");
     setParticipantName("");
     setMyAvailability({});
   };
 
   if (step === "create") {
     return (
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Calendar className="h-5 w-5 text-primary" />
             새 일정 조율 만들기
           </CardTitle>
           <CardDescription>
             밴드 멤버들과 합주 가능한 시간을 찾아보세요
           </CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
           {/* Title */}
           <div className="space-y-2">
             <Label htmlFor="title">일정 제목</Label>
             <Input
               id="title"
               placeholder="예: 3월 정기 합주"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
             />
           </div>
 
           {/* Date Range */}
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label>시작 날짜</Label>
               <Popover>
                 <PopoverTrigger asChild>
                   <Button
                     variant="outline"
                     className="w-full justify-start text-left font-normal"
                   >
                     <Calendar className="mr-2 h-4 w-4" />
                     {format(startDate, "M월 d일 (EEE)", { locale: ko })}
                   </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-auto p-0" align="start">
                   <CalendarComponent
                     mode="single"
                     selected={startDate}
                     onSelect={(date) => date && setStartDate(date)}
                     disabled={(date) => date < new Date()}
                     initialFocus
                     className="pointer-events-auto"
                   />
                 </PopoverContent>
               </Popover>
             </div>
 
             <div className="space-y-2">
               <Label>기간</Label>
               <Select value={days.toString()} onValueChange={(v) => setDays(Number(v))}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="5">5일</SelectItem>
                   <SelectItem value="7">7일 (1주)</SelectItem>
                   <SelectItem value="14">14일 (2주)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>
 
           {/* Time Range */}
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label>시작 시간</Label>
               <Select value={startHour.toString()} onValueChange={(v) => setStartHour(Number(v))}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {Array.from({ length: 24 }, (_, i) => (
                     <SelectItem key={i} value={i.toString()}>
                       {i}:00
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
 
             <div className="space-y-2">
               <Label>종료 시간</Label>
               <Select value={endHour.toString()} onValueChange={(v) => setEndHour(Number(v))}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                     <SelectItem key={hour} value={hour.toString()} disabled={hour <= startHour}>
                       {hour}:00
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
           </div>
 
           <Button onClick={handleCreateSession} className="w-full">
             일정 조율 시작하기
           </Button>
         </CardContent>
       </Card>
     );
   }
 
   if (step === "participate" && session) {
     return (
       <div className="space-y-6">
         <Card>
           <CardHeader>
             <div className="flex items-center justify-between">
               <div>
                 <CardTitle className="text-lg">{session.title}</CardTitle>
                 <CardDescription>
                   {format(session.startDate, "M월 d일", { locale: ko })} ~ {format(addDays(session.startDate, session.days - 1), "M월 d일", { locale: ko })}
                 </CardDescription>
               </div>
               <Button variant="outline" size="sm" onClick={copyLink}>
                 {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                 링크 복사
               </Button>
             </div>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="name">이름</Label>
               <Input
                 id="name"
                 placeholder="닉네임 또는 이름"
                 value={participantName}
                 onChange={(e) => setParticipantName(e.target.value)}
               />
             </div>
 
             <div className="space-y-2">
               <Label>가능한 시간을 드래그해서 선택하세요</Label>
               <div className="border rounded-lg p-3 bg-secondary/30">
                 <ScheduleGrid
                   startDate={session.startDate}
                   days={session.days}
                   startHour={session.startHour}
                   endHour={session.endHour}
                   availability={myAvailability}
                   onAvailabilityChange={handleAvailabilityChange}
                 />
               </div>
               <p className="text-xs text-muted-foreground">
                 💡 클릭하거나 드래그해서 가능한 시간을 표시하세요
               </p>
             </div>
 
             <Button onClick={handleJoinSession} className="w-full">
               참여 완료
             </Button>
           </CardContent>
         </Card>
       </div>
     );
   }
 
   if (step === "view" && session) {
     const { counts: participantAvailability, names: participantNames } = getParticipantAvailability();
     
     return (
       <div className="space-y-6">
         <Card>
           <CardHeader>
             <div className="flex items-center justify-between">
               <div>
                 <CardTitle className="text-lg">{session.title}</CardTitle>
                 <CardDescription>
                   {format(session.startDate, "M월 d일", { locale: ko })} ~ {format(addDays(session.startDate, session.days - 1), "M월 d일", { locale: ko })}
                 </CardDescription>
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={copyLink}>
                   {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                   공유
                 </Button>
               </div>
             </div>
           </CardHeader>
           <CardContent className="space-y-4">
             {/* Participants */}
             {/* Participants */}
             <div className="flex items-center gap-2 flex-wrap">
               <Users className="h-4 w-4 text-muted-foreground" />
               <span className="text-sm text-muted-foreground">참여자:</span>
               {session.participants.map((p, i) => (
                 <span
                   key={i}
                   className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-sm"
                 >
                   {p.name}
                 </span>
               ))}
             </div>
 
             {/* Heatmap Legend */}
             <div className="flex items-center gap-3 text-sm">
               <span className="text-muted-foreground">가능 인원:</span>
               <div className="flex items-center gap-1">
                 <div className="w-4 h-4 rounded bg-muted border" />
                 <span className="text-xs">0</span>
               </div>
               <div className="flex items-center gap-1">
                 <div className="w-4 h-4 rounded bg-primary/20" />
                 <span className="text-xs">1+</span>
               </div>
               <div className="flex items-center gap-1">
                 <div className="w-4 h-4 rounded bg-primary/60" />
                 <span className="text-xs">대부분</span>
               </div>
               <div className="flex items-center gap-1">
                 <div className="w-4 h-4 rounded bg-primary/90" />
                 <span className="text-xs">전원</span>
               </div>
             </div>
 
             {/* Heatmap Grid */}
             <div className="border rounded-lg p-3 bg-secondary/30">
               <p className="text-xs text-muted-foreground mb-2">
                 💡 각 시간 칸에 마우스를 올리면 가능한 멤버를 확인할 수 있어요
               </p>
               <ScheduleGrid
                 startDate={session.startDate}
                 days={session.days}
                 startHour={session.startHour}
                 endHour={session.endHour}
                 availability={{}}
                 onAvailabilityChange={() => {}}
                 participantAvailability={participantAvailability}
                 participantNames={participantNames}
                 maxParticipants={session.participants.length}
                 readOnly
                 allParticipants={session.participants}
               />
             </div>
 
             <div className="flex gap-2">
               <Button variant="outline" onClick={handleAddAnother} className="flex-1">
                 <Plus className="h-4 w-4 mr-1" />
                 다른 멤버 추가
               </Button>
               <Button variant="ghost" onClick={handleReset}>
                 새로 만들기
               </Button>
             </div>
           </CardContent>
         </Card>
       </div>
     );
   }
 
   return null;
 }