 import { useState } from "react";
 import { X, Image, Link2, Bold, Italic, List, AlertCircle } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Label } from "@/components/ui/label";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Card, CardContent } from "@/components/ui/card";
 import { Separator } from "@/components/ui/separator";
 import { cn } from "@/lib/utils";
 import { toast } from "sonner";
 
 interface PostEditorProps {
   onSubmit: (post: {
     title: string;
     content: string;
     author: string;
     category: string;
   }) => void;
   onCancel: () => void;
   categories: { value: string; label: string }[];
 }
 
 export function PostEditor({ onSubmit, onCancel, categories }: PostEditorProps) {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [author, setAuthor] = useState("");
   const [category, setCategory] = useState("free");
   const [errors, setErrors] = useState<Record<string, string>>({});
 
   const validate = () => {
     const newErrors: Record<string, string> = {};
     
     if (!author.trim()) {
       newErrors.author = "닉네임을 입력해주세요";
     } else if (author.trim().length > 20) {
       newErrors.author = "닉네임은 20자 이내로 입력해주세요";
     }
     
     if (!title.trim()) {
       newErrors.title = "제목을 입력해주세요";
     } else if (title.trim().length > 100) {
       newErrors.title = "제목은 100자 이내로 입력해주세요";
     }
     
     if (!content.trim()) {
       newErrors.content = "내용을 입력해주세요";
     } else if (content.trim().length > 5000) {
       newErrors.content = "내용은 5000자 이내로 입력해주세요";
     }
     
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
 
   const handleSubmit = () => {
     if (!validate()) {
       toast.error("입력 내용을 확인해주세요");
       return;
     }
 
     onSubmit({
       title: title.trim(),
       content: content.trim(),
       author: author.trim(),
       category,
     });
   };
 
   const insertFormat = (format: string) => {
     // Simple formatting helper - in real implementation would use rich text editor
     const textarea = document.getElementById("post-content") as HTMLTextAreaElement;
     if (!textarea) return;
     
     const start = textarea.selectionStart;
     const end = textarea.selectionEnd;
     const selectedText = content.substring(start, end);
     
     let newText = "";
     switch (format) {
       case "bold":
         newText = `**${selectedText || "텍스트"}**`;
         break;
       case "italic":
         newText = `*${selectedText || "텍스트"}*`;
         break;
       case "list":
         newText = `\n- ${selectedText || "항목"}`;
         break;
       case "link":
         newText = `[${selectedText || "링크 텍스트"}](URL)`;
         break;
       default:
         return;
     }
     
     setContent(content.substring(0, start) + newText + content.substring(end));
   };
 
   return (
     <div className="fixed inset-0 z-50 bg-background">
       {/* Header */}
       <div className="sticky top-0 z-10 bg-background border-b">
         <div className="container flex items-center justify-between h-14">
           <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={onCancel}>
               <X className="h-5 w-5" />
             </Button>
             <h1 className="text-lg font-semibold">글쓰기</h1>
           </div>
           <Button onClick={handleSubmit}>
             게시하기
           </Button>
         </div>
       </div>
 
       {/* Content */}
       <div className="container max-w-3xl py-6 space-y-6">
         {/* Author & Category */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="author" className="text-sm font-medium">
               닉네임 <span className="text-destructive">*</span>
             </Label>
             <Input
               id="author"
               placeholder="닉네임을 입력하세요"
               value={author}
               onChange={(e) => setAuthor(e.target.value)}
               maxLength={20}
               className={cn(errors.author && "border-destructive")}
             />
             {errors.author ? (
               <p className="text-xs text-destructive flex items-center gap-1">
                 <AlertCircle className="h-3 w-3" />
                 {errors.author}
               </p>
             ) : (
               <p className="text-xs text-muted-foreground">{author.length}/20</p>
             )}
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="category" className="text-sm font-medium">
               카테고리 <span className="text-destructive">*</span>
             </Label>
             <Select value={category} onValueChange={setCategory}>
               <SelectTrigger id="category">
                 <SelectValue placeholder="카테고리 선택" />
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
 
         <Separator />
 
         {/* Title */}
         <div className="space-y-2">
           <Label htmlFor="title" className="text-sm font-medium">
             제목 <span className="text-destructive">*</span>
           </Label>
           <Input
             id="title"
             placeholder="제목을 입력하세요"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             maxLength={100}
             className={cn("text-lg", errors.title && "border-destructive")}
           />
           {errors.title ? (
             <p className="text-xs text-destructive flex items-center gap-1">
               <AlertCircle className="h-3 w-3" />
               {errors.title}
             </p>
           ) : (
             <p className="text-xs text-muted-foreground">{title.length}/100</p>
           )}
         </div>
 
         {/* Content */}
         <div className="space-y-2">
           <div className="flex items-center justify-between">
             <Label htmlFor="post-content" className="text-sm font-medium">
               내용 <span className="text-destructive">*</span>
             </Label>
             
             {/* Formatting Toolbar */}
             <div className="flex items-center gap-1">
               <Button
                 type="button"
                 variant="ghost"
                 size="icon"
                 className="h-8 w-8"
                 onClick={() => insertFormat("bold")}
                 title="굵게"
               >
                 <Bold className="h-4 w-4" />
               </Button>
               <Button
                 type="button"
                 variant="ghost"
                 size="icon"
                 className="h-8 w-8"
                 onClick={() => insertFormat("italic")}
                 title="기울임"
               >
                 <Italic className="h-4 w-4" />
               </Button>
               <Button
                 type="button"
                 variant="ghost"
                 size="icon"
                 className="h-8 w-8"
                 onClick={() => insertFormat("list")}
                 title="목록"
               >
                 <List className="h-4 w-4" />
               </Button>
               <Button
                 type="button"
                 variant="ghost"
                 size="icon"
                 className="h-8 w-8"
                 onClick={() => insertFormat("link")}
                 title="링크"
               >
                 <Link2 className="h-4 w-4" />
               </Button>
             </div>
           </div>
           
           <Textarea
             id="post-content"
             placeholder="내용을 입력하세요..."
             value={content}
             onChange={(e) => setContent(e.target.value)}
             maxLength={5000}
             className={cn(
               "min-h-[300px] resize-y text-base leading-relaxed",
               errors.content && "border-destructive"
             )}
           />
           {errors.content ? (
             <p className="text-xs text-destructive flex items-center gap-1">
               <AlertCircle className="h-3 w-3" />
               {errors.content}
             </p>
           ) : (
             <p className="text-xs text-muted-foreground">{content.length}/5000</p>
           )}
         </div>
 
         {/* Image Upload Placeholder */}
         <Card className="border-dashed">
           <CardContent className="py-8">
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
               <Image className="h-8 w-8" />
               <p className="text-sm">이미지 첨부 (준비 중)</p>
               <p className="text-xs">백엔드 연동 후 사용 가능합니다</p>
             </div>
           </CardContent>
         </Card>
 
         {/* Guidelines */}
         <Card className="bg-muted/50">
           <CardContent className="py-4">
             <h3 className="text-sm font-medium mb-2">작성 안내</h3>
             <ul className="text-xs text-muted-foreground space-y-1">
               <li>• 욕설, 비방, 광고성 글은 삭제될 수 있습니다</li>
               <li>• 개인정보 노출에 주의해주세요</li>
               <li>• 장비 거래 시 직거래를 권장합니다</li>
             </ul>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }