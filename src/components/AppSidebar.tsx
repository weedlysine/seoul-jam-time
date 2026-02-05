 import { Music, Search, Bell, Building2, Calendar, Users, LogIn, LogOut } from "lucide-react";
 import { NavLink } from "@/components/NavLink";
 import { useLocation, useNavigate } from "react-router-dom";
 import { useAuth } from "@/contexts/AuthContext";
 import { Avatar, AvatarFallback } from "@/components/ui/avatar";
 import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { title: "빈 시간 검색", url: "/", icon: Search },
  { title: "공지사항", url: "/notices", icon: Bell },
  { title: "합주실 정보", url: "/studios", icon: Building2 },
];

const communityMenuItems = [
  { title: "일정 조율", url: "/schedule", icon: Calendar },
  { title: "커뮤니티", url: "/community", icon: Users },
];

 export function AppSidebar() {
   const { state } = useSidebar();
   const collapsed = state === "collapsed";
   const location = useLocation();
   const navigate = useNavigate();
   const currentPath = location.pathname;
   const { user, logout } = useAuth();
 
   const handleLogout = () => {
     logout();
     navigate("/");
   };

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary">
            <Music className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight">밴드룸</span>
              <span className="text-xs text-sidebar-foreground/60">밴드 커뮤니티</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메인</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>커뮤니티</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communityMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

       <SidebarFooter className="border-t border-sidebar-border">
         {user ? (
           <div className="flex flex-col gap-2 px-2 py-2">
             <div className="flex items-center gap-2">
               <Avatar className="h-8 w-8">
                 <AvatarFallback className="bg-primary/10 text-primary text-xs">
                   {user.nickname.slice(0, 2)}
                 </AvatarFallback>
               </Avatar>
               {!collapsed && (
                 <div className="flex flex-col flex-1 min-w-0">
                   <span className="text-sm font-medium truncate">{user.nickname}</span>
                   <span className="text-xs text-sidebar-foreground/60 truncate">{user.email}</span>
                 </div>
               )}
             </div>
             {!collapsed && (
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={handleLogout}
                 className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground"
               >
                 <LogOut className="h-4 w-4 mr-2" />
                 로그아웃
               </Button>
             )}
           </div>
         ) : (
           <div className="px-2 py-2">
             <Button
               variant="default"
               size={collapsed ? "icon" : "sm"}
               onClick={() => navigate("/auth")}
               className={collapsed ? "w-8 h-8" : "w-full"}
             >
               <LogIn className={collapsed ? "h-4 w-4" : "h-4 w-4 mr-2"} />
               {!collapsed && "로그인"}
             </Button>
           </div>
         )}
         <div className="flex items-center justify-between px-2 py-2 border-t border-sidebar-border/50">
           {!collapsed && (
             <span className="text-xs text-sidebar-foreground/60">테마</span>
           )}
           <ThemeSwitcher />
         </div>
       </SidebarFooter>
    </Sidebar>
  );
}
