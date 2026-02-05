 import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
 
 export interface DemoUser {
   id: string;
   email: string;
   nickname: string;
   createdAt: string;
 }
 
 interface AuthContextType {
   user: DemoUser | null;
   isLoading: boolean;
   login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
   signup: (email: string, password: string, nickname: string) => Promise<{ success: boolean; error?: string }>;
   logout: () => void;
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 const STORAGE_KEY = "bandroom_demo_auth";
 const USERS_KEY = "bandroom_demo_users";
 
 interface StoredUser {
   id: string;
   email: string;
   password: string;
   nickname: string;
   createdAt: string;
 }
 
 export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<DemoUser | null>(null);
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     // Check for existing session
     const storedAuth = localStorage.getItem(STORAGE_KEY);
     if (storedAuth) {
       try {
         const parsedUser = JSON.parse(storedAuth) as DemoUser;
         setUser(parsedUser);
       } catch {
         localStorage.removeItem(STORAGE_KEY);
       }
     }
     setIsLoading(false);
   }, []);
 
   const getStoredUsers = (): StoredUser[] => {
     try {
       const stored = localStorage.getItem(USERS_KEY);
       return stored ? JSON.parse(stored) : [];
     } catch {
       return [];
     }
   };
 
   const saveStoredUsers = (users: StoredUser[]) => {
     localStorage.setItem(USERS_KEY, JSON.stringify(users));
   };
 
   const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
     // Simulate API delay
     await new Promise((resolve) => setTimeout(resolve, 500));
 
     const users = getStoredUsers();
     const foundUser = users.find((u) => u.email === email && u.password === password);
 
     if (!foundUser) {
       return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
     }
 
     const demoUser: DemoUser = {
       id: foundUser.id,
       email: foundUser.email,
       nickname: foundUser.nickname,
       createdAt: foundUser.createdAt,
     };
 
     setUser(demoUser);
     localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
     return { success: true };
   };
 
   const signup = async (
     email: string,
     password: string,
     nickname: string
   ): Promise<{ success: boolean; error?: string }> => {
     // Simulate API delay
     await new Promise((resolve) => setTimeout(resolve, 500));
 
     const users = getStoredUsers();
 
     // Check if email already exists
     if (users.some((u) => u.email === email)) {
       return { success: false, error: "이미 사용 중인 이메일입니다." };
     }
 
     const newUser: StoredUser = {
       id: crypto.randomUUID(),
       email,
       password,
       nickname,
       createdAt: new Date().toISOString(),
     };
 
     users.push(newUser);
     saveStoredUsers(users);
 
     const demoUser: DemoUser = {
       id: newUser.id,
       email: newUser.email,
       nickname: newUser.nickname,
       createdAt: newUser.createdAt,
     };
 
     setUser(demoUser);
     localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
     return { success: true };
   };
 
   const logout = () => {
     setUser(null);
     localStorage.removeItem(STORAGE_KEY);
   };
 
   return (
     <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
       {children}
     </AuthContext.Provider>
   );
 }
 
 export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
     throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
 }