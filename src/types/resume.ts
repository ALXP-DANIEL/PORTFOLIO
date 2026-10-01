export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  url?: string;
  /** Square logo under /public; falls back to `monogram` (or an icon). */
  logo?: string;
  monogram?: string;
  points: readonly string[];
};

export type Education = {
  school: string;
  qualification?: string;
  location: string;
  period: string;
  gpa?: string;
  logo?: string;
  monogram?: string;
  points: readonly string[];
};

export type SkillGroup = {
  group: string;
  items: readonly string[];
};

export type Language = {
  name: string;
  level: string;
  /** 0–100, for the meter. */
  proficiency: number;
};
