"use client";

import React from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShoppingBag, Stethoscope, Coffee, Megaphone, Building2, Home } from "lucide-react";

type CardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  imgSrc: string;
  themeColor: string;
};

function IndustryCard({ title, description, icon: Icon, imgSrc, themeColor }: CardProps) {
  return (
    <div className="group relative h-[30rem] rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.015]">
      {/* SVG illustration — top 62% of card */}
      <div className="absolute inset-x-0 top-0 h-[62%] flex items-center justify-center px-8 pt-6 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105 pointer-events-none select-none">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-contain"
        />
        {/* Fade out illustration bottom edge into text area */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Text — absolute bottom, full width, no flex height issues */}
      <div className="absolute inset-x-0 bottom-0 px-7 py-6 bg-white">
        <div className="flex items-center gap-3 mb-2.5">
          <div
            className="size-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${themeColor}12`, color: themeColor }}
          >
            <Icon className="size-5" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 leading-tight tracking-tight">{title}</h3>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}

export function ForWhomSection() {
  return (
    <section
      id="for-whom"
      aria-labelledby="for-whom-heading"
      className="bg-canvas py-24 md:py-36 border-t border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Section Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-brand">Designed for Growth</p>
            <h2
              id="for-whom-heading"
              className="text-5xl sm:text-6xl font-extrabold tracking-tight text-ink leading-tight"
            >
              Every modern growing business{" "}
              <span className="text-brand">needs a modern AI chatbot</span>
            </h2>
            <p className="text-lg sm:text-xl text-ink-muted leading-relaxed max-w-3xl mx-auto">
              Automate customer interactions for local businesses, online stores, and growing teams.
              FenBot handles repetitive questions, schedules bookings, and lightens your support workload instantly.
            </p>
          </div>
        </BlurFade>

        {/* Industry Cards Grid */}
        <BlurFade delay={0.2} inView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <IndustryCard
              title="E-Commerce & Online Stores"
              description="Automate questions about products, prices, warranty policies, and track live shipping via Shopify."
              icon={ShoppingBag}
              imgSrc="/illustration/shopping Ecommerce.svg"
              themeColor="#E8281E"
            />

            <IndustryCard
              title="Clinics & Appointments"
              description="Let clients schedule bookings 24/7. Integrates with Google Calendar for dental, chiro, vet, and medical clinics."
              icon={Stethoscope}
              imgSrc="/illustration/dental-clinic.svg"
              themeColor="#0D9488"
            />

            <IndustryCard
              title="Cafes & Restaurants"
              description="Show daily menus, list allergens, handle table reservations, and guide customers with hours and directions."
              icon={Coffee}
              imgSrc="/illustration/Cafe.svg"
              themeColor="#D97706"
            />

            <IndustryCard
              title="Agencies & Consultation"
              description="Qualify inbound leads, capture contact info, sync to HubSpot, and book strategy sessions automatically."
              icon={Megaphone}
              imgSrc="/illustration/Meeting.svg"
              themeColor="#4F46E5"
            />

            <IndustryCard
              title="Hospitals & ER Triage"
              description="Guide patients to departments, explain visiting hours, and triage patient FAQs 24/7 to reduce workloads."
              icon={Building2}
              imgSrc="/illustration/Need doctor.svg"
              themeColor="#2563EB"
            />

            <IndustryCard
              title="Real Estate & Leasing"
              description="Showcase listings, pre-qualify buyer budgets, capture leads, and schedule open house walkthroughs."
              icon={Home}
              imgSrc="/illustration/City Skyline Building.svg"
              themeColor="#7C3AED"
            />

          </div>
        </BlurFade>

      </div>
    </section>
  );
}
