 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { useAuth } from "@/contexts/AuthContext";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { Music, Mail, Lock, User, Loader2 } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 export default function Auth() {
   const [isLoading, setIsLoading] = useState(false);
   const { login, signup } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
 
   // Login form state
   const [loginEmail, setLoginEmail] = useState("");
   const [loginPassword, setLoginPassword] = useState("");
 
   // Signup form state
   const [signupEmail, setSignupEmail] = useState("");
   const [signupPassword, setSignupPassword] = useState("");
   const [signupNickname, setSignupNickname] = useState("");
 
   const handleLogin = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     const result = await login(loginEmail, loginPassword);
 
     if (result.success) {
       toast({
         title: "로그인 성공",
         description: "밴드룸에 오신 것을 환영합니다!",
       });
       navigate("/");
     } else {
       toast({
         title: "로그인 실패",
         description: result.error,
         variant: "destructive",
       });
     }
 
     setIsLoading(false);
   };
 
   const handleSignup = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     if (signupPassword.length < 6) {
       toast({
         title: "회원가입 실패",
         description: "비밀번호는 6자 이상이어야 합니다.",
         variant: "destructive",
       });
       setIsLoading(false);
       return;
     }
 
     const result = await signup(signupEmail, signupPassword, signupNickname);
 
     if (result.success) {
       toast({
         title: "회원가입 성공",
         description: "밴드룸에 가입하신 것을 환영합니다!",
       });
       navigate("/");
     } else {
       toast({
         title: "회원가입 실패",
         description: result.error,
         variant: "destructive",
       });
     }
 
     setIsLoading(false);
   };
 
   return (
     <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
       <Card className="w-full max-w-md">
         <CardHeader className="text-center">
           <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
             <Music className="h-6 w-6 text-primary-foreground" />
           </div>
           <CardTitle className="text-2xl">밴드룸</CardTitle>
           <CardDescription>서울 합주실 빈 시간 검색 서비스</CardDescription>
         </CardHeader>
         <CardContent>
           <Tabs defaultValue="login" className="w-full">
             <TabsList className="grid w-full grid-cols-2">
               <TabsTrigger value="login">로그인</TabsTrigger>
               <TabsTrigger value="signup">회원가입</TabsTrigger>
             </TabsList>
 
             <TabsContent value="login" className="mt-6">
               <form onSubmit={handleLogin} className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="login-email">이메일</Label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="login-email"
                       type="email"
                       placeholder="email@example.com"
                       value={loginEmail}
                       onChange={(e) => setLoginEmail(e.target.value)}
                       className="pl-10"
                       required
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="login-password">비밀번호</Label>
                   <div className="relative">
                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="login-password"
                       type="password"
                       placeholder="••••••••"
                       value={loginPassword}
                       onChange={(e) => setLoginPassword(e.target.value)}
                       className="pl-10"
                       required
                     />
                   </div>
                 </div>
                 <Button type="submit" className="w-full" disabled={isLoading}>
                   {isLoading ? (
                     <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       로그인 중...
                     </>
                   ) : (
                     "로그인"
                   )}
                 </Button>
               </form>
             </TabsContent>
 
             <TabsContent value="signup" className="mt-6">
               <form onSubmit={handleSignup} className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="signup-nickname">닉네임</Label>
                   <div className="relative">
                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="signup-nickname"
                       type="text"
                       placeholder="밴드보이"
                       value={signupNickname}
                       onChange={(e) => setSignupNickname(e.target.value)}
                       className="pl-10"
                       required
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="signup-email">이메일</Label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="signup-email"
                       type="email"
                       placeholder="email@example.com"
                       value={signupEmail}
                       onChange={(e) => setSignupEmail(e.target.value)}
                       className="pl-10"
                       required
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="signup-password">비밀번호</Label>
                   <div className="relative">
                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="signup-password"
                       type="password"
                       placeholder="6자 이상"
                       value={signupPassword}
                       onChange={(e) => setSignupPassword(e.target.value)}
                       className="pl-10"
                       required
                     />
                   </div>
                 </div>
                 <Button type="submit" className="w-full" disabled={isLoading}>
                   {isLoading ? (
                     <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       가입 중...
                     </>
                   ) : (
                     "회원가입"
                   )}
                 </Button>
               </form>
             </TabsContent>
           </Tabs>
 
           <div className="mt-6 text-center">
             <p className="text-xs text-muted-foreground">
               ⚠️ 데모 버전: 데이터는 브라우저에만 저장됩니다
             </p>
           </div>
         </CardContent>
       </Card>
     </div>
   );
 }