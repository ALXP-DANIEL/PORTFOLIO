import { getProjects } from "@/lib/work";
import CommandPalette from "./command-palette";

/** Server wrapper — hands the palette a lightweight, serializable project list. */
export default async function CommandPaletteRoot() {
  const projects = await getProjects().catch(() => []);

  return (
    <CommandPalette
      projects={projects.map(({ slug, title, category, year }) => ({
        slug,
        title,
        category,
        year,
      }))}
    />
  );
}
