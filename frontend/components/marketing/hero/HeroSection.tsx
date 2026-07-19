"use client";

import React, { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

interface HeroSectionProps {
  sectionRef?: RefObject<HTMLElement | null>;
}

export function HeroSection({ sectionRef }: HeroSectionProps) {
  const forwardVideoRef = useRef<HTMLVideoElement>(null);
  const backwardVideoRef = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<"forward" | "backward">("forward");

  const playVideo = useCallback((direction: "forward" | "backward") => {
    const nextVideo = direction === "forward" ? forwardVideoRef.current : backwardVideoRef.current;
    if (!nextVideo) return;

    // The forward and backward files share the same endpoint frame, so the
    // layer swap should be instantaneous rather than blended.
    nextVideo.currentTime = 0;
    setActiveVideo(direction);
    void nextVideo.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    const forwardVideo = forwardVideoRef.current;
    const backwardVideo = backwardVideoRef.current;
    if (!forwardVideo || !backwardVideo) return;

    void forwardVideo.play().catch(() => undefined);

    return () => {
      forwardVideo.pause();
      backwardVideo.pause();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="FenBot AI customer support"
      className="relative isolate flex min-h-[100dvh] overflow-hidden bg-[#080909] text-white"
    >
      {/* The product film is the visual system for the hero, not a separate preview card. */}
      <video
        ref={forwardVideoRef}
        className="hero-video absolute inset-0 -z-20 h-full w-full object-cover object-[63%_center]"
        style={{ visibility: activeVideo === "forward" ? "visible" : "hidden" }}
        src="/forward.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => playVideo("backward")}
        aria-hidden="true"
      />
      <video
        ref={backwardVideoRef}
        className="hero-video absolute inset-0 -z-20 h-full w-full object-cover object-[63%_center]"
        style={{ visibility: activeVideo === "backward" ? "visible" : "hidden" }}
        src="/backward.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={() => playVideo("forward")}
        aria-hidden="true"
      />

      {/* Layered overlays keep the copy readable without flattening the video. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,8,.96)_0%,rgba(5,7,8,.84)_30%,rgba(5,7,8,.38)_62%,rgba(5,7,8,.12)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,7,8,.76)_0%,transparent_32%,rgba(5,7,8,.14)_62%,rgba(5,7,8,.82)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]"
      />

      <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-end px-5 pb-10 pt-28 sm:px-8 sm:pb-14 lg:px-10 lg:pb-16">
        <div className="max-w-[700px]">
            <div className="mb-7 inline-flex items-center gap-2 border border-white/15 bg-black/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-[#ff4b3e] shadow-[0_0_14px_rgba(255,75,62,.9)]" />
              Solve customer queries with AI
            </div>

            <h1 className="max-w-[13ch] font-display text-[clamp(3.5rem,7.5vw,7.2rem)] font-semibold leading-[.91] tracking-[-.075em] text-balance text-white">
              Launch support. Grow faster.
            </h1>

            <p className="mt-7 max-w-[34rem] text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
              Train your chatbot on your business data and make it live on your website in minutes.
            </p>

            <form
              className="mt-9 flex max-w-[560px] flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                const email = new FormData(event.currentTarget).get("email");
                window.location.href = `/auth/signup?email=${encodeURIComponent(String(email ?? ""))}`;
              }}
            >
              <label className="sr-only" htmlFor="hero-email">
                Business email
              </label>
              <input
                id="hero-email"
                name="email"
                type="email"
                placeholder="Enter your business email"
                autoComplete="email"
                required
                className="h-[52px] min-w-0 flex-1 border border-white/18 bg-black/25 px-4 text-sm text-white outline-none backdrop-blur-md transition-colors placeholder:text-white/42 focus:border-white/55"
              />
              <button
                type="submit"
                className="group inline-flex h-[52px] shrink-0 items-center justify-center gap-2 bg-[#ff4b3e] px-6 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(217,49,38,.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff6559] active:translate-y-0"
              >
                Start free
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>

            <Link
              href="#build-your-agent"
              className="group mt-3 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors duration-300 hover:text-white"
            >
              See how FenBot works
              <span aria-hidden="true" className="h-px w-7 bg-white/50 transition-all duration-300 group-hover:w-10 group-hover:bg-white" />
            </Link>

            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white/58">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-[#ff8178]" strokeWidth={2.5} />
                Free start
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-[#ff8178]" strokeWidth={2.5} />
                No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-[#ff8178]" strokeWidth={2.5} />
                Live in 5 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-[#ff8178]" strokeWidth={2.5} />
                Custom Trained
              </span>
            </div>
          </div>

        <div className="mt-12 flex items-center justify-between border-t border-white/15 pt-4 text-[10px] font-medium uppercase tracking-[0.18em] text-white/42">
          <span>AI support grounded in your data</span>
          <span className="hidden sm:inline">FenBot / Customer intelligence</span>
        </div>
      </div>
    </section>
  );
}
