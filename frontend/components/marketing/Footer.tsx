import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// ─────────────────────────────────────────────────────────────────
// Footer link columns
// ─────────────────────────────────────────────────────────────────

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Live demo", href: "#demo" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "mailto:hello@fenbot.ai" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
    ],
  },
] as const;

// ─────────────────────────────────────────────────────────────────
// Footer — dark zone, bookends the page with the hero
// ─────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-[#0A0A0A] border-t border-[#1A1A1A]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Top: brand + links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-lg font-bold mb-3"
              aria-label="FenBot home"
            >
              <img
                src="/logo/apple-touch-icon.png"
                alt=""
                className="h-5 w-auto rotate-[15deg]"
              />
              <div className="flex items-center gap-0.5">
                <span className="text-[#F5F5F5]">Fen</span>
                <span className="text-[#E8281E]">Bot</span>
              </div>
            </Link>
            <p className="text-body-sm text-[#4A4A4A] max-w-xs leading-relaxed">
              AI customer support grounded in your real business data. No
              hallucinations. No support team needed.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <p className="text-eyebrow text-[#4A4A4A] mb-4">{col.heading}</p>
              <ul className="flex flex-col gap-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-[#4A4A4A] hover:text-[#A3A3A3] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-[#1A1A1A] mb-8" />

        {/* Bottom: copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-body-sm text-[#4A4A4A]">
            © {new Date().getFullYear()} FenBot. All rights reserved.
          </p>
          <p className="text-body-sm text-[#2A2A2A]">
            Built with ♥ for small businesses
          </p>
        </div>
      </div>
    </footer>
  );
}
