export interface Education {
  id?: number;
  institution: string;
  board: string;
  graduation_year: string;
  gpa: string;
}

export interface WorkExperience {
  id?: number;
  title: string;
  company_name: string;
  joined_date: string;
  end_date?: string;
  currently_working: boolean;
}

export interface JobseekerProfile {
  // ... existing fields ...
  education: Education[];
  workExperiences: WorkExperience[];
}

export interface Certification {
  id?: number;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  no_expiry: boolean;
  credential_id?: string;
  credential_url?: string;
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  currently_working: boolean;
  project_url?: string;
  github_url?: string;
} 