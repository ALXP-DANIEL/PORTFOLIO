import type {
  Education,
  Experience,
  Language,
  SkillGroup,
} from "@/types/resume";

export const aboutConfig: readonly string[] = [
  "I'm a full-stack web developer from Malaysia. Most days I'm turning messy, real-world requirements into clean, role-based web apps — and untangling the legacy systems nobody bothered to document.",
  "Off the clock, I run a self-hosted homelab where I break and fix production-like infrastructure on purpose: photo backups, home automation, DNS, VPNs, the lot. It's how I keep sharpening the ops side of shipping software.",
];

export const experienceConfig: readonly Experience[] = [
  {
    role: "Full-Stack Web Developer",
    company: "Lapasar Sdn Bhd",
    location: "Malaysia · Remote",
    period: "Jun 2024 — Mar 2026",
    type: "Full-time",
    points: [
      "Migrated a legacy CodeIgniter system to React with Vite, improving frontend maintainability and application performance.",
      "Reverse-engineered undocumented legacy systems to migrate business-critical features without causing regression.",
      "Refactored legacy modules to reduce technical debt, simplify complexity, and improve system stability.",
      "Implemented UI/UX improvements across the Marketplace and Dashboard modules, reducing friction for users.",
      "Modernized legacy workflows and aligned the frontend with current development standards.",
    ],
  },
  {
    role: "Frontend Web Developer",
    company: "AllMeans Pte. Ltd.",
    location: "Singapore · Remote",
    period: "Aug 2023 — Feb 2024",
    type: "Internship",
    points: [
      "Developed a full Admin Management System using React and Material UI.",
      "Translated Figma designs into reusable, scalable UI components.",
      "Integrated APIs with backend services to ensure reliable data flow.",
      "Improved UI consistency and development efficiency through component reuse.",
    ],
  },
  {
    role: "Homelab Infrastructure",
    company: "Self-Hosted Environment",
    location: "Personal",
    period: "Ongoing",
    type: "Side project",
    points: [
      "Built and manage a self-hosted homelab to run private services, test deployments, and practice production-like infrastructure.",
      "Host Immich (photo backup), Home Assistant, VPN access, DNS filtering, and private media — Docker-based, behind a reverse proxy.",
      "Use it to practice deployment, monitoring, backups, and service-recovery workflows hands-on.",
    ],
  },
];

export const skillsConfig: readonly SkillGroup[] = [
  {
    group: "Frontend",
    items: [
      "Angular",
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Zard UI",
      "shadcn/ui",
      "Material UI",
      "HTMX",
    ],
  },
  {
    group: "Backend",
    items: [
      "Laravel",
      "PHP",
      "Node.js",
      "Express.js",
      "NestJS",
      "Prisma",
      "REST APIs",
      "Cookie-based Auth",
    ],
  },
  {
    group: "Database",
    items: ["MySQL", "MariaDB", "PostgreSQL", "Neon"],
  },
  {
    group: "AI · Media · Storage",
    items: ["Roboflow API", "Multer", "Sharp", "Supabase Storage"],
  },
  {
    group: "Maps · Routing",
    items: ["MapLibre GL", "OSRM Routing", "Google Maps Places"],
  },
  {
    group: "DevOps · Deploy",
    items: [
      "Docker",
      "Docker Compose",
      "Railway",
      "Vercel",
      "GitHub Actions",
      "GHCR",
    ],
  },
  {
    group: "Testing · QA",
    items: ["Playwright", "Vitest", "API Testing", "ESLint"],
  },
  {
    group: "Tools",
    items: ["Postman", "Figma", "Sanity CMS", "Graphify", "TablePlus", "Git"],
  },
];

export const educationConfig: readonly Education[] = [
  {
    school: "Harvard University",
    qualification: "CS50x — Introduction to Computer Science",
    location: "Online",
    period: "2024 — 2026",
    points: [
      "Foundational CS: algorithms, data structures, memory, abstraction, and web development.",
      "Programming across C, Python, SQL, HTML, CSS, and JavaScript through problem sets and a final project.",
    ],
  },
  {
    school: "Industrial Training Institute, Kuala Langat",
    qualification: "Diploma in Web Development",
    location: "Malaysia",
    period: "2022 — 2024",
    gpa: "GPA 3.71 / 4.00",
    points: [
      "WorldSkills Malaysia Belia (WSMB) — 2022 & 2023.",
      "Malaysia Tech Lympics — Top 10, 2023.",
    ],
  },
  {
    school: "SMK Banting",
    qualification: "SPM",
    location: "Malaysia",
    period: "2016 — 2022",
    points: ["Computer Science — B", "Science — A"],
  },
];

export const languagesConfig: readonly Language[] = [
  { name: "Malay", level: "Fluent", proficiency: 100 },
  { name: "English", level: "Moderate", proficiency: 70 },
];
