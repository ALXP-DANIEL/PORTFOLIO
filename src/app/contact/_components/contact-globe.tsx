"use client";

import { EnvelopeIcon, type Icon, PhoneIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cardContact } from "@/components/business-card/card-data";
import { Icons } from "@/components/icons";
import { socialsConfig } from "@/config/sosial";
import { cn } from "@/lib/utils";

type Channel = {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: Icon;
  external?: boolean;
  copy?: string;
};

const CHANNELS: Channel[] = [
  {
    id: "email",
    label: "Email",
    value: cardContact.email,
    href: `mailto:${cardContact.email}`,
    icon: EnvelopeIcon,
    copy: cardContact.email,
  },
  {
    id: "phone",
    label: "Phone",
    value: cardContact.phone,
    href: cardContact.phoneHref,
    icon: PhoneIcon,
    copy: cardContact.phone,
  },
  ...socialsConfig.map((social) => ({
    id: social.platform.toLowerCase(),
    label: social.platform,
    value: social.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
    href: social.link,
    icon: Icons.Social[social.icon],
    external: true,
  })),
];

const GLOBE_RADIUS = 1;
const ORBIT_RADIUS = 1.55;
const POINT_COUNT = 2600;
/** Kuala Lumpur, where the pin sits. */
const HOME = { lat: 3.139, lon: 101.687 };

function latLonToVec(lat: number, lon: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * A slowly turning particle globe with a pin on Kuala Lumpur. Each contact
 * channel orbits it as an icon bubble — real links, positioned each frame by
 * projecting their 3D orbit onto the page. Hover (or tap) a bubble to pause
 * the orbit and see its details.
 */
export default function ContactGlobe() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  activeRef.current = active;

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const ink = dark ? 0xf5f5f5 : 0x111111;
    const globe = new THREE.Group();
    globe.rotation.z = THREE.MathUtils.degToRad(-12);
    scene.add(globe);

    // Fibonacci sphere: evenly spread dots, sized by a gentle random jitter.
    const positions = new Float32Array(POINT_COUNT * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < POINT_COUNT; i++) {
      const y = 1 - (i / (POINT_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      positions.set(
        [
          Math.cos(t) * r * GLOBE_RADIUS,
          y * GLOBE_RADIUS,
          Math.sin(t) * r * GLOBE_RADIUS,
        ],
        i * 3,
      );
    }
    const dotsGeometry = new THREE.BufferGeometry();
    dotsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const dotsMaterial = new THREE.PointsMaterial({
      color: ink,
      size: 0.018,
      sizeAttenuation: true,
      transparent: true,
      opacity: dark ? 0.55 : 0.5,
      depthWrite: false,
    });
    globe.add(new THREE.Points(dotsGeometry, dotsMaterial));

    // Faint solid core so the back hemisphere reads as "behind".
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS * 0.985, 48, 48),
      new THREE.MeshBasicMaterial({
        color: dark ? 0x0a0a0a : 0xfafafa,
        transparent: true,
        opacity: 0.82,
      }),
    );
    globe.add(core);

    // Home pin + pulsing ring.
    const homeVec = latLonToVec(HOME.lat, HOME.lon, GLOBE_RADIUS * 1.01);
    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff1a1a }),
    );
    pin.position.copy(homeVec);
    globe.add(pin);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.03, 0.045, 32),
      new THREE.MeshBasicMaterial({
        color: 0xff1a1a,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    );
    ring.position.copy(homeVec);
    ring.lookAt(homeVec.clone().multiplyScalar(2));
    globe.add(ring);

    // Start with Malaysia facing the viewer.
    globe.rotation.y = -Math.atan2(homeVec.x, homeVec.z);

    // Orbit ring guide.
    const orbitPoints = new THREE.EllipseCurve(
      0,
      0,
      ORBIT_RADIUS,
      ORBIT_RADIUS,
    ).getPoints(128);
    const orbitLine = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        orbitPoints.map((p) => new THREE.Vector3(p.x, 0, p.y)),
      ),
      new THREE.LineBasicMaterial({
        color: ink,
        transparent: true,
        opacity: 0.12,
      }),
    );
    const orbit = new THREE.Group();
    orbit.rotation.x = THREE.MathUtils.degToRad(72);
    orbit.rotation.z = THREE.MathUtils.degToRad(-8);
    orbit.add(orbitLine);
    scene.add(orbit);

    let width = 0;
    let height = 0;
    const resize = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Keep the whole orbit in frame on narrow screens.
      camera.position.z = width < 640 ? 6.4 : 5.2;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersection.observe(stage);

    let orbitAngle = 0;
    let last = performance.now();
    let raf = 0;
    const point = new THREE.Vector3();
    const count = CHANNELS.length;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const paused = activeRef.current !== null;

      if (!reduced) {
        globe.rotation.y += dt * 0.12;
        if (!paused) orbitAngle += dt * 0.22;
        const pulse = (now / 1400) % 1;
        ring.scale.setScalar(1 + pulse * 2.4);
        (ring.material as THREE.MeshBasicMaterial).opacity = 1 - pulse;
      }

      renderer.render(scene, camera);

      // Place each bubble at its projected orbit position.
      orbit.updateMatrixWorld();
      for (let i = 0; i < count; i++) {
        const el = bubbleRefs.current[i];
        if (!el) continue;
        const angle = orbitAngle + (i / count) * Math.PI * 2;
        point
          .set(
            Math.cos(angle) * ORBIT_RADIUS,
            0,
            Math.sin(angle) * ORBIT_RADIUS,
          )
          .applyMatrix4(orbit.matrixWorld);
        const depth = point.z; // + towards camera
        point.project(camera);
        const x = (point.x * 0.5 + 0.5) * width;
        const y = (-point.y * 0.5 + 0.5) * height;
        const front = depth > -0.2;
        const scale =
          0.78 + ((depth + ORBIT_RADIUS) / (ORBIT_RADIUS * 2)) * 0.32;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.zIndex = front ? "20" : "1";
        el.style.opacity = front ? "1" : "0.35";
        el.dataset.behind = front ? "false" : "true";
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | undefined;
        material?.dispose();
      });
    };
  }, [dark]);

  const copy = async (channel: Channel) => {
    if (!channel.copy) return;
    try {
      await navigator.clipboard.writeText(channel.copy);
      setCopied(channel.id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div
      ref={stageRef}
      className="relative mx-auto aspect-square w-full max-w-[720px] select-none"
      onPointerLeave={() => setActive(null)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full"
      />

      <ul aria-label="Ways to reach me" className="absolute inset-0">
        {CHANNELS.map((channel, index) => {
          const Icon = channel.icon;
          const isActive = active === channel.id;

          return (
            <li key={channel.id}>
              <div
                ref={(el) => {
                  bubbleRefs.current[index] = el;
                }}
                className="absolute top-0 left-0 transition-opacity duration-300"
                style={{ zIndex: isActive ? 30 : undefined }}
                onPointerEnter={() => setActive(channel.id)}
              >
                <a
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noreferrer" : undefined}
                  data-reticle
                  aria-label={`${channel.label}: ${channel.value}`}
                  onFocus={() => setActive(channel.id)}
                  onBlur={() => setActive(null)}
                  onClick={(event) => {
                    // First tap on touch reveals details; second tap follows.
                    if (
                      window.matchMedia("(pointer: coarse)").matches &&
                      !isActive
                    ) {
                      event.preventDefault();
                      setActive(channel.id);
                    }
                  }}
                  className={cn(
                    "grid size-12 place-items-center rounded-full border bg-background/80 shadow-lg backdrop-blur-sm transition-[transform,border-color,color] duration-300 sm:size-14",
                    isActive
                      ? "scale-110 border-foreground/40 text-foreground"
                      : "border-border text-foreground/70",
                  )}
                >
                  <Icon className="size-5 sm:size-6" weight="regular" />
                </a>

                {/* details on hover / focus / tap */}
                <div
                  className={cn(
                    "absolute top-full left-1/2 mt-3 w-max max-w-64 -translate-x-1/2 rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-2xl backdrop-blur-md transition-[opacity,translate] duration-300",
                    isActive
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0",
                  )}
                >
                  <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/45 uppercase">
                    {channel.label}
                  </p>
                  <p className="mt-1 truncate font-mono text-sm text-foreground">
                    {channel.value}
                  </p>
                  <div className="mt-2.5 flex gap-1.5">
                    <a
                      href={channel.href}
                      target={channel.external ? "_blank" : undefined}
                      rel={channel.external ? "noreferrer" : undefined}
                      tabIndex={isActive ? 0 : -1}
                      data-reticle
                      className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 font-mono text-[11px] text-background"
                    >
                      {channel.external
                        ? "Open"
                        : channel.id === "phone"
                          ? "Call"
                          : "Write"}
                      <Icons.Layout.Footer.ArrowUpRight
                        className="size-3"
                        weight="bold"
                      />
                    </a>
                    {channel.copy ? (
                      <button
                        type="button"
                        tabIndex={isActive ? 0 : -1}
                        data-reticle
                        onClick={() => copy(channel)}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 font-mono text-[11px] text-foreground/70 hover:text-foreground"
                      >
                        <Icons.Palette.Copy className="size-3" />
                        {copied === channel.id ? "Copied ✓" : "Copy"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="pointer-events-none absolute bottom-[8%] left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-wide text-foreground/40">
        <span className="text-[#ff1a1a]">●</span> Kuala Lumpur, Malaysia
      </p>
    </div>
  );
}
