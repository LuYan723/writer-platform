"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function once(target, event, timeout) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), timeout);
    const handler = () => {
      window.clearTimeout(timer);
      target.removeEventListener(event, handler);
      resolve();
    };
    target.addEventListener(event, handler);
  });
}

export default function LandingScrollVideo({ scrollStart, scrollEnd }) {
  const canvasRef = useRef(null);
  const fallbackRef = useRef(null);
  const framesRef = useRef([]);
  const lastFrameRef = useRef(-1);
  const seekingRef = useRef(false);
  const [framesReady, setFramesReady] = useState(false);
  const boundsRef = useRef({ scrollStart, scrollEnd });
  boundsRef.current = { scrollStart, scrollEnd };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf = 0;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      lastFrameRef.current = -1;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const { scrollStart: start, scrollEnd: end } = boundsRef.current;
      const progress = clamp((window.scrollY - start) / (end - start || 1), 0, 1);
      if (framesReady && framesRef.current.length) {
        const index = Math.round(progress * (framesRef.current.length - 1));
        if (index !== lastFrameRef.current) {
          lastFrameRef.current = index;
          const frame = framesRef.current[index];
          const cw = canvas.width;
          const ch = canvas.height;
          const scale = Math.max(cw / frame.width, ch / frame.height);
          const w = frame.width * scale;
          const h = frame.height * scale;
          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(frame, (cw - w) / 2, (ch - h) / 2, w, h);
        }
      }
    };

    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
    };
  }, [framesReady]);

  useEffect(() => {
    let disposed = false;
    let objectUrl = null;
    let bitmaps = [];

    const cleanup = () => {
      disposed = true;
      bitmaps.forEach((b) => b.close());
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setFramesReady(false);
    };

    const load = async () => {
      try {
        const response = await fetch(VIDEO_URL, { mode: "cors" });
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        const video = document.createElement("video");
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        video.src = objectUrl;
        await once(video, "loadedmetadata", 15000);
        const scale = Math.min(1, 1280 / video.videoWidth);
        const count = clamp(Math.round(video.duration * 24), 30, 120);
        for (let i = 0; i < count; i += 1) {
          if (disposed) return;
          video.currentTime = (i / (count - 1)) * (video.duration - 0.05);
          await once(video, "seeked", 3000);
          bitmaps.push(
            await createImageBitmap(video, {
              resizeWidth: Math.max(1, Math.round(video.videoWidth * scale)),
              resizeHeight: Math.max(1, Math.round(video.videoHeight * scale))
            })
          );
        }
        if (disposed) return;
        framesRef.current = bitmaps;
        setFramesReady(true);
        if (canvasRef.current) canvasRef.current.style.visibility = "visible";
      } catch {
        setFramesReady(false);
        if (canvasRef.current) canvasRef.current.style.visibility = "hidden";
      }
    };

    if (canvasRef.current) canvasRef.current.style.visibility = "hidden";
    load();
    return cleanup;
  }, []);

  useEffect(() => {
    const video = fallbackRef.current;
    if (!video) return undefined;
    const release = () => { seekingRef.current = false; };
    video.addEventListener("seeked", release);
    video.addEventListener("stalled", release);
    video.addEventListener("error", release);
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = fallbackRef.current;
      if (!el || framesReady || !el.duration) return;
      const { scrollStart: start, scrollEnd: end } = boundsRef.current;
      const progress = clamp((window.scrollY - start) / (end - start || 1), 0, 1);
      const target = progress * el.duration;
      if (!seekingRef.current && Math.abs(el.currentTime - target) > 0.001) {
        seekingRef.current = true;
        el.currentTime = target;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("seeked", release);
      video.removeEventListener("stalled", release);
      video.removeEventListener("error", release);
    };
  }, [framesReady]);

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: "#0a0a0a", top: "-20%" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-[120%] w-full" style={{ visibility: "hidden" }} />
      {!framesReady ? (
        <video
          ref={fallbackRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          onLoadedData={(event) => { event.currentTarget.currentTime = 0; }}
        />
      ) : null}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
