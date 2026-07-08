import React, { useRef } from "react";
import { FileText, Globe } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

export function BeamDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);
  const deployRef = useRef<HTMLDivElement>(null);

  const NODE_BASE =
    "size-14 rounded-2xl flex items-center justify-center border text-sm font-semibold shadow-sm";

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center gap-16 py-8"
      aria-hidden="true"
    >
      {/* Node: Your Content */}
      <div className="flex flex-col items-center gap-2">
        <div
          ref={contentRef}
          className={cn(NODE_BASE, "bg-surface-raised border-border text-ink")}
        >
          <FileText className="size-6 text-ink-muted" />
        </div>
        <span className="text-body-sm text-ink-muted text-center">
          Your content
        </span>
      </div>

      {/* Node: FenBot Engine */}
      <div className="flex flex-col items-center gap-2">
        <div
          ref={engineRef}
          className={cn(
            NODE_BASE,
            "bg-hero-canvas border-hero-border text-white scale-110"
          )}
        >
          <span className="text-brand font-bold text-base">F</span>
        </div>
        <span className="text-body-sm text-ink-muted text-center">
          FenBot
        </span>
      </div>

      {/* Node: Your Site */}
      <div className="flex flex-col items-center gap-2">
        <div
          ref={deployRef}
          className={cn(NODE_BASE, "bg-surface-raised border-border text-ink")}
        >
          <Globe className="size-6 text-ink-muted" />
        </div>
        <span className="text-body-sm text-ink-muted text-center">
          Your site
        </span>
      </div>

      {/* Animated beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={contentRef}
        toRef={engineRef}
        gradientStartColor="#E8281E"
        gradientStopColor="#FF6B5A"
        pathColor="#E4E4E7"
        pathWidth={1.5}
        duration={4}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={engineRef}
        toRef={deployRef}
        gradientStartColor="#E8281E"
        gradientStopColor="#FF6B5A"
        pathColor="#E4E4E7"
        pathWidth={1.5}
        duration={4}
        delay={0.5}
      />
    </div>
  );
}
