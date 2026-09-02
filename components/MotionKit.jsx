"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { motion } from "motion/react";

export function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    let frame = 0;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return children;
}

export function Reveal({ children, delay = 0, y = 28, blur = true, className, ...props }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "none" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, step = 0.08 }) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * step, ease: [0.22, 1, 0.36, 1] }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </div>
  );
}
