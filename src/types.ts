export interface SchoolInfo {
  name: string;
  hindiName: string;
  affiliation: string;
  udiseCode: string;
  estd: string;
  location: string;
  postOffice: string;
  policeStation: string;
  pinCode: string;
  phone: string;
  email: string;
  principalName: string;
  principalDesignation: string;
  principalQualification: string;
  principalMessage: string;
  aboutText: string;
  mission: string;
  vision: string;
  objectives: string[];
  workingHours: string;
}

export type NoticeCategory =
  | 'Academic'
  | 'Examination'
  | 'Holidays'
  | 'Admission'
  | 'Scholarship'
  | 'General'
  | 'Sports';

export interface Notice {
  id: string;
  title: string;
  category: NoticeCategory;
  date: string; // YYYY-MM-DD
  description: string;
  content: string;
  isImportant: boolean;
  isPublished: boolean;
  attachmentName?: string;
  attachmentData?: string; // base64 or URL
  attachmentType?: 'pdf' | 'doc' | 'image' | 'link';
  externalLink?: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
}

export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: string;
  email?: string;
  phone?: string;
  avatarColor?: string;
}

export interface Facility {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  highlights: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'School Campus' | 'Events' | 'Cultural Programs' | 'Sports' | 'Independence Day' | 'Republic Day' | 'Classrooms';
  date: string;
  description: string;
  imageUrl?: string;
  aspectRatio?: string;
  colorScheme?: string;
}

export interface AcademicClass {
  classLevel: string;
  ageGroup: string;
  streams: string;
  medium: string;
  subjects: string[];
}

export interface AcademicCalendarItem {
  month: string;
  events: { date: string; title: string; type: 'exam' | 'holiday' | 'event' | 'meeting' }[];
}

export interface AcademicData {
  bsebCode: string;
  classes: AcademicClass[];
  calendar: AcademicCalendarItem[];
  guidelines: string[];
  evaluationPattern: string;
  midDayMealInfo: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AdminUser {
  id?: string;
  email: string;
  role: 'admin' | 'staff';
  name: string;
  canManageNotices?: boolean;
}
