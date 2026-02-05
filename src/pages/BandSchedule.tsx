import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameDay,
  isSameMonth,
} from "date-fns";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showScheduleSheet, setShowScheduleSheet] = useState(false);

  // New schedule form
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState<Date | undefined>(new Date());
  const [newStartTime, setNewStartTime] = useState("19:00");
  const [newEndTime, setNewEndTime] = useState("21:00");
  const [newLocation, setNewLocation] = useState("");
  const [newMemo, setNewMemo] = useState("");

  if (!user) {
    return (
      <div className="container px-4 py-6 sm:py-8">
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
      <div className="container px-4 py-6 sm:py-8">
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

  // Generate calendar days for the month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

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

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // On mobile, show sheet with schedule details
    if (window.innerWidth < 1024) {
      setShowScheduleSheet(true);
    }
  };

  const selectedDateSchedules = getSchedulesForDate(selectedDate);

  // Schedule list component (used in both sidebar and sheet)
  const ScheduleList = () => (
    <>
      {selectedDateSchedules.length === 0 ? (
        <div className="text-center py-8">
          <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            이 날에는 일정이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {selectedDateSchedules.map((schedule) => (
            <Card key={schedule.id} className="bg-muted/50">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {schedule.title}
                    </h3>
                    <div className="space-y-0.5 mt-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                      {schedule.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{schedule.location}</span>
                        </div>
                      )}
                    </div>
                    {schedule.memo && (
                      <p className="mt-2 text-xs bg-background p-2 rounded">
                        {schedule.memo}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      작성: {getMemberName(schedule.createdBy)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                    onClick={() =>
                      handleDeleteSchedule(schedule.id, schedule.title)
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="container px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">밴드 일정</h1>
          <p className="text-sm text-muted-foreground">
            밴드 멤버들과 합주 일정을 공유하세요
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select
            value={currentBand?.id || ""}
            onValueChange={(id) => selectBand(id)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
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
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  일정 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4">
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
                      className="rounded-md border mx-auto"
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
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)} className="w-full sm:w-auto">
                    취소
                  </Button>
                  <Button onClick={handleAddSchedule} className="w-full sm:w-auto">추가</Button>
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
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Monthly Calendar */}
          <Card>
            <CardHeader className="pb-2 px-3 sm:px-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="text-lg sm:text-xl">
                  {format(currentMonth, "yyyy년 M월", { locale: ko })}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {/* Week day headers */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                {weekDays.map((day, idx) => (
                  <div
                    key={day}
                    className={`text-center text-xs sm:text-sm font-medium py-1 sm:py-2 ${
                      idx === 0 ? "text-destructive" : idx === 6 ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                {calendarDays.map((day) => {
                  const daySchedules = getSchedulesForDate(day);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const dayOfWeek = day.getDay();

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-[48px] sm:min-h-[80px] p-0.5 sm:p-1 border rounded-md cursor-pointer transition-all hover:bg-accent/50 ${
                        isSelected ? "ring-2 ring-primary bg-accent" : ""
                      } ${!isCurrentMonth ? "opacity-40" : ""} ${
                        isToday ? "bg-primary/10" : ""
                      }`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div
                        className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 ${
                          isToday
                            ? "bg-primary text-primary-foreground w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs"
                            : dayOfWeek === 0
                            ? "text-destructive"
                            : dayOfWeek === 6
                            ? "text-primary"
                            : ""
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                      {/* Mobile: just show dot indicator */}
                      <div className="sm:hidden">
                        {daySchedules.length > 0 && (
                          <div className="flex justify-center gap-0.5">
                            {daySchedules.slice(0, 3).map((_, idx) => (
                              <div key={idx} className="w-1 h-1 rounded-full bg-primary" />
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Desktop: show schedule titles */}
                      <div className="hidden sm:block space-y-0.5">
                        {daySchedules.slice(0, 2).map((schedule) => (
                          <div
                            key={schedule.id}
                            className="text-[10px] bg-primary/20 text-primary rounded px-1 truncate"
                          >
                            {schedule.title}
                          </div>
                        ))}
                        {daySchedules.length > 2 && (
                          <div className="text-[10px] text-muted-foreground">
                            +{daySchedules.length - 2}개
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Desktop: Selected day schedules sidebar */}
          <div className="hidden lg:block">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {format(selectedDate, "M월 d일 (EEEE)", { locale: ko })}
                </CardTitle>
                <CardDescription>
                  {selectedDateSchedules.length}개의 일정
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScheduleList />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Mobile: Schedule sheet */}
      <Sheet open={showScheduleSheet} onOpenChange={setShowScheduleSheet}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
          <SheetHeader className="text-left">
            <SheetTitle>
              {format(selectedDate, "M월 d일 (EEEE)", { locale: ko })}
            </SheetTitle>
            <SheetDescription>
              {selectedDateSchedules.length}개의 일정
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto max-h-[calc(70vh-100px)]">
            <ScheduleList />
          </div>
        </SheetContent>
      </Sheet>

      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          ⚠️ 데모 버전: 데이터는 브라우저에만 저장됩니다
        </p>
      </div>
    </div>
  );
}
