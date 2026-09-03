"use client";

import { motion } from "motion/react";

function tokens(text) {
  // 中文按字、其余按词切分，保证中文逐字显现也自然
  const chunks = String(text).match(/[\u4e00-\u9fff]|[A-Za-z0-9]+|\s+|[^\sA-Za-z0-9\u4e00-\u9fff]/g) || [text];
  return chunks.filter((c) => c.trim() !== "");
}

export default function WordReveal({ text, className = "", shimmer = false, delay = 0 }) {
  const words = tokens(text);
  return (
    <span className={`word-reveal ${className}`} aria-label={text}>
      {words.map((word, index) => (
        word.trim() === "" ? (
          <span key={index} className="word-space" aria-hidden="true"> </span>
        ) : (
          <motion.span
            key={index}
            className="word-mask"
            aria-hidden="true"
            initial={{ opacity: 0, y: "1.1em", rotateX: 88, filter: "blur(12px)", scale: 0.86 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            style={{ transformOrigin: "50% 100%", transformPerspective: 900 }}
            transition={{ duration: 0.8, delay: delay + index * 0.055, ease: [0.16, 1, 0.3, 1] }}
          >
            {shimmer ? <span className="shimmer-text">{word}</span> : word}
          </motion.span>
        )
      ))}
    </span>
  );
}
