 export interface Band {
   id: string;
   name: string;
   description: string;
   ownerId: string;
   memberIds: string[];
   inviteCode: string;
   createdAt: string;
 }
 
 export interface BandSchedule {
   id: string;
   bandId: string;
   title: string;
   date: string;
   startTime: string;
   endTime: string;
   location: string;
   memo: string;
   createdBy: string;
   createdAt: string;
 }
 
 export interface BandMember {
   id: string;
   nickname: string;
   email: string;
   role: "owner" | "member";
 }