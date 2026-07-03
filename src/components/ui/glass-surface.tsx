import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type GlassSurfaceProps<T extends ElementType = "div"> = {
  children: ReactNode;
  as?: T;
  className?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  style?: CSSProperties;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "children" | "className" | "style"
>;

const glassStyle = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(40px) saturate(200%) brightness(1.08)",
  WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.08)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
  transition:
    "background-color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease, border-radius 0.3s ease-out",
} satisfies CSSProperties;

export const glassActiveStyle = {
  background: "var(--glass-active)",
} satisfies CSSProperties;

export default function GlassSurface<T extends ElementType = "div">({
  children,
  as,
  className,
  contentClassName,
  style,
  contentStyle,
  ...props
}: GlassSurfaceProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn("relative overflow-hidden rounded-full", className)}
      style={{ ...glassStyle, ...style }}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent" />
      <div className={cn("relative", contentClassName)} style={contentStyle}>
        {children}
      </div>
    </Component>
  );
}
