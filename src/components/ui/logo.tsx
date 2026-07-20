import BlurImage from "@/components/ui/blur-image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  wrapperClassName?: string;
};

/**
 * The mark is a solid brand-red raster baked into logo.svg (not a
 * light/dark-specific asset), so it renders as-is on both themes —
 * no invert filter needed.
 */
export default function Logo({ className, wrapperClassName }: LogoProps) {
  return (
    <BlurImage
      src="/logo.svg"
      alt="Logo"
      className={cn("h-4 w-auto", className)}
      wrapperClassName={cn("block", wrapperClassName)}
    />
  );
}
