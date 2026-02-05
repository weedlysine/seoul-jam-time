 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { useAuth } from "@/contexts/AuthContext";
 import { useBand } from "@/contexts/BandContext";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
 } from "@/components/ui/card";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog";
 import { Avatar, AvatarFallback } from "@/components/ui/avatar";
 import { Badge } from "@/components/ui/badge";
 import {
   Users,
   Plus,
   Copy,
   LogOut,
   Trash2,
   Calendar,
   Crown,
   UserPlus,
 } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 export default function Bands() {
   const { user } = useAuth();
   const {
     bands,
     currentBand,
     members,
     createBand,
     joinBand,
     selectBand,
     leaveBand,
     deleteBand,
   } = useBand();
   const navigate = useNavigate();
   const { toast } = useToast();
 
   const [showCreateDialog, setShowCreateDialog] = useState(false);
   const [showJoinDialog, setShowJoinDialog] = useState(false);
   const [newBandName, setNewBandName] = useState("");
   const [newBandDescription, setNewBandDescription] = useState("");
   const [inviteCode, setInviteCode] = useState("");
 
   if (!user) {
     return (
       <div className="container py-8">
         <Card className="max-w-md mx-auto">
           <CardHeader className="text-center">
             <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <CardTitle>로그인이 필요합니다</CardTitle>
             <CardDescription>
               밴드 그룹 기능을 사용하려면 로그인해주세요.
             </CardDescription>
           </CardHeader>
           <CardContent>
             <Button className="w-full" onClick={() => navigate("/auth")}>
               로그인하기
             </Button>
           </CardContent>
         </Card>
       </div>
     );
   }
 
   const handleCreateBand = () => {
     if (!newBandName.trim()) {
       toast({
         title: "밴드 이름을 입력해주세요",
         variant: "destructive",
       });
       return;
     }
 
     const band = createBand(newBandName, newBandDescription);
     if (band) {
       toast({
         title: "밴드 생성 완료!",
         description: `"${band.name}" 밴드가 생성되었습니다.`,
       });
       setShowCreateDialog(false);
       setNewBandName("");
       setNewBandDescription("");
     }
   };
 
   const handleJoinBand = () => {
     const result = joinBand(inviteCode);
     if (result.success) {
       toast({
         title: "밴드 가입 완료!",
         description: "밴드에 성공적으로 가입했습니다.",
       });
       setShowJoinDialog(false);
       setInviteCode("");
     } else {
       toast({
         title: "가입 실패",
         description: result.error,
         variant: "destructive",
       });
     }
   };
 
   const copyInviteCode = (code: string) => {
     navigator.clipboard.writeText(code);
     toast({
       title: "초대 코드 복사됨",
       description: "친구에게 공유해주세요!",
     });
   };
 
   const handleLeaveBand = (bandId: string, bandName: string) => {
     leaveBand(bandId);
     toast({
       title: "밴드 탈퇴",
       description: `"${bandName}" 밴드에서 탈퇴했습니다.`,
     });
   };
 
   const handleDeleteBand = (bandId: string, bandName: string) => {
     deleteBand(bandId);
     toast({
       title: "밴드 삭제",
       description: `"${bandName}" 밴드가 삭제되었습니다.`,
     });
   };
 
   return (
     <div className="container py-8">
       <div className="mb-8">
         <h1 className="text-2xl font-bold mb-2">내 밴드</h1>
         <p className="text-muted-foreground">
           밴드를 만들거나 초대 코드로 가입하세요
         </p>
       </div>
 
       {/* Action buttons */}
       <div className="flex gap-3 mb-8">
         <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
           <DialogTrigger asChild>
             <Button>
               <Plus className="h-4 w-4 mr-2" />
               밴드 만들기
             </Button>
           </DialogTrigger>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>새 밴드 만들기</DialogTitle>
               <DialogDescription>
                 밴드를 만들고 멤버를 초대하세요.
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label htmlFor="band-name">밴드 이름</Label>
                 <Input
                   id="band-name"
                   placeholder="예: 락앤롤 밴드"
                   value={newBandName}
                   onChange={(e) => setNewBandName(e.target.value)}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="band-description">설명 (선택)</Label>
                 <Textarea
                   id="band-description"
                   placeholder="밴드 소개를 입력하세요"
                   value={newBandDescription}
                   onChange={(e) => setNewBandDescription(e.target.value)}
                 />
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                 취소
               </Button>
               <Button onClick={handleCreateBand}>만들기</Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>
 
         <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
           <DialogTrigger asChild>
             <Button variant="outline">
               <UserPlus className="h-4 w-4 mr-2" />
               초대 코드로 가입
             </Button>
           </DialogTrigger>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>밴드 가입하기</DialogTitle>
               <DialogDescription>
                 초대 코드를 입력하여 밴드에 가입하세요.
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label htmlFor="invite-code">초대 코드</Label>
                 <Input
                   id="invite-code"
                   placeholder="예: ABC123"
                   value={inviteCode}
                   onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                   className="uppercase"
                 />
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setShowJoinDialog(false)}>
                 취소
               </Button>
               <Button onClick={handleJoinBand}>가입하기</Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>
       </div>
 
       {/* Band list */}
       {bands.length === 0 ? (
         <Card className="text-center py-12">
           <CardContent>
             <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <p className="text-muted-foreground mb-4">
               아직 가입한 밴드가 없습니다.
             </p>
             <p className="text-sm text-muted-foreground">
               새 밴드를 만들거나 초대 코드로 가입해보세요!
             </p>
           </CardContent>
         </Card>
       ) : (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           {bands.map((band) => {
             const isOwner = band.ownerId === user.id;
             const isSelected = currentBand?.id === band.id;
 
             return (
               <Card
                 key={band.id}
                 className={`cursor-pointer transition-all ${
                   isSelected ? "ring-2 ring-primary" : "hover:shadow-md"
                 }`}
                 onClick={() => selectBand(band.id)}
               >
                 <CardHeader className="pb-3">
                   <div className="flex items-start justify-between">
                     <div>
                       <CardTitle className="text-lg flex items-center gap-2">
                         {band.name}
                         {isOwner && (
                           <Crown className="h-4 w-4 text-yellow-500" />
                         )}
                       </CardTitle>
                       {band.description && (
                         <CardDescription className="mt-1">
                           {band.description}
                         </CardDescription>
                       )}
                     </div>
                     <Badge variant={isSelected ? "default" : "secondary"}>
                       {isSelected ? "선택됨" : `${band.memberIds.length + 1}명`}
                     </Badge>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <span>초대 코드:</span>
                       <code className="bg-muted px-2 py-0.5 rounded font-mono">
                         {band.inviteCode}
                       </code>
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-6 w-6"
                         onClick={(e) => {
                           e.stopPropagation();
                           copyInviteCode(band.inviteCode);
                         }}
                       >
                         <Copy className="h-3 w-3" />
                       </Button>
                     </div>
                     <div className="flex gap-1">
                       {isOwner ? (
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-8 w-8 text-destructive hover:text-destructive"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleDeleteBand(band.id, band.name);
                           }}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       ) : (
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-8 w-8"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleLeaveBand(band.id, band.name);
                           }}
                         >
                           <LogOut className="h-4 w-4" />
                         </Button>
                       )}
                     </div>
                   </div>
                 </CardContent>
               </Card>
             );
           })}
         </div>
       )}
 
       {/* Selected band details */}
       {currentBand && (
         <div className="mt-8 space-y-6">
           <div className="flex items-center justify-between">
             <h2 className="text-xl font-semibold">
               {currentBand.name} - 멤버 ({members.length}명)
             </h2>
             <Button onClick={() => navigate("/band-schedule")}>
               <Calendar className="h-4 w-4 mr-2" />
               일정 관리
             </Button>
           </div>
 
           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
             {members.map((member) => (
               <Card key={member.id} className="p-4">
                 <div className="flex items-center gap-3">
                   <Avatar>
                     <AvatarFallback className="bg-primary/10 text-primary">
                       {member.nickname.slice(0, 2)}
                     </AvatarFallback>
                   </Avatar>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium truncate flex items-center gap-2">
                       {member.nickname}
                       {member.role === "owner" && (
                         <Crown className="h-3 w-3 text-yellow-500" />
                       )}
                     </p>
                     <p className="text-xs text-muted-foreground truncate">
                       {member.email}
                     </p>
                   </div>
                 </div>
               </Card>
             ))}
           </div>
         </div>
       )}
 
       <div className="mt-8 text-center">
         <p className="text-xs text-muted-foreground">
           ⚠️ 데모 버전: 데이터는 브라우저에만 저장됩니다
         </p>
       </div>
     </div>
   );
 }