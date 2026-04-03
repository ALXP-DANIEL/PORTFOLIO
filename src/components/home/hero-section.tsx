"use client";

import {
  ArrowRight,
  Sparkle,
  Stack,
  TerminalWindow,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const stackItems = ["Next.js", "TypeScript", "Motion", "Design Systems"];

export default function HeroSection() {
  return (
    // <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-linear-to-br from-background via-background to-muted/35 px-6 py-14 shadow-[0_28px_60px_-36px_rgba(0,0,0,0.45)] sm:px-10 sm:py-20 lg:px-14">
    //   <motion.div
    //     aria-hidden="true"
    //     className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
    //     animate={{ x: [0, 18, 0], y: [0, -10, 0], scale: [1, 1.08, 1] }}
    //     transition={{
    //       duration: 10,
    //       repeat: Number.POSITIVE_INFINITY,
    //       ease: "easeInOut",
    //     }}
    //   />
    //   <motion.div
    //     aria-hidden="true"
    //     className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-chart-2/20 blur-3xl"
    //     animate={{ x: [0, -16, 0], y: [0, 14, 0], scale: [1, 1.1, 1] }}
    //     transition={{
    //       duration: 12,
    //       repeat: Number.POSITIVE_INFINITY,
    //       ease: "easeInOut",
    //     }}
    //   />

    //   <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
    //     <motion.div
    //       variants={container}
    //       initial="hidden"
    //       animate="visible"
    //       className="space-y-7"
    //     >
    //       <motion.div
    //         variants={fadeUp}
    //         transition={{ duration: 0.55, ease: "easeOut" }}
    //         className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs tracking-[0.18em] uppercase"
    //       >
    //         <Sparkle className="size-3.5" weight="fill" />
    //         Available for freelance projects
    //       </motion.div>

    //       <motion.h1
    //         variants={fadeUp}
    //         transition={{ duration: 0.6, ease: "easeOut" }}
    //         className="max-w-3xl text-4xl leading-[1.02] font-semibold tracking-tight sm:text-6xl"
    //       >
    //         I build <span className="text-primary">fast, expressive</span> digital
    //         products that feel alive.
    //       </motion.h1>

    //       <motion.p
    //         variants={fadeUp}
    //         transition={{ duration: 0.55, ease: "easeOut" }}
    //         className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
    //       >
    //         Portfolio of a product-focused developer creating high-performance web
    //         experiences, bold interfaces, and motion-driven interactions for
    //         startups and personal brands.
    //       </motion.p>

    //       <motion.div
    //         variants={fadeUp}
    //         transition={{ duration: 0.5, ease: "easeOut" }}
    //         className="flex flex-wrap gap-3"
    //       >
    //         <Link
    //           href="/projects"
    //           className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
    //         >
    //           Explore Projects
    //           <ArrowRight className="size-4" weight="bold" />
    //         </Link>
    //         <Link
    //           href="/blog"
    //           className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
    //         >
    //           Read Process Notes
    //           <TerminalWindow className="size-4" weight="bold" />
    //         </Link>
    //       </motion.div>

    //       <motion.div
    //         variants={fadeUp}
    //         transition={{ duration: 0.5, ease: "easeOut" }}
    //         className="flex flex-wrap gap-2 pt-1"
    //       >
    //         {stackItems.map((item) => (
    //           <span
    //             key={item}
    //             className="rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground"
    //           >
    //             {item}
    //           </span>
    //         ))}
    //       </motion.div>
    //     </motion.div>

    //     <motion.div
    //       initial={{ opacity: 0, y: 24, scale: 0.96 }}
    //       animate={{ opacity: 1, y: 0, scale: 1 }}
    //       transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
    //       className="relative mx-auto w-full max-w-md"
    //     >
    //       <div className="relative overflow-hidden rounded-[1.7rem] border border-border/70 bg-background/80 p-5 shadow-[0_24px_48px_-30px_rgba(0,0,0,0.45)] backdrop-blur-md">
    //         <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
    //           <span className="inline-flex items-center gap-1.5">
    //             <Stack className="size-3.5" weight="duotone" />
    //             Build System
    //           </span>
    //           <span>2026</span>
    //         </div>

    //         <motion.div
    //           className="space-y-3"
    //           initial="hidden"
    //           animate="visible"
    //           variants={{
    //             hidden: {},
    //             visible: {
    //               transition: { staggerChildren: 0.09, delayChildren: 0.28 },
    //             },
    //           }}
    //         >
    //           {[
    //             "Design direction mapped",
    //             "Interaction system tuned",
    //             "Performance budget green",
    //           ].map((line) => (
    //             <motion.div
    //               key={line}
    //               variants={{
    //                 hidden: { opacity: 0, x: -10 },
    //                 visible: { opacity: 1, x: 0 },
    //               }}
    //               transition={{ duration: 0.3, ease: "easeOut" }}
    //               className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/50 px-3 py-2"
    //             >
    //               <span className="text-sm">{line}</span>
    //               <span className="h-2.5 w-2.5 rounded-full bg-primary" />
    //             </motion.div>
    //           ))}
    //         </motion.div>

    //         <motion.div
    //           className="mt-4 h-2 rounded-full bg-muted"
    //           initial={{ opacity: 0 }}
    //           animate={{ opacity: 1 }}
    //           transition={{ duration: 0.4, delay: 0.45 }}
    //         >
    //           <motion.div
    //             className="h-full rounded-full bg-primary"
    //             initial={{ width: "15%" }}
    //             animate={{ width: "84%" }}
    //             transition={{ duration: 1.4, ease: "easeInOut", delay: 0.5 }}
    //           />
    //         </motion.div>
    //       </div>

    //       <motion.div
    //         className="absolute -top-4 -right-4 rounded-xl border border-border/70 bg-background px-3 py-2 text-xs shadow-md"
    //         animate={{ y: [0, -6, 0] }}
    //         transition={{
    //           duration: 3.2,
    //           repeat: Number.POSITIVE_INFINITY,
    //           ease: "easeInOut",
    //         }}
    //       >
    //         Shipping weekly
    //       </motion.div>
    //     </motion.div>
    //   </div>
    // </section>
    <>
    hreo
    </>
  );
}
