 import { useState } from "react";
 import { Users, PenSquare, MessageCircle, Heart, Clock } from "lucide-react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Label } from "@/components/ui/label";
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Badge } from "@/components/ui/badge";
 import { cn } from "@/lib/utils";
 import { format } from "date-fns";
 import { ko } from "date-fns/locale";
 
 interface Post {
   id: string;
   title: string;
   content: string;
   author: string;
   category: string;
   createdAt: Date;
   likes: number;
   comments: number;
 }
 
 const categories = [
   { value: "free", label: "자유", color: "bg-secondary text-secondary-foreground" },
   { value: "recruit", label: "멤버 구인", color: "bg-primary/20 text-primary" },
   { value: "gear", label: "장비 거래", color: "bg-orange-500/20 text-orange-600 dark:text-orange-400" },
   { value: "gig", label: "공연 정보", color: "bg-purple-500/20 text-purple-600 dark:text-purple-400" },
   { value: "question", label: "질문", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
 ];

const Community = () => {
   const [posts, setPosts] = useState<Post[]>([
     {
       id: "1",
       title: "홍대 근처 드러머 구합니다!",
       content: "저희 밴드는 인디락 장르를 주로 하고 있고, 매주 토요일 합주합니다. 관심있으신 분 연락주세요!",
       author: "기타리스트김",
       category: "recruit",
       createdAt: new Date(Date.now() - 1000 * 60 * 30),
       likes: 5,
       comments: 3,
     },
     {
       id: "2",
       title: "펜더 스트랫 판매합니다",
       content: "2020년식 펜더 아메리칸 프로페셔널 스트랫 판매합니다. 상태 최상급입니다.",
       author: "베이시스트박",
       category: "gear",
       createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
       likes: 12,
       comments: 8,
     },
     {
       id: "3",
       title: "이번 주 금요일 홍대 클럽 공연 있어요",
       content: "저희 밴드 첫 공연이에요! 많이 와주세요 ㅎㅎ",
       author: "보컬이",
       category: "gig",
       createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
       likes: 24,
       comments: 15,
     },
   ]);
 
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [newPost, setNewPost] = useState({
     title: "",
     content: "",
     author: "",
     category: "free",
   });
   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
 
   const handleSubmit = () => {
     if (!newPost.title.trim() || !newPost.content.trim() || !newPost.author.trim()) {
       return;
     }
 
     const post: Post = {
       id: Math.random().toString(36).substring(7),
       title: newPost.title.trim(),
       content: newPost.content.trim(),
       author: newPost.author.trim(),
       category: newPost.category,
       createdAt: new Date(),
       likes: 0,
       comments: 0,
     };
 
     setPosts([post, ...posts]);
     setNewPost({ title: "", content: "", author: "", category: "free" });
     setIsDialogOpen(false);
   };
 
   const getCategoryInfo = (value: string) => {
     return categories.find((c) => c.value === value) || categories[0];
   };
 
   const filteredPosts = selectedCategory
     ? posts.filter((p) => p.category === selectedCategory)
     : posts;
 
   const formatTimeAgo = (date: Date) => {
     const now = new Date();
     const diff = now.getTime() - date.getTime();
     const minutes = Math.floor(diff / (1000 * 60));
     const hours = Math.floor(diff / (1000 * 60 * 60));
     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
 
     if (minutes < 60) return `${minutes}분 전`;
     if (hours < 24) return `${hours}시간 전`;
     if (days < 7) return `${days}일 전`;
     return format(date, "M월 d일", { locale: ko });
   };
 
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

       {/* Category Filter & Write Button */}
       <div className="flex items-center justify-between gap-4">
         <div className="flex items-center gap-2 overflow-x-auto pb-1">
           <button
             onClick={() => setSelectedCategory(null)}
             className={cn(
               "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
               selectedCategory === null
                 ? "bg-primary text-primary-foreground"
                 : "bg-secondary hover:bg-muted text-foreground"
             )}
           >
             전체
           </button>
           {categories.map((cat) => (
             <button
               key={cat.value}
               onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
               className={cn(
                 "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                 selectedCategory === cat.value
                   ? "bg-primary text-primary-foreground"
                   : "bg-secondary hover:bg-muted text-foreground"
               )}
             >
               {cat.label}
             </button>
           ))}
         </div>
 
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
           <DialogTrigger asChild>
             <Button className="shrink-0">
               <PenSquare className="h-4 w-4 mr-2" />
               글쓰기
             </Button>
           </DialogTrigger>
           <DialogContent className="sm:max-w-[500px]">
             <DialogHeader>
               <DialogTitle>새 글 작성</DialogTitle>
             </DialogHeader>
             <div className="space-y-4 pt-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="author">닉네임</Label>
                   <Input
                     id="author"
                     placeholder="닉네임"
                     value={newPost.author}
                     onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="category">카테고리</Label>
                   <Select
                     value={newPost.category}
                     onValueChange={(v) => setNewPost({ ...newPost, category: v })}
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       {categories.map((cat) => (
                         <SelectItem key={cat.value} value={cat.value}>
                           {cat.label}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="title">제목</Label>
                 <Input
                   id="title"
                   placeholder="제목을 입력하세요"
                   value={newPost.title}
                   onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                 />
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="content">내용</Label>
                 <Textarea
                   id="content"
                   placeholder="내용을 입력하세요"
                   rows={5}
                   value={newPost.content}
                   onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                 />
               </div>
 
               <Button onClick={handleSubmit} className="w-full">
                 게시하기
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </div>
 
       {/* Posts List */}
       <div className="space-y-3">
         {filteredPosts.length === 0 ? (
           <Card className="border-dashed">
             <CardContent className="py-12 text-center">
               <p className="text-muted-foreground">아직 게시글이 없습니다</p>
             </CardContent>
           </Card>
         ) : (
           filteredPosts.map((post) => {
             const categoryInfo = getCategoryInfo(post.category);
             return (
               <Card key={post.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                 <CardContent className="p-4">
                   <div className="flex items-start gap-3">
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <Badge variant="secondary" className={cn("text-xs", categoryInfo.color)}>
                           {categoryInfo.label}
                         </Badge>
                         <span className="text-sm font-medium truncate">{post.title}</span>
                       </div>
                       <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                         {post.content}
                       </p>
                       <div className="flex items-center gap-4 text-xs text-muted-foreground">
                         <span>{post.author}</span>
                         <span className="flex items-center gap-1">
                           <Clock className="h-3 w-3" />
                           {formatTimeAgo(post.createdAt)}
                         </span>
                         <span className="flex items-center gap-1">
                           <Heart className="h-3 w-3" />
                           {post.likes}
                         </span>
                         <span className="flex items-center gap-1">
                           <MessageCircle className="h-3 w-3" />
                           {post.comments}
                         </span>
                       </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             );
           })
         )}
       </div>
    </div>
  );
};

export default Community;
