import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Studios = () => {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">합주실 정보</h1>
          <p className="text-sm text-muted-foreground">서울 합주실 상세 정보 및 리뷰</p>
        </div>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">준비 중입니다</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            각 합주실의 상세 정보, 시설 사진, 가격 정보, 사용자 리뷰 등을 확인할 수 있는 기능이 곧 추가됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Studios;
