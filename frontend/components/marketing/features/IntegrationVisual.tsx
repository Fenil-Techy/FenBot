import React, { useRef } from "react";
import { MessageSquare, MessageCircle, Send, Mail, PhoneCall, Sparkles } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";

// Custom X (Twitter) Icon SVG
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Custom Signal Icon SVG
const SignalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 2.224.728 4.28 1.959 5.945L2.031 22.03l4.238-1.921A9.946 9.946 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.12 12.502c-.524.364-1.026.54-1.503.54-.42 0-.82-.136-1.196-.407-.376-.271-.624-.555-.745-.85-.12-.294-.132-.71-.035-1.246.098-.536.29-.982.576-1.338.286-.356.66-.54.12-.54.343 0 .668.106.974.318.307.212.528.483.664.814.135.33.155.772.06 1.325-.096.554-.287 1.023-.574 1.404zm-5.18 1.488a2.533 2.533 0 0 1-1.353-.385 2.54 2.54 0 0 1-.925-1.042c-.225-.438-.337-.923-.337-1.455 0-.532.112-1.017.337-1.455a2.54 2.54 0 0 1 .925-1.042 2.533 2.533 0 0 1 1.353-.385.92.92 0 0 1 .925.385.92.92 0 0 1 .304 1.042.92.92 0 0 1-.304 1.455.92.92 0 0 1-.925 1.042.92.92 0 0 1-1.353.385z" />
  </svg>
);

// Custom Instagram Icon SVG
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function IntegrationVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const hubRef = useRef<HTMLDivElement>(null);
  
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const node3Ref = useRef<HTMLDivElement>(null);
  const node4Ref = useRef<HTMLDivElement>(null);
  const node5Ref = useRef<HTMLDivElement>(null);
  const node6Ref = useRef<HTMLDivElement>(null);
  const node7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] bg-slate-50/40 rounded-2xl border border-slate-200/80 shadow-md p-6 flex flex-col items-center justify-end overflow-hidden"
    >
      {/* Background radial guidelines */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none mb-12">
        <div className="w-[180px] h-[180px] border border-dashed border-slate-200/60 rounded-full absolute" />
        <div className="w-[280px] h-[280px] border border-dashed border-slate-200/40 rounded-full absolute" />
        <div className="w-[380px] h-[380px] border border-dashed border-slate-200/20 rounded-full absolute" />
      </div>

      {/* Orbiting Semicircle Nodes */}
      {/* Node 1: Messenger (Left bottom) */}
      <div
        ref={node1Ref}
        className="absolute left-[8%] top-[190px] size-9 sm:size-10 rounded-full bg-white border border-slate-150 shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-105 transition-transform"
        title="Messenger"
      >
        <MessageSquare className="size-4.5 sm:size-5 text-blue-600" />
      </div>

      {/* Node 2: Instagram (Left mid) */}
      <div
        ref={node2Ref}
        className="absolute left-[18%] top-[110px] size-9 sm:size-10 rounded-full bg-white border border-slate-150 shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-105 transition-transform"
        title="Instagram"
      >
        <InstagramIcon className="size-4.5 sm:size-5 text-pink-500" />
      </div>

      {/* Node 3: Gmail (Left high) */}
      <div
        ref={node3Ref}
        className="absolute left-[32%] top-[50px] size-9 sm:size-10 rounded-full bg-white border border-slate-150 shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-105 transition-transform"
        title="Gmail"
      >
        <Mail className="size-4 sm:size-4.5 text-red-500" />
      </div>

      {/* Node 4: X / Twitter (Top center) */}
      <div
        ref={node4Ref}
        className="absolute left-1/2 -translate-x-1/2 top-[20px] size-9 sm:size-10 rounded-full bg-white border border-slate-150 shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-105 transition-transform"
        title="X (Twitter)"
      >
        <XIcon className="size-4 sm:size-4.5 text-slate-800" />
      </div>

      {/* Node 5: WhatsApp (Right high) */}
      <div
        ref={node5Ref}
        className="absolute right-[32%] top-[50px] size-9 sm:size-10 rounded-full bg-white border border-slate-150 shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-105 transition-transform"
        title="WhatsApp"
      >
        <MessageCircle className="size-4.5 sm:size-5 text-emerald-500" />
      </div>

      {/* Node 6: Telegram / Viber (Right mid) */}
      <div
        ref={node6Ref}
        className="absolute right-[18%] top-[110px] size-9 sm:size-10 rounded-full bg-white border border-slate-150 shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-105 transition-transform"
        title="Telegram"
      >
        <Send className="size-4 sm:size-4.5 text-sky-400 rotate-[-15deg] -translate-x-0.5" />
      </div>

      {/* Node 7: Signal (Right bottom) */}
      <div
        ref={node7Ref}
        className="absolute right-[8%] top-[190px] size-9 sm:size-10 rounded-full bg-white border border-slate-150 shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-105 transition-transform"
        title="Signal"
      >
        <SignalIcon className="size-4.5 sm:size-5 text-blue-500" />
      </div>

      {/* Central Hub: Big Chatbot Widget Icon */}
      <div
        ref={hubRef}
        className="relative size-16 sm:size-20 rounded-full bg-black flex items-center justify-center text-white shadow-xl shadow-red-950/15 border-4 border-white z-20 mb-2 cursor-pointer hover:scale-102 transition-transform"
      >
        <img
          src="/logo/apple-touch-icon.png"
          alt="FenBot Logo"
          className="size-8 sm:size-10 object-contain rotate-[20deg]"
        />
        
      </div>

      {/* Animated Beams connecting Hub to Orbiting Nodes */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node1Ref}
        toRef={hubRef}
        gradientStartColor="#3B82F6"
        gradientStopColor="#60A5FA"
        pathColor="#E2E8F0"
        pathWidth={1.5}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node2Ref}
        toRef={hubRef}
        gradientStartColor="#EC4899"
        gradientStopColor="#F472B6"
        pathColor="#E2E8F0"
        pathWidth={1.5}
        duration={3.5}
        delay={0.2}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node3Ref}
        toRef={hubRef}
        gradientStartColor="#EF4444"
        gradientStopColor="#F87171"
        pathColor="#E2E8F0"
        pathWidth={1.5}
        duration={3}
        delay={0.4}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node4Ref}
        toRef={hubRef}
        gradientStartColor="#1F2937"
        gradientStopColor="#6B7280"
        pathColor="#E2E8F0"
        pathWidth={1.5}
        duration={4}
        delay={0.6}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node5Ref}
        toRef={hubRef}
        gradientStartColor="#10B981"
        gradientStopColor="#34D399"
        pathColor="#E2E8F0"
        pathWidth={1.5}
        duration={3.2}
        delay={0.8}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node6Ref}
        toRef={hubRef}
        gradientStartColor="#38BDF8"
        gradientStopColor="#7DD3FC"
        pathColor="#E2E8F0"
        pathWidth={1.5}
        duration={3.6}
        delay={1.0}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node7Ref}
        toRef={hubRef}
        gradientStartColor="#3B82F6"
        gradientStopColor="#60A5FA"
        pathColor="#E2E8F0"
        pathWidth={1.5}
        duration={4}
        delay={1.2}
      />
    </div>
  );
}
