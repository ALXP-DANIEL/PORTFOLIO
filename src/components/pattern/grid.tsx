import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type GridPatternBackgroundProps = {
  backgroundColor?: string;
  className?: string;
  lineColor?: string;
  lineWidth?: number | string;
  offsetX?: number | string;
  offsetY?: number | string;
  size?: number | string;
};

type GridPatternBackgroundStyle = CSSProperties & {
  "--grid-background-color"?: string;
  "--grid-line-color"?: string;
  "--grid-line-width"?: string;
  "--grid-offset-x"?: string;
  "--grid-offset-y"?: string;
  "--grid-size"?: string;
};

function toCssLength(value: number | string | undefined, fallback: string) {
  if (value === undefined) {
    return fallback;
  }

  return typeof value === "number" ? `${value}px` : value;
}

function getGridPatternBackgroundStyle({
  backgroundColor = "transparent",
  lineColor = "color-mix(in oklab, var(--border) 72%, transparent)",
  lineWidth = 1,
  offsetX = 0,
  offsetY = 0,
  size = 25,
}: GridPatternBackgroundProps): GridPatternBackgroundStyle {
  return {
    "--grid-background-color": backgroundColor,
    "--grid-line-color": lineColor,
    "--grid-line-width": toCssLength(lineWidth, "1px"),
    "--grid-offset-x": toCssLength(offsetX, "0px"),
    "--grid-offset-y": toCssLength(offsetY, "0px"),
    "--grid-size": toCssLength(size, "32px"),
    backgroundColor: "var(--grid-background-color)",
    backgroundImage:
      "linear-gradient(to right, var(--grid-line-color) var(--grid-line-width), transparent var(--grid-line-width)), linear-gradient(to bottom, var(--grid-line-color) var(--grid-line-width), transparent var(--grid-line-width))",
    backgroundPosition:
      "var(--grid-offset-x) var(--grid-offset-y), var(--grid-offset-x) var(--grid-offset-y)",
    backgroundSize: "var(--grid-size) var(--grid-size)",
  };
}

export default function GridPattern({
  className,
  ...props
}: GridPatternBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={getGridPatternBackgroundStyle(props)}
    />
  );
}
