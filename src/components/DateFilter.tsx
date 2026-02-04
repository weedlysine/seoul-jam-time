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

interface DateFilterProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateFilter({ selectedDate, onDateChange }: DateFilterProps) {
  const today = new Date();
  const quickDates = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="space-y-4">
      {/* 캘린더 피커 */}
      <div className="flex items-center gap-3">
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

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDateChange(addDays(selectedDate, -1))}
            disabled={isSameDay(selectedDate, today)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDateChange(addDays(selectedDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 빠른 날짜 선택 */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {quickDates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => onDateChange(date)}
            className={cn(
              "flex flex-col items-center min-w-[52px] px-3 py-2 rounded-xl transition-all duration-200",
              isSameDay(date, selectedDate)
                ? "bg-primary text-primary-foreground shadow-elevated"
                : "bg-secondary hover:bg-muted text-foreground"
            )}
          >
            <span className="text-[10px] font-medium opacity-70">
              {format(date, "EEE", { locale: ko })}
            </span>
            <span className="text-lg font-bold">{format(date, "d")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
