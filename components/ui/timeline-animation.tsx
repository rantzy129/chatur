"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface TimelineContentProps {
  as?: any;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLDivElement | null>;
  customVariants?: any;
  className?: string;
  children?: React.ReactNode;
}

export function TimelineContent({
  as: Component = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
  ...props
}: TimelineContentProps & React.HTMLAttributes<HTMLElement>) {
  const localRef = useRef<HTMLDivElement>(null);
  const targetRef = timelineRef || localRef;
  const isInView = useInView(targetRef, { once: true, amount: 0.1 });

  const MotionComponent = (motion as any)[Component] || motion.div;

  const defaultVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.12,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(8px)",
      y: 20,
      opacity: 0,
    },
  };

  return (
    <MotionComponent
      ref={localRef}
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={customVariants || defaultVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

