import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Community = () => {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">커뮤니티</h1>
          <p className="text-sm text-muted-foreground">밴드 동호인들과 소통하세요</p>
        </div>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">준비 중입니다</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            밴드 멤버 구인, 장비 거래, 공연 정보 공유, 자유 게시판 등 다양한 커뮤니티 기능이 곧 추가됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;
