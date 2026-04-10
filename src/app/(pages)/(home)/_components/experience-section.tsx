import ExperienceTimeline, {
  type ExperienceTimelineItem,
} from "@/components/ui/experience-timeline";

const experience = [
  {
    company: "Pizza Hut",
    role: "Service Crew",
    milestone: "2022",
    period: "2022",
    employmentType: "Part-time",
    location: "Malaysia",
    summary:
      "Worked in a fast-paced restaurant environment right after SPM, building strong habits around teamwork, consistency, and customer service.",
    skills: [
      "Customer service",
      "Teamwork",
      "Shift operations",
      "Time management",
      "POS",
    ],
    bullets: [
      "Handled front-of-house and daily service tasks during busy restaurant shifts.",
      "Supported order flow, counter service, and customer interactions in a fast-paced environment.",
      "Worked closely with teammates to keep service smooth, clean, and on time.",
      "Built early work discipline through reliability, communication, and responsibility.",
    ],
  },
  {
    company: "AllMeans Pte. Ltd. [WFH]",
    role: "Frontend Web Dev Intern",
    milestone: "Aug 2023",
    period: "Aug 2023 - Feb 2024",
    employmentType: "Internship",
    location: "Singapore",
    summary:
      "Focused on reusable interface systems, clean API integration, and better frontend consistency.",
    skills: ["React", "Material UI", "Figma", "APIs", "Component systems"],
    images: [
      {
        src: "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
        title: "Admin management interface",
        caption:
          "Reusable admin surfaces built to keep internal tools clearer and easier to maintain.",
        alt: "Admin management interface with dashboard cards",
      },
      {
        src: "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
        title: "Component-led dashboard",
        caption:
          "React and Material UI layouts organized around reusable states and patterns.",
        alt: "Dashboard layout with reusable UI cards",
      },
      {
        src: "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
        title: "Design-to-code system",
        caption:
          "Figma-driven components translated into frontend building blocks for faster delivery.",
        alt: "Interface system showing reusable UI modules",
      },
    ],
    bullets: [
      "Developed a full Admin Management System using React and Material UI.",
      "Translated Figma designs into reusable and scalable UI components.",
      "Integrated APIs with backend services to ensure reliable data flow.",
      "Improved UI consistency and development efficiency through component reuse.",
    ],
  },
  {
    company: "Lapasar Sdn Bhd [WFH]",
    role: "Fullstack Web Dev",
    milestone: "Jun 2024",
    period: "Jun 2024 - Mar 2026",
    employmentType: "Full-time",
    location: "Malaysia",
    summary:
      "Modernized a legacy marketplace platform while improving performance, maintainability, and day-to-day product delivery.",
    skills: [
      "React",
      "Vite",
      "CodeIgniter migration",
      "Marketplace UI",
      "Performance",
    ],
    images: [
      {
        src: "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
        title: "Marketplace storefront",
        caption:
          "Refreshed browsing and merchandising flows during the legacy-to-React migration.",
        alt: "Marketplace storefront interface preview",
      },
      {
        src: "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
        title: "Dashboard operations",
        caption:
          "Internal dashboards refined to support daily operations with better speed and clarity.",
        alt: "Operations dashboard with charts and cards",
      },
      {
        src: "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
        title: "Migration-ready interface",
        caption:
          "Frontend surfaces shaped to reduce technical debt while keeping key workflows stable.",
        alt: "Responsive interface used during frontend migration work",
      },
    ],
    bullets: [
      "Migrated a legacy CodeIgniter system to React (Vite), improving load time by 3x and reducing development complexity.",
      "Reverse-engineered undocumented systems to migrate business-critical features without regression.",
      "Refactored legacy modules to reduce technical debt and improve performance.",
      "Implemented UI and UX improvements across the Marketplace and Dashboard experience.",
    ],
  },
] satisfies readonly ExperienceTimelineItem[];

export default function ExperienceSection() {
  return <ExperienceTimeline items={experience} />;
}
