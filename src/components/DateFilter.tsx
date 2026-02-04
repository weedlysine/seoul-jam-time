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
import { useRef } from "react";

interface DateFilterProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateFilter({ selectedDate, onDateChange }: DateFilterProps) {
  const today = new Date();
  const quickDates = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

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

      {/* 14일 빠른 날짜 선택 */}
      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
      >
        {quickDates.map((date, index) => {
          const isToday = index === 0;
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
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
