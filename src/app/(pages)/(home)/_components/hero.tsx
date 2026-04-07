"use client";

import { motion } from "motion/react";
import Link from "next/link";
import BlurImage from "@/components/ui/blur-image";
import SectionWrapper from "@/components/wrapper/section";

export default function Hero() {
  return (
    <SectionWrapper className="relative overflow-hidden border border-border/70 bg-linear-to-br from-background via-background to-muted/30 px-6 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
      <div className="pointer-events-none absolute -top-28 -left-16 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-32 h-96 w-96 rounded-full bg-chart-2/12 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]"
      >
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="space-y-7"
        >
          <div className="max-w-2xl space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            >
              I build fast, scalable web products with clean TypeScript.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base"
            >
              “Experienced web developer passionate about staying ahead in
              technology. Committed to excellence, self-motivated, and eager to
              learn. Dedicated to delivering high-quality results and
              continuously improving both code and craft.”
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/projects"
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore Projects
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative mx-auto w-full max-w-md rounded-[2.1rem] border border-border/70 bg-card/90 p-4 shadow-[0_26px_60px_-34px_rgba(0,0,0,0.75)] backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="absolute -right-10 -top-1 rotate-12 animate-pulse rounded-full border border-primary/60 bg-primary/50 px-3 py-1 text-xs font-medium text-foreground shadow-[0_8px_16px_-12px_rgba(0,0,0,0.4)] backdrop-blur-sm"
            >
              ✦ Available for work
            </motion.div>

            <div className="relative overflow-hidden rounded-[1.5rem] border border-border/70">
              <BlurImage
                src="/assets/hero-profile.svg"
                alt="Portrait profile"
                wrapperClassName="block h-full w-full"
                className="h-auto w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background/85 to-transparent" />
            </div>

            <div className="mt-4 space-y-3 px-1 pb-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xl font-semibold tracking-tight">
                  MUHAMMAD ALIF DANIEL BIN MOHD HAIRUL HEZZELIN
                </p>
                <p className="text-sm text-muted-foreground">
                  Fullstack Devweloper
                </p>
              </div>

              <a
                href="/resume.pdf"
                download
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Download resume</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Resume
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
