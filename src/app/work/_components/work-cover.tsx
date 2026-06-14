import BlurImage from "@/components/ui/blur-image";
import { cn } from "@/lib/utils";

type WorkCoverProps = {
  index: number;
  label?: string;
  cover?: string;
  className?: string;
};

/**
 * Project cover. When a `cover` image is provided it's shown beneath the grid
 * overlay; otherwise it falls back to a deterministic gradient that echoes the
 * site's canvas background. The `data-` hooks are animated for pointer parallax.
 */
export default function WorkCover({
  index,
  label,
  cover,
  className,
}: WorkCoverProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden border border-white/10",
        className,
      )}
    >
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(22,22,22,0.65), rgba(8,8,8,0.95))",
        }}
      />

      {/* real cover image, when available */}
      {cover ? (
        <>
          <BlurImage
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            wrapperClassName="absolute inset-0 h-full w-full"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_92%,rgba(0,0,0,0.78),rgba(0,0,0,0.34)_30%,transparent_58%)]" />
        </>
      ) : null}

      {/* coloured glow — parallax layer */}
      <div
        data-cover-glow
        className="absolute -inset-12 will-change-transform"
        style={{
          background:
            "radial-gradient(42% 42% at 50% 48%, rgba(255,255,255,0.1), transparent 70%)",
        }}
      />

      {/* grid overlay echoing the background canvas */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* index watermark — parallax layer */}
      <span
        data-cover-index
        className="absolute right-4 bottom-1 font-mono text-[clamp(3.5rem,9vw,6.5rem)] leading-none font-semibold text-white/12 will-change-transform select-none"
      >
        {num}
      </span>

      {label ? (
        <span className="absolute top-4 left-4 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-foreground/55 uppercase backdrop-blur-sm">
          {label}
        </span>
      ) : null}

      {/* top sheen */}
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
    </div>
  );
}
