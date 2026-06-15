import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

/** Two-column metadata grid (role / year / stack / gallery) for a project. */
export default function WorkFacts({ project }: { project: Project }) {
  const facts = [
    { label: "Role", value: project.type },
    { label: "Year", value: project.year },
    { label: "Stack", value: `${project.tech.length} tools` },
    { label: "Gallery", value: `${project.gallery.length} shots` },
  ];

  return (
    <dl
      className={cn(
        "relative grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/5",
      )}
    >
      {facts.map((fact) => (
        <div key={fact.label} className="bg-background/60 p-4">
          <dt className="font-mono text-[10px] tracking-[0.18em] text-foreground/40 uppercase">
            {fact.label}
          </dt>
          <dd className="mt-2 text-base font-medium tracking-tight text-foreground">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
