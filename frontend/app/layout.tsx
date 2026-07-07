import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/*
  Font strategy:
  - Inter         → body text, UI labels, buttons. Already trusted, already loaded.
  - Space Grotesk → display/headline text. Technical personality without being gimmicky.
                    Used by Railway, Resend — trusted in the dev/SaaS space.
  - JetBrains Mono → embed code snippets, API keys, monospace UI elements.

  All fonts are self-hosted by Next.js (zero external requests at runtime).
  CSS variable names match the @theme block in globals.css.
*/

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FenBot — AI Customer Support, Grounded in Your Data",
    template: "%s | FenBot",
  },
  description:
    "FenBot answers customer questions from your real data — orders, products, policies. No hallucinations. No support team needed. Deploy in 5 minutes.",
  metadataBase: new URL("https://fenbot.ai"),
  openGraph: {
    title: "FenBot — AI Customer Support, Grounded in Your Data",
    description:
      "No hallucinations. No support team. FenBot is grounded in your real business data.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FenBot — AI Customer Support, Grounded in Your Data",
    description: "No hallucinations. No support team needed.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
      All three font CSS variables are applied to <html>.
      The @theme block in globals.css maps them to Tailwind utilities:
        font-sans    → Inter (via --font-inter)
        font-display → Space Grotesk (via --font-space-grotesk)
        font-mono    → JetBrains Mono (via --font-jetbrains-mono)
    */
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
