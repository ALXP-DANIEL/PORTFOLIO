import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlurImage from "@/components/ui/blur-image";

/**
 * Renders repo README markdown in the site's aesthetic.
 *
 * Markdown only — no MDX/JSX execution — so a copied README can never inject
 * components or scripts. The component map below is the entire allowed surface.
 */
const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 text-base font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-sm leading-7 text-foreground/65">{children}</p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-reticle
      className="text-foreground underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/60"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 flex flex-col gap-2 text-sm leading-7 text-foreground/65">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 text-sm leading-7 text-foreground/65">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="marker:text-foreground/30">{children}</li>
  ),
  code: ({ children }) => (
    <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground/85">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[13px] leading-6 text-foreground/80">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-4 border-l-2 border-white/15 pl-4 text-sm text-foreground/55 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-white/10" />,
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      <BlurImage
        src={src}
        alt={alt ?? ""}
        wrapperClassName="mt-5 w-full rounded-xl border border-white/10"
        className="w-full"
      />
    ) : null,
};

export default function ProjectReadme({ source }: { source: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {source}
    </Markdown>
  );
}
