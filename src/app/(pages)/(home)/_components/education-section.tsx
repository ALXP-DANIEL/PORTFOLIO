import SectionWrapper from "@/components/wrapper/section";

const education = [
  {
    school: "Harvard University",
    program: "CS50x: Introduction to Computer Science",
    period: "2024 - 2026",
    location: "Online",
    result: "CS fundamentals",
    credential:
      "Completed coursework in algorithms, data structures, memory, abstraction, and web development across C, Python, SQL, HTML, CSS, and JavaScript.",
    focus: [
      "Algorithms",
      "Data structures",
      "Memory",
      "C",
      "Python",
      "SQL",
      "JavaScript",
    ],
  },
  {
    school: "Industrial Training Institute, Kuala Langat",
    program: "Diploma in Web Development",
    period: "2022 - 2024",
    location: "Malaysia",
    result: "CGPA 3.71 / 4.00",
    credential: "Graduated with a CGPA of 3.71 / 4.00.",
    focus: [
      "Web development",
      "Frontend basics",
      "Backend basics",
      "Project work",
      "Problem solving",
    ],
  },
  {
    school: "SMK Banting",
    program: "SPM",
    period: "2016 - 2022",
    location: "Malaysia",
    result: "Computer Science A-",
    credential:
      "Completed secondary education with Computer Science A- and Science A.",
    focus: [
      "Computer Science",
      "Science",
      "Foundations",
      "Discipline",
      "Early technical interest",
    ],
  },
] as const;

export default function EducationSection() {
  return (
    <div className="space-y-4">
      {education.map((item) => (
        <SectionWrapper
          key={`${item.school}-${item.period}`}
          className="border border-border/70 bg-background/72 p-5 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {item.school}
                </h3>
                <p className="mt-1 text-sm font-medium text-foreground/85">
                  {item.program}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{item.location}</p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <span className="rounded-full border border-border/70 bg-background/85 px-3 py-1 text-xs text-muted-foreground">
                {item.period}
              </span>
              <span className="rounded-full border border-border/70 bg-muted/45 px-3 py-1 text-xs text-foreground/85">
                {item.result}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {item.credential}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {item.focus.map((focusItem) => (
              <span
                key={focusItem}
                className="rounded-full border border-border/70 bg-background/82 px-3 py-1 text-xs font-medium text-foreground/85"
              >
                {focusItem}
              </span>
            ))}
          </div>
        </SectionWrapper>
      ))}
    </div>
  );
}
