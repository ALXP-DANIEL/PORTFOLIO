import Image from "next/image";
import type { CSSProperties } from "react";
import { cardContact, QR_PATH } from "./card-data";

/*
 * Both faces are laid out on the 90 × 54 mm print artboard (340 × 204 px)
 * and scaled with container-query units, so 1px on the artboard ≈ 0.294cqw.
 */

const GRID_DARK: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
  backgroundSize: "5cqw 5cqw",
};

const PHOTO_MASK = "linear-gradient(to right, transparent 0%, #000 58%)";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 855 727" className={className} aria-hidden>
      <polygon
        fill="#ff1a1a"
        points="438,0 855,725 147,725 360,355 412,445 303,630 691,628 394,77"
      />
      <polygon
        fill="#ff1a1a"
        points="368,121 647,603 365,601 457,439 367,281 98,727 0,724"
      />
    </svg>
  );
}

/**
 * Pointer-follow highlight; lives inside each face so it turns with the flip.
 * Mouse only: touch has no hover to drive it, and mobile Safari blends it
 * unreliably inside 3D-flipped layers.
 */
function Glare() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden opacity-60 mix-blend-soft-light pointer-fine:block"
      style={{
        background:
          "radial-gradient(circle at var(--gx, 30%) var(--gy, 20%), rgba(255,255,255,0.55), transparent 55%)",
      }}
    />
  );
}

export function CardFront() {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[2.4cqw] border border-white/12 bg-[#0a0a0a] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] text-[#f5f5f5] backface-hidden"
      style={GRID_DARK}
    >
      <div
        className="absolute inset-y-0 right-0 w-[69.4%]"
        style={{ maskImage: PHOTO_MASK, WebkitMaskImage: PHOTO_MASK }}
      >
        <Image
          src="/hero-desktop.webp"
          alt=""
          fill
          sizes="360px"
          draggable={false}
          className="object-cover object-[72%_30%]"
          preload
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-between px-[5.9cqw] py-[5.3cqw]">
        <LogoMark className="h-[4.7cqw] w-[5.6cqw]" />
        <div className="flex flex-col gap-[2cqw]">
          <p className="text-[7.4cqw] leading-none font-bold tracking-[-0.02em]">
            ALXP-DANIEL
          </p>
          <p className="flex items-center gap-[1.2cqw] text-[2.95cqw] text-[#b5b5b5]">
            <span className="text-[#8a8a8a]">{"//"}</span>
            {cardContact.title}
            <span className="inline-block h-[2.95cqw] w-[1.5cqw] animate-pulse bg-[#e5e5e5]" />
          </p>
        </div>
      </div>
      <Glare />
    </div>
  );
}

export function CardBack() {
  const rows = [
    ["tel", cardContact.phone],
    ["mail", cardContact.email],
    ["git", cardContact.github],
    ["web", cardContact.web],
  ] as const;

  return (
    <div
      className="absolute inset-0 flex rotate-y-180 flex-col justify-between overflow-hidden rounded-[2.4cqw] border border-white/12 bg-[#0a0a0a] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] px-[5.9cqw] py-[5.3cqw] text-[#f5f5f5] backface-hidden"
      style={GRID_DARK}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-[1.5cqw]">
          <p className="text-[2.95cqw] text-[#8a8a8a]">
            <span className="text-[#10b981]">$</span> whoami
          </p>
          <p className="text-[3.55cqw] leading-[1.3] font-bold">
            {cardContact.fullName}
            <br />
            {cardContact.fullNameSuffix}
          </p>
          <p className="text-[2.95cqw] text-[#b5b5b5]">
            {cardContact.title} · Malaysia
          </p>
        </div>
        <LogoMark className="h-[4.1cqw] w-[4.7cqw]" />
      </div>

      <div className="flex items-end justify-between gap-[3.5cqw]">
        <dl className="flex flex-col gap-[1.2cqw] text-[2.95cqw] leading-[1.35]">
          {rows.map(([label, value]) => (
            <div key={label} className="flex gap-[2.4cqw]">
              <dt className="w-[7.6cqw] text-[#8a8a8a]">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-[1.2cqw] bg-[#f5f5f5] p-[1.2cqw]">
          <svg
            viewBox="0 0 29 29"
            shapeRendering="crispEdges"
            className="block size-[15.9cqw]"
            role="img"
            aria-label={`QR code linking to ${cardContact.web}`}
          >
            <path fill="none" stroke="#0a0a0a" d={QR_PATH} />
          </svg>
        </div>
      </div>
      <Glare />
    </div>
  );
}
