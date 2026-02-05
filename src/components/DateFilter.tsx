import { format, addDays, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRef, useState, useCallback, type PointerEvent, type MouseEvent } from "react";

interface DateFilterProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateFilter({ selectedDate, onDateChange }: DateFilterProps) {
  const today = new Date();
  const quickDates = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 드래그 스크롤 상태
  const [isDragging, setIsDragging] = useState(false);

  // NOTE: 클릭/드래그 구분은 state가 아닌 ref로 처리해야
  // (pointerdown → click 사이에 re-render가 없어도) 값이 즉시 반영됩니다.
  const pointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const isCapturedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragThreshold = 5; // 드래그로 인식할 최소 이동 거리

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    pointerDownRef.current = true;
    hasDraggedRef.current = false; // 새 인터랙션 시작 시 즉시 리셋
    isCapturedRef.current = false;
    setIsDragging(false);

    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;

    // IMPORTANT: 여기서 바로 pointer capture를 잡아버리면
    // click 이벤트 타겟이 컨테이너로 가면서 버튼 onClick이 안 탈 수 있어
    // '드래그로 판정된 순간'에만 capture를 잡습니다.
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current || !scrollRef.current) return;

    const x = e.pageX - scrollRef.current.offsetLeft;
    const dx = x - startXRef.current;

    // 임계값을 넘어야 드래그로 인식
    if (Math.abs(dx) > dragThreshold) {
      if (!isCapturedRef.current) {
        isCapturedRef.current = true;
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }

      hasDraggedRef.current = true;
      e.preventDefault();
      scrollRef.current.scrollLeft = scrollLeftRef.current - dx * 1.5;
    }
  }, []);

  const handlePointerEnd = useCallback((e: PointerEvent<HTMLDivElement>) => {
    pointerDownRef.current = false;
    setIsDragging(false);
    if (isCapturedRef.current) {
      isCapturedRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  }, []);

  // 날짜 클릭 핸들러 - 드래그가 아닐 때만 날짜 변경
  const handleDateClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>, date: Date) => {
      if (hasDraggedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onDateChange(date);
    },
    [onDateChange],
  );

  return (
    <div className="space-y-3">
      {/* 캘린더 피커 */}
      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 bg-secondary border-border hover:bg-muted"
            >
              <Calendar className="h-4 w-4 text-primary" />
              <span>{format(selectedDate, "M월 d일 (EEE)", { locale: ko })}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              disabled={(date) => date < today}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* 스크롤 버튼 */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 14일 빠른 날짜 선택 - 드래그 스크롤 지원 */}
      <div 
        ref={scrollRef}
        className={cn(
          "flex gap-2 overflow-x-auto pb-2 scrollbar-hide touch-pan-x",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
      >
        {quickDates.map((date, index) => {
          const isToday = index === 0;
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          return (
            <button
              key={date.toISOString()}
              onClick={(e) => handleDateClick(e, date)}
              className={cn(
                "flex flex-col items-center min-w-[48px] px-2 py-2 rounded-xl transition-all duration-200 shrink-0",
                isSameDay(date, selectedDate)
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : isWeekend
                    ? "bg-secondary/80 hover:bg-muted text-orange-400"
                    : "bg-secondary hover:bg-muted text-foreground"
              )}
            >
              <span className={cn(
                "text-[10px] font-medium",
                isSameDay(date, selectedDate) ? "opacity-90" : "opacity-60"
              )}>
                {isToday ? "오늘" : format(date, "EEE", { locale: ko })}
              </span>
              <span className="text-lg font-bold">{format(date, "d")}</span>
              <span className={cn(
                "text-[9px]",
                isSameDay(date, selectedDate) ? "opacity-70" : "opacity-40"
              )}>
                {format(date, "M")}월
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
