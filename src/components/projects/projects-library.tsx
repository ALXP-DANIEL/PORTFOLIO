"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";

import { projects } from "@/components/projects/projects-data";
import { buttonVariants } from "@/components/ui/shadcn/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { cn } from "@/lib/utils";

export default function ProjectsLibrary() {
  return (
    <div id="all-projects" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div
          key={project.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.36,
            ease: "easeOut",
            delay: index * 0.05,
          }}
        >
          <Card className="h-full border border-border/70 bg-card/78 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
                  {project.type}
                </span>
                <span>{project.year}</span>
              </div>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.summary}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href={project.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-8 px-2",
                )}
              >
                Open project
                <ArrowUpRightIcon className="size-4" weight="bold" />
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
