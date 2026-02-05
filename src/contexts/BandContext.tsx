 import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
 import { Band, BandSchedule, BandMember } from "@/types/band";
 import { useAuth, DemoUser } from "./AuthContext";
 
 interface BandContextType {
   bands: Band[];
   currentBand: Band | null;
   schedules: BandSchedule[];
   members: BandMember[];
   createBand: (name: string, description: string) => Band | null;
   joinBand: (inviteCode: string) => { success: boolean; error?: string };
   selectBand: (bandId: string) => void;
   leaveBand: (bandId: string) => void;
   deleteBand: (bandId: string) => void;
   addSchedule: (schedule: Omit<BandSchedule, "id" | "createdBy" | "createdAt">) => BandSchedule | null;
   updateSchedule: (scheduleId: string, updates: Partial<BandSchedule>) => void;
   deleteSchedule: (scheduleId: string) => void;
 }
 
 const BandContext = createContext<BandContextType | undefined>(undefined);
 
 const BANDS_KEY = "bandroom_bands";
 const SCHEDULES_KEY = "bandroom_band_schedules";
 const USERS_KEY = "bandroom_demo_users";
 
 function generateInviteCode(): string {
   return Math.random().toString(36).substring(2, 8).toUpperCase();
 }
 
 export function BandProvider({ children }: { children: ReactNode }) {
   const { user } = useAuth();
   const [bands, setBands] = useState<Band[]>([]);
   const [schedules, setSchedules] = useState<BandSchedule[]>([]);
   const [currentBand, setCurrentBand] = useState<Band | null>(null);
   const [members, setMembers] = useState<BandMember[]>([]);
 
   // Load bands and schedules from localStorage
   useEffect(() => {
     const storedBands = localStorage.getItem(BANDS_KEY);
     const storedSchedules = localStorage.getItem(SCHEDULES_KEY);
     
     if (storedBands) {
       try {
         setBands(JSON.parse(storedBands));
       } catch {
         localStorage.removeItem(BANDS_KEY);
       }
     }
     
     if (storedSchedules) {
       try {
         setSchedules(JSON.parse(storedSchedules));
       } catch {
         localStorage.removeItem(SCHEDULES_KEY);
       }
     }
   }, []);
 
   // Filter bands for current user
   const userBands = user
     ? bands.filter((b) => b.ownerId === user.id || b.memberIds.includes(user.id))
     : [];
 
   // Get members for current band
   useEffect(() => {
     if (!currentBand) {
       setMembers([]);
       return;
     }
 
     const storedUsers = localStorage.getItem(USERS_KEY);
     if (!storedUsers) {
       setMembers([]);
       return;
     }
 
     try {
       const users = JSON.parse(storedUsers) as Array<{ id: string; nickname: string; email: string }>;
       const allMemberIds = [currentBand.ownerId, ...currentBand.memberIds];
       
       const bandMembers: BandMember[] = users
         .filter((u) => allMemberIds.includes(u.id))
         .map((u) => ({
           id: u.id,
           nickname: u.nickname,
           email: u.email,
           role: u.id === currentBand.ownerId ? "owner" as const : "member" as const,
         }));
       
       setMembers(bandMembers);
     } catch {
       setMembers([]);
     }
   }, [currentBand]);
 
   const saveBands = (newBands: Band[]) => {
     setBands(newBands);
     localStorage.setItem(BANDS_KEY, JSON.stringify(newBands));
   };
 
   const saveSchedules = (newSchedules: BandSchedule[]) => {
     setSchedules(newSchedules);
     localStorage.setItem(SCHEDULES_KEY, JSON.stringify(newSchedules));
   };
 
   const createBand = (name: string, description: string): Band | null => {
     if (!user) return null;
 
     const newBand: Band = {
       id: crypto.randomUUID(),
       name,
       description,
       ownerId: user.id,
       memberIds: [],
       inviteCode: generateInviteCode(),
       createdAt: new Date().toISOString(),
     };
 
     const newBands = [...bands, newBand];
     saveBands(newBands);
     setCurrentBand(newBand);
     return newBand;
   };
 
   const joinBand = (inviteCode: string): { success: boolean; error?: string } => {
     if (!user) return { success: false, error: "로그인이 필요합니다." };
 
     const band = bands.find((b) => b.inviteCode === inviteCode.toUpperCase());
     if (!band) return { success: false, error: "유효하지 않은 초대 코드입니다." };
 
     if (band.ownerId === user.id || band.memberIds.includes(user.id)) {
       return { success: false, error: "이미 가입된 밴드입니다." };
     }
 
     const updatedBand = { ...band, memberIds: [...band.memberIds, user.id] };
     const newBands = bands.map((b) => (b.id === band.id ? updatedBand : b));
     saveBands(newBands);
     setCurrentBand(updatedBand);
     return { success: true };
   };
 
   const selectBand = (bandId: string) => {
     const band = userBands.find((b) => b.id === bandId);
     setCurrentBand(band || null);
   };
 
   const leaveBand = (bandId: string) => {
     if (!user) return;
 
     const band = bands.find((b) => b.id === bandId);
     if (!band || band.ownerId === user.id) return;
 
     const updatedBand = {
       ...band,
       memberIds: band.memberIds.filter((id) => id !== user.id),
     };
     const newBands = bands.map((b) => (b.id === bandId ? updatedBand : b));
     saveBands(newBands);
 
     if (currentBand?.id === bandId) {
       setCurrentBand(null);
     }
   };
 
   const deleteBand = (bandId: string) => {
     if (!user) return;
 
     const band = bands.find((b) => b.id === bandId);
     if (!band || band.ownerId !== user.id) return;
 
     const newBands = bands.filter((b) => b.id !== bandId);
     saveBands(newBands);
 
     // Also delete all schedules for this band
     const newSchedules = schedules.filter((s) => s.bandId !== bandId);
     saveSchedules(newSchedules);
 
     if (currentBand?.id === bandId) {
       setCurrentBand(null);
     }
   };
 
   const addSchedule = (
     schedule: Omit<BandSchedule, "id" | "createdBy" | "createdAt">
   ): BandSchedule | null => {
     if (!user || !currentBand) return null;
 
     const newSchedule: BandSchedule = {
       ...schedule,
       id: crypto.randomUUID(),
       createdBy: user.id,
       createdAt: new Date().toISOString(),
     };
 
     const newSchedules = [...schedules, newSchedule];
     saveSchedules(newSchedules);
     return newSchedule;
   };
 
   const updateSchedule = (scheduleId: string, updates: Partial<BandSchedule>) => {
     const newSchedules = schedules.map((s) =>
       s.id === scheduleId ? { ...s, ...updates } : s
     );
     saveSchedules(newSchedules);
   };
 
   const deleteSchedule = (scheduleId: string) => {
     const newSchedules = schedules.filter((s) => s.id !== scheduleId);
     saveSchedules(newSchedules);
   };
 
   const bandSchedules = currentBand
     ? schedules.filter((s) => s.bandId === currentBand.id)
     : [];
 
   return (
     <BandContext.Provider
       value={{
         bands: userBands,
         currentBand,
         schedules: bandSchedules,
         members,
         createBand,
         joinBand,
         selectBand,
         leaveBand,
         deleteBand,
         addSchedule,
         updateSchedule,
         deleteSchedule,
       }}
     >
       {children}
     </BandContext.Provider>
   );
 }
 
 export function useBand() {
   const context = useContext(BandContext);
   if (context === undefined) {
     throw new Error("useBand must be used within a BandProvider");
   }
   return context;
 }