 import { Calendar } from "lucide-react";
 import { ScheduleSession } from "@/components/schedule/ScheduleSession";

const Schedule = () => {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">일정 조율</h1>
          <p className="text-sm text-muted-foreground">밴드 멤버들과 합주 일정을 맞춰보세요</p>
        </div>
      </div>

       <ScheduleSession />
    </div>
  );
};

export default Schedule;
