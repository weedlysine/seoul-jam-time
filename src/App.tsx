import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Notices from "./pages/Notices";
import Studios from "./pages/Studios";
import Schedule from "./pages/Schedule";
 import Community from "./pages/Community";
 import Auth from "./pages/Auth";
 import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

 const App = () => (
   <QueryClientProvider client={queryClient}>
     <AuthProvider>
       <TooltipProvider>
         <Toaster />
         <Sonner />
         <BrowserRouter>
           <AppLayout>
             <Routes>
               <Route path="/" element={<Index />} />
               <Route path="/notices" element={<Notices />} />
               <Route path="/studios" element={<Studios />} />
               <Route path="/schedule" element={<Schedule />} />
               <Route path="/community" element={<Community />} />
               <Route path="/auth" element={<Auth />} />
               {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
               <Route path="*" element={<NotFound />} />
             </Routes>
           </AppLayout>
         </BrowserRouter>
       </TooltipProvider>
     </AuthProvider>
   </QueryClientProvider>
 );

export default App;
