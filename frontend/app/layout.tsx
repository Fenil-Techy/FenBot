import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/*
  Inter is loaded via next/font — Next.js self-hosts it automatically.
  This means zero external network requests at runtime (good for performance + privacy).
  Weights: 400, 500, 600, 700 — exactly what the design system allows.
*/
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter", // Makes it available as a CSS variable too
  display: "swap",          // Shows fallback font while Inter loads (avoids invisible text)
});

export const metadata: Metadata = {
  title: {
    default: "FenBot — AI Customer Support for Small Businesses",
    template: "%s | FenBot",  // Dashboard pages can set their own title
  },
  description:
    "FenBot answers customer questions from your real data — orders, products, policies. No hallucinations. No support team needed.",
  metadataBase: new URL("https://fenbot.ai"), // Update when domain is live
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
      lang="en" — required for screen readers and SEO
      The inter.className applies the Inter font to the whole document.
      antialiased — makes text render smoother (subpixel anti-aliasing off).
    */
    <html lang="en" className={`${inter.variable} ${inter.className} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

