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
            initial={{ opacity: 0, y: "0.7em", filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.65, delay: delay + index * 0.045, ease: [0.22, 1, 0.36, 1] }}
          >
            {shimmer ? <span className="shimmer-text">{word}</span> : word}
          </motion.span>
        )
      ))}
    </span>
  );
}
