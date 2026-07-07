import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "FenBot — AI Customer Support, Grounded in Your Data",
    template: "%s | FenBot",
  },
};

/**
 * Marketing layout — intentionally minimal.
 * The Navbar and Footer are rendered directly in page.tsx so the landing page
 * can own the heroRef and pass the correct zone (dark/light) down to the Navbar.
 * Future marketing sub-pages (e.g. /pricing standalone) can render their own
 * Navbar with zone="light" default.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
