export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type ExperienceLevel = "Entry" | "Mid" | "Senior" | "Lead";
export type JobStatus = "open" | "urgent" | "new" | "closed";

export interface Job {
  id: string;
  code: string; // e.g. ENG-014, board-style reference code
  title: string;
  company: string;
  location: string;
  remote: boolean;
  type: JobType;
  level: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  tags: string[];
  postedAt: string; // ISO date
  status: JobStatus;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export interface Application {
  id: string;
  jobId: string;
  name: string;
  email: string;
  resumeLink: string;
  note: string;
  submittedAt: string;
}

export type SortOption = "newest" | "salary-desc" | "salary-asc";
