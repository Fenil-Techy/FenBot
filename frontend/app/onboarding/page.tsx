"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";


export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  
  // Form states
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [businessType, setBusinessType] = useState("E-Commerce");
  const [goals, setGoals] = useState<string[]>([]);
  const [otherGoalText, setOtherGoalText] = useState("");
  const [discovery, setDiscovery] = useState("");
  const [otherDiscoveryText, setOtherDiscoveryText] = useState("");

  const [validationError, setValidationError] = useState("");
  const router = useRouter();

  // Validate step transitions
  const handleNext = () => {
    setValidationError("");
    if (step === 2) {
      if (!businessName.trim()) {
        setValidationError("Business name is required");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setValidationError("");
    setStep(step - 1);
  };

  // Toggle goals checkbox list
  const handleGoalToggle = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  // Finish onboarding and redirect
  const handleFinish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding_completed", "true");
      
      // Save responses locally
      const onboardingData = {
        businessName,
        websiteUrl,
        businessType,
        goals: goals.includes("Other") ? [...goals.filter(g => g !== "Other"), `Other: ${otherGoalText}`] : goals,
        discovery: discovery === "Other" ? `Other: ${otherDiscoveryText}` : discovery,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem("onboarding_responses", JSON.stringify(onboardingData));
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#E8281E]">
      
      {/* ── Left Panel (60%): Deep Notion-like Dark with onboarding content ── */}
      <div className="w-full lg:w-[60%] bg-[#09090B] text-white flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden select-none border-r border-zinc-800">
        
        {/* Animated starfield background in left dark section (stars parallax removed, keeping clean dark grid texture) */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden bg-[#09090B]">
          {/* Subtle grid pattern background with increased line opacity for better premium visibility */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        </div>

        {/* Top: Brand Logo Wordmark */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 font-display tracking-tight text-white inline-flex">
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

        {/* Center: Onboarding Form Container */}
        <div className="w-full max-w-[460px] mx-auto my-auto relative z-10 py-10 flex flex-col justify-center">

          {/* Dynamic Step Content + Buttons as one tight block */}
          <div className="flex flex-col gap-8">

            {/* STEP 1: Welcome */}
            {step === 1 && (
              <div className="space-y-3 animate-fade-in">
                <h1 className="text-[2.6rem] font-extrabold text-white tracking-tight leading-[1.15]">Let&apos;s build your AI chatbot</h1>
                <p className="text-base text-zinc-400 font-medium leading-relaxed">
                  We&apos;ll ask a few questions to personalize your chatbot. This takes less than 2 minutes.
                </p>
              </div>
            )}

            {/* STEP 2: Business Info */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-[2.6rem] font-extrabold text-white tracking-tight leading-[1.15]">Business Information</h2>
                  <p className="text-base text-zinc-400 font-medium leading-relaxed">Tell us a bit about your company.</p>
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Business Name <span className="text-[#E8281E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Davis Dental Clinic"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={`w-full border rounded-2xl px-5 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E8281E]/30 transition-all duration-200 bg-[#18181B] border-zinc-800 text-white placeholder:text-zinc-600 ${
                      validationError ? "border-red-500/60 focus:ring-red-500/20" : "focus:border-[#E8281E]/70"
                    }`}
                  />
                  {validationError && (
                    <p className="text-xs text-red-400 font-semibold">{validationError}</p>
                  )}
                </div>

                {/* Website URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Website URL <span className="text-zinc-500 lowercase">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.davisdental.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full border border-zinc-800 rounded-2xl px-5 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E8281E]/30 focus:border-[#E8281E]/70 transition-all duration-200 bg-[#18181B] text-white placeholder:text-zinc-600"
                  />
                </div>

                {/* Business Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Business Type
                  </label>
                  <div className="relative">
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full border border-zinc-800 rounded-2xl px-5 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E8281E]/30 focus:border-[#E8281E]/70 transition-all duration-200 bg-[#18181B] text-white appearance-none cursor-pointer"
                    >
                      <option value="E-Commerce">E-Commerce</option>
                      <option value="Local Business">Local Business</option>
                      <option value="Clinic & Healthcare">Clinic & Healthcare</option>
                      <option value="Restaurant & Cafe">Restaurant & Cafe</option>
                      <option value="Agency & Consultation">Agency & Consultation</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-500">
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Goals */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-[2.6rem] font-extrabold text-white tracking-tight leading-[1.15]">What is your chatbot&apos;s goal?</h2>
                  <p className="text-base text-zinc-400 font-medium leading-relaxed">Select all that apply.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Answer customer questions",
                    "Generate leads",
                    "Recommend products",
                    "Book appointments",
                    "Reduce support workload",
                    "Other"
                  ].map((goal) => {
                    const isChecked = goals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleGoalToggle(goal)}
                        className={`group flex items-center justify-between px-5 py-4 border rounded-2xl text-left text-[15px] font-semibold transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                          isChecked
                            ? "bg-[#E8281E]/10 border-[#E8281E]/70 text-white shadow-[0_0_18px_rgba(232,40,30,0.15)]"
                            : "bg-[#18181B] border-zinc-800 text-zinc-400 hover:bg-zinc-800/60 hover:border-zinc-600 hover:text-zinc-200"
                        }`}
                      >
                        <span>{goal}</span>
                        <div
                          className={`size-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                            isChecked
                              ? "bg-[#E8281E] border-[#E8281E] text-white scale-110"
                              : "border-zinc-600 bg-zinc-900 group-hover:border-zinc-500"
                          }`}
                        >
                          {isChecked && <Check className="size-3" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {goals.includes("Other") && (
                  <div className="animate-fade-in">
                    <input
                      type="text"
                      placeholder="Tell us what you want to accomplish..."
                      value={otherGoalText}
                      onChange={(e) => setOtherGoalText(e.target.value)}
                      required
                      className="w-full border border-zinc-800 rounded-2xl px-5 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E8281E]/30 focus:border-[#E8281E]/70 transition-all duration-200 bg-[#18181B] text-white placeholder:text-zinc-600"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Discovery */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-[2.6rem] font-extrabold text-white tracking-tight leading-[1.15]">How did you hear about us?</h2>
                  <p className="text-base text-zinc-400 font-medium leading-relaxed">This helps us improve. Always optional.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {["Google", "YouTube", "LinkedIn", "Friend", "X (Twitter)", "Other"].map((src) => {
                    const isSelected = discovery === src;
                    return (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setDiscovery(src)}
                        className={`flex items-center justify-center px-5 py-4 border rounded-2xl text-center text-[15px] font-semibold transition-all duration-200 cursor-pointer active:scale-[0.96] ${
                          isSelected
                            ? "bg-[#E8281E]/10 border-[#E8281E]/70 text-white shadow-[0_0_18px_rgba(232,40,30,0.15)] scale-[1.02]"
                            : "bg-[#18181B] border-zinc-800 text-zinc-400 hover:bg-zinc-800/60 hover:border-zinc-600 hover:text-zinc-200"
                        }`}
                      >
                        {src}
                      </button>
                    );
                  })}
                </div>

                {discovery === "Other" && (
                  <div className="animate-fade-in">
                    <input
                      type="text"
                      placeholder="Please specify..."
                      value={otherDiscoveryText}
                      onChange={(e) => setOtherDiscoveryText(e.target.value)}
                      required
                      className="w-full border border-zinc-800 rounded-2xl px-5 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E8281E]/30 focus:border-[#E8281E]/70 transition-all duration-200 bg-[#18181B] text-white placeholder:text-zinc-600"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: Finish */}
            {step === 5 && (
              <div className="space-y-3 animate-fade-in">
                <h1 className="text-[2.6rem] font-extrabold text-white tracking-tight leading-[1.15]">Your chatspace is ready!</h1>
                <p className="text-base text-zinc-400 font-medium leading-relaxed">
                  FenBot has configured your workspace with defaults matching your business goals. Let&apos;s go train your agent.
                </p>
              </div>
            )}

            {/* Action Buttons — sit directly below content, no flex stretch gap */}
            <div className="flex items-center gap-3">
              {step > 1 && step < 5 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2 h-12 px-5 border border-zinc-700 rounded-2xl text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="relative flex items-center justify-center gap-2 h-12 px-8 bg-white hover:bg-zinc-100 text-black rounded-2xl text-[15px] font-bold transition-all duration-150 active:scale-95 shadow-[0_0_24px_rgba(255,255,255,0.12)] hover:shadow-[0_0_32px_rgba(255,255,255,0.2)] cursor-pointer"
                >
                  {step === 1 ? "Get started" : "Next"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="relative flex items-center justify-center gap-2 h-12 px-8 bg-white text-black hover:bg-zinc-100 rounded-2xl text-[15px] font-bold transition-all duration-150 active:scale-95 shadow-[0_0_24px_rgba(255,255,255,0.12)] hover:shadow-[0_0_32px_rgba(255,255,255,0.2)] cursor-pointer"
                >
                  Continue to dashboard
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Bottom: Copyright Info */}
        <div className="relative z-10 text-xs text-zinc-500 flex gap-4">
          <span>&copy; {new Date().getFullYear()} FenBot Inc.</span>
          <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
          <Link href="#pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
        </div>
      </div>

      {/* ── Right Panel (40%): Brand Red Canvas (Empty space with glow & grid) ── */}
      <div className="hidden lg:block lg:w-[40%] bg-[#E8281E] relative overflow-hidden min-h-screen">
        {/* Subtle radial white glow accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_80%)] pointer-events-none" />
        
        {/* Tiny grid pattern on top of red bg for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      </div>
      
    </div>
  );
}
