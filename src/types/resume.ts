export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  url?: string;
  points: readonly string[];
};

export type Education = {
  school: string;
  qualification?: string;
  location: string;
  period: string;
  gpa?: string;
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
