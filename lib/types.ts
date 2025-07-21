export interface EducationEntry {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface ExperienceEntry {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface CertificationEntry {
  _id?: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export type ProfileSectionType = "education" | "experience" | "certifications";

// Optional: for UI rendering
export const SECTION_LABELS: Record<ProfileSectionType, string> = {
  education: "Education",
  experience: "Work Experience",
  certifications: "Certifications",
};
