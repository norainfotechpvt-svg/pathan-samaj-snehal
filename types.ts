export type MaritalStatus = 'married' | 'unmarried';
export type Gender = 'male' | 'female';
export type Community = 'patel' | 'muslim' | 'swaminarayan';
export type MemberRole = 'president' | 'vice_president' | 'manager' | 'fund_manager' | 'member';

export interface Donation {
  id: string;
  amount: number;
  category: string;
  subCategory?: string; // e.g., 'jamanwar', 'anya'
  date: string;
}

export interface SchemeRecord {
  id: string;
  schemeName: string; // e.g., 'Golden Dikri Yojana'
  amount: number;
  date: string;
  status: 'approved';
  details?: string;
}

export interface Member {
  id: string; // 4 digit generated ID
  firstName: string;
  surname: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  
  // New fields
  city: string;
  role: MemberRole;

  // Conditional fields
  fatherName?: string; // If unmarried
  husbandName?: string; // If married female (or spouse name)
  useHusbandNameSuffix?: boolean; // New field: Append husband name to own name
  wifeName?: string; // If married male
  
  age?: string;
  education: string;
  occupation: string;
  annualIncome: string;

  // Married specific extras
  spouseEducation?: string;
  spouseOccupation?: string;
  spouseIncome?: string;

  community: Community;
  subCaste: string;
  registrationFee: number;
  registrationDate: string;

  // New field for donation history
  donations?: Donation[];
  
  // New field for scheme history (Dikri Yojana)
  schemes?: SchemeRecord[];
}

export type ViewState = 'dashboard' | 'register' | 'list' | 'fund' | 'about' | 'dikri_yojana';