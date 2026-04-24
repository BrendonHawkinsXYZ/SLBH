"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  revealVariants,
  revealTransition,
  type DiscoveryLayer,
} from "@/lib/motion";

type Props = {
  layer: DiscoveryLayer;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function Reveal({ layer, children, className, style }: Props) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={revealVariants}
      transition={revealTransition(layer)}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
