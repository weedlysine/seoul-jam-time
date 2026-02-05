 import { useState, useCallback } from "react";
 import { format, addDays, isSameDay } from "date-fns";
 import { ko } from "date-fns/locale";
 import { cn } from "@/lib/utils";
 
 interface ScheduleGridProps {
   startDate: Date;
   days: number;
   startHour: number;
   endHour: number;
   availability: Record<string, boolean>;
   onAvailabilityChange: (key: string, value: boolean) => void;
   participantAvailability?: Record<string, number>; // key -> count of participants available
   maxParticipants?: number;
   readOnly?: boolean;
   currentUserName?: string;
 }
 
 export function ScheduleGrid({
   startDate,
   days,
   startHour,
   endHour,
   availability,
   onAvailabilityChange,
   participantAvailability,
   maxParticipants = 1,
   readOnly = false,
 }: ScheduleGridProps) {
   const [isDragging, setIsDragging] = useState(false);
   const [dragValue, setDragValue] = useState(false);
 
   const dates = Array.from({ length: days }, (_, i) => addDays(startDate, i));
   const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
 
   const getSlotKey = (date: Date, hour: number) => {
     return `${format(date, "yyyy-MM-dd")}-${hour}`;
   };
 
   const handleMouseDown = useCallback((key: string) => {
     if (readOnly) return;
     setIsDragging(true);
     const newValue = !availability[key];
     setDragValue(newValue);
     onAvailabilityChange(key, newValue);
   }, [availability, onAvailabilityChange, readOnly]);
 
   const handleMouseEnter = useCallback((key: string) => {
     if (!isDragging || readOnly) return;
     onAvailabilityChange(key, dragValue);
   }, [isDragging, dragValue, onAvailabilityChange, readOnly]);
 
   const handleMouseUp = useCallback(() => {
     setIsDragging(false);
   }, []);
 
   const getHeatmapColor = (count: number) => {
     if (count === 0) return "bg-muted";
     const intensity = count / maxParticipants;
     if (intensity <= 0.25) return "bg-primary/20";
     if (intensity <= 0.5) return "bg-primary/40";
     if (intensity <= 0.75) return "bg-primary/60";
     return "bg-primary/90";
   };
 
   return (
     <div 
       className="select-none overflow-x-auto"
       onMouseUp={handleMouseUp}
       onMouseLeave={handleMouseUp}
     >
       <div className="min-w-fit">
         {/* Header - Dates */}
         <div className="flex">
           <div className="w-14 shrink-0" /> {/* Time column spacer */}
           {dates.map((date) => (
             <div
               key={date.toISOString()}
               className={cn(
                 "flex-1 min-w-[60px] text-center py-2 text-sm font-medium",
                 isSameDay(date, new Date()) && "text-primary"
               )}
             >
               <div className="text-xs text-muted-foreground">
                 {format(date, "EEE", { locale: ko })}
               </div>
               <div className="text-base font-bold">
                 {format(date, "d")}
               </div>
               <div className="text-xs text-muted-foreground">
                 {format(date, "M")}월
               </div>
             </div>
           ))}
         </div>
 
         {/* Time Grid */}
         <div className="flex">
           {/* Time Labels */}
           <div className="w-14 shrink-0">
             {hours.map((hour) => (
               <div
                 key={hour}
                 className="h-8 flex items-center justify-end pr-2 text-xs text-muted-foreground"
               >
                 {hour}:00
               </div>
             ))}
           </div>
 
           {/* Cells */}
           {dates.map((date) => (
             <div key={date.toISOString()} className="flex-1 min-w-[60px]">
               {hours.map((hour) => {
                 const key = getSlotKey(date, hour);
                 const isAvailable = availability[key];
                 const participantCount = participantAvailability?.[key] || 0;
                 const showHeatmap = participantAvailability && maxParticipants > 0;
 
                 return (
                   <div
                     key={key}
                     className={cn(
                       "h-8 border border-border/50 transition-colors cursor-pointer",
                       showHeatmap
                         ? getHeatmapColor(participantCount)
                         : isAvailable
                           ? "bg-primary/80 hover:bg-primary"
                           : "bg-muted hover:bg-muted/80",
                       readOnly && "cursor-default"
                     )}
                     onMouseDown={() => handleMouseDown(key)}
                     onMouseEnter={() => handleMouseEnter(key)}
                     title={showHeatmap ? `${participantCount}명 가능` : undefined}
                   />
                 );
               })}
             </div>
           ))}
         </div>
       </div>
     </div>
   );
 }