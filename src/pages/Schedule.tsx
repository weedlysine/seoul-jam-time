import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">WhenToMeet 스타일 일정 조율</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            밴드 멤버들의 가능한 시간을 한눈에 확인하고 최적의 합주 시간을 찾을 수 있는 기능이 곧 추가됩니다. 
            링크를 공유하여 멤버들의 스케줄을 수집하세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;
