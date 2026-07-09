"use client";

import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-[#E8281E]">
      {/* Left Panel: 60% width on desktop, hidden on mobile. Deep Notion-like Dark. */}
      <div className="hidden lg:flex lg:w-[60%] bg-[#09090B] text-white flex-col justify-between p-12 border-r border-zinc-800 relative overflow-hidden select-none">
        {/* Subtle grid pattern background for premium texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Logo Wordmark */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 font-display tracking-tight text-white">
            <img
              src="/logo/apple-touch-icon.png"
              alt="FenBot"
              className="h-8 w-auto rotate-[20deg]"
            />
            <span className="text-xl font-bold leading-none">
              <span>Fen</span>
              <span className="text-red-500">Bot</span>
            </span>
          </Link>
        </div>

        {/* Centered Auth SVG Illustration */}
        <div className="absolute inset-0 flex items-center justify-center p-16 pointer-events-none">
          <img
            src="/illustration/auth.svg"
            alt="Authentication Visual"
            className="w-full max-w-[480px] h-auto object-contain opacity-95 transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-zinc-500 flex gap-4">
          <span>&copy; {new Date().getFullYear()} FenBot Inc.</span>
          <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
          <Link href="#pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
        </div>
      </div>

      {/* Right Panel: 40% width on desktop, 100% on mobile. Brand Red canvas centering the auth cards. */}
      <div className="w-full lg:w-[40%] bg-[#E8281E] flex items-center justify-center p-6 sm:p-8 relative overflow-hidden min-h-screen lg:min-h-screen">
        {/* Subtle radial white glow accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_80%)] pointer-events-none" />
        
        {/* Tiny grid pattern on top of red bg for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Card container with strict max-width constraints to prevent squeezing */}
        <div className="w-full max-w-[420px] relative z-10 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
