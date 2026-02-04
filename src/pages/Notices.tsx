import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Notices = () => {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">공지사항</h1>
          <p className="text-sm text-muted-foreground">밴드룸 소식과 업데이트</p>
        </div>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">준비 중입니다</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            공지사항 기능이 곧 추가될 예정입니다. 사이트 업데이트, 새로운 기능 소개, 이벤트 안내 등을 확인하실 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notices;
