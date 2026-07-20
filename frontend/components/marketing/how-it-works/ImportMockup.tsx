"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause } from "lucide-react";

export function ImportMockup() {
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePause = () => {
    setIsPaused((p) => {
      const next = !p;
      if (videoRef.current) {
        if (next) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch((err) => {
            console.warn("Video playback failed:", err);
          });
        }
      }
      return next;
    });
  };

  // Sync video play/pause with component state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPaused) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.warn("Auto-play blocked or interrupted:", err);
      });
    }
  }, [isPaused]);

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] bg-[#1a73e8] select-none group shadow-[0_16px_48px_-12px_rgba(0,0,0,0.16)]">
      {/* Video element */}
      <video
        ref={videoRef}
        src="/importvideo.mp4"
        loop
        muted
        playsInline
        onClick={togglePause}
        className="w-full h-auto block cursor-pointer"
      />

      {/* Dim/Blur overlay when paused + central Play icon */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={togglePause}
            className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center cursor-pointer z-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="size-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl"
            >
              <Play className="size-6 text-white fill-white ml-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Standalone Floating Play/Pause Button Overlay (Circle Outline matching Ref) ── */}
      <div className="absolute bottom-6 left-6 z-20">
        <motion.button
          onClick={togglePause}
          className="size-10 rounded-full flex items-center justify-center cursor-pointer border-2 border-white/90"
          style={{
            background: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(6px)",
          }}
          whileHover={{
            scale: 1.08,
            background: "rgba(0, 0, 0, 0.4)",
            borderColor: "#ffffff",
          }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isPaused ? (
              <motion.div
                key="play"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Play className="size-4 text-white fill-white ml-0.5" />
              </motion.div>
            ) : (
              <motion.div
                key="pause"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Pause className="size-4 text-white fill-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
