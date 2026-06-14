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
  background: "rgba(10, 10, 10, 0.68)",
  backdropFilter: "blur(40px) saturate(200%) brightness(1.08)",
  WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.08)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: [
    "inset 0 1.5px 0 rgba(255, 255, 255, 0.1)",
    "inset 0 -1px 0 rgba(0, 0, 0, 0.25)",
    "0 24px 64px rgba(0, 0, 0, 0.55)",
    "0 4px 16px rgba(0, 0, 0, 0.35)",
    "0 0 0 0.5px rgba(255, 255, 255, 0.05)",
  ].join(", "),
} satisfies CSSProperties;

export const glassActiveStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 1px 4px rgba(0, 0, 0, 0.3)",
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
      <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      <div className={cn("relative", contentClassName)} style={contentStyle}>
        {children}
      </div>
    </Component>
  );
}
