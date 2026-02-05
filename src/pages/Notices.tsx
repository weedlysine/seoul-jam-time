 import { useState } from "react";
 import { Bell, PenSquare, Clock, Pin, ChevronRight } from "lucide-react";
 import { Card, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { cn } from "@/lib/utils";
 import { format } from "date-fns";
 import { ko } from "date-fns/locale";
 import { PostEditor } from "@/components/community/PostEditor";
 
 interface Notice {
   id: string;
   title: string;
   content: string;
   author: string;
   category: string;
   createdAt: Date;
   isPinned?: boolean;
 }
 
 const categories = [
   { value: "update", label: "업데이트" },
   { value: "event", label: "이벤트" },
   { value: "notice", label: "안내" },
   { value: "maintenance", label: "점검" },
 ];

const Notices = () => {
   const [notices, setNotices] = useState<Notice[]>([
     {
       id: "1",
       title: "밴드룸 서비스 오픈 안내",
       content: "안녕하세요! 밴드룸 서비스가 정식 오픈했습니다. 많은 이용 부탁드립니다.",
       author: "관리자",
       category: "notice",
       createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
       isPinned: true,
     },
     {
       id: "2",
       title: "일정 조율 기능 추가",
       content: "밴드 멤버들과 합주 시간을 조율할 수 있는 WhenToMeet 스타일 기능이 추가되었습니다.",
       author: "관리자",
       category: "update",
       createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
       isPinned: false,
     },
     {
       id: "3",
       title: "커뮤니티 게시판 오픈",
       content: "밴드 멤버 구인, 장비 거래, 공연 정보 등을 공유할 수 있는 커뮤니티가 오픈했습니다.",
       author: "관리자",
       category: "update",
       createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
       isPinned: false,
     },
   ]);
 
   const [isWriting, setIsWriting] = useState(false);
 
   const handleSubmit = (newPost: { title: string; content: string; author: string; category: string }) => {
     const notice: Notice = {
       id: Math.random().toString(36).substring(7),
       title: newPost.title,
       content: newPost.content,
       author: newPost.author,
       category: newPost.category,
       createdAt: new Date(),
       isPinned: false,
     };
 
     setNotices([notice, ...notices]);
     setIsWriting(false);
   };
 
   const getCategoryLabel = (value: string) => {
     return categories.find((c) => c.value === value)?.label || value;
   };
 
   const formatDate = (date: Date) => {
     return format(date, "yyyy.MM.dd", { locale: ko });
   };
 
   // Sort: pinned first, then by date
   const sortedNotices = [...notices].sort((a, b) => {
     if (a.isPinned && !b.isPinned) return -1;
     if (!a.isPinned && b.isPinned) return 1;
     return b.createdAt.getTime() - a.createdAt.getTime();
   });
 
   if (isWriting) {
     return (
       <PostEditor
         onSubmit={handleSubmit}
         onCancel={() => setIsWriting(false)}
         categories={categories}
       />
     );
   }
 
  return (
    <div className="container py-6 space-y-6">
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
             <Bell className="h-5 w-5 text-primary" />
           </div>
           <div>
             <h1 className="text-2xl font-bold">공지사항</h1>
             <p className="text-sm text-muted-foreground">밴드룸 소식과 업데이트</p>
           </div>
        </div>
         <Button onClick={() => setIsWriting(true)}>
           <PenSquare className="h-4 w-4 mr-2" />
           글쓰기
         </Button>
      </div>

       {/* Notices List */}
       <div className="space-y-2">
         {sortedNotices.length === 0 ? (
           <Card className="border-dashed">
             <CardContent className="py-12 text-center">
               <p className="text-muted-foreground">아직 공지사항이 없습니다</p>
             </CardContent>
           </Card>
         ) : (
           sortedNotices.map((notice) => (
             <Card 
               key={notice.id} 
               className={cn(
                 "hover:bg-muted/30 transition-colors cursor-pointer group",
                 notice.isPinned && "border-primary/30 bg-primary/5"
               )}
             >
               <CardContent className="p-4">
                 <div className="flex items-center gap-3">
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-1">
                       {notice.isPinned && (
                         <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
                       )}
                       <Badge variant="outline" className="text-xs shrink-0">
                         {getCategoryLabel(notice.category)}
                       </Badge>
                       <h3 className="text-sm font-medium truncate">{notice.title}</h3>
                     </div>
                     <p className="text-sm text-muted-foreground line-clamp-1 mb-1.5">
                       {notice.content}
                     </p>
                     <div className="flex items-center gap-3 text-xs text-muted-foreground">
                       <span>{notice.author}</span>
                       <span className="flex items-center gap-1">
                         <Clock className="h-3 w-3" />
                         {formatDate(notice.createdAt)}
                       </span>
                     </div>
                   </div>
                   <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                 </div>
               </CardContent>
             </Card>
           ))
         )}
       </div>
    </div>
  );
};

export default Notices;
