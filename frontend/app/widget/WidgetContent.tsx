"use client";

import { useSearchParams } from "next/navigation";
import { ChatWidget } from "@/app/widget/components/ChatWidget";

/**
 * WidgetContent — the actual widget logic. 
 * Lives inside a Suspense boundary (see page.tsx).
 * Reads the ?key= param from the URL to authenticate the chat widget.
 */
export default function WidgetContent() {
  const params = useSearchParams();
  const apiKey = params.get("key") ?? "fb_OOto07DXTQDBSHFUnvvokcpUp8tYIUsrjOOwSt4zEJo";

  if (!apiKey) {
    return (
      <div className="p-4 text-sm" style={{ color: "var(--color-error)" }}>
        Missing API key. Embed the widget with{" "}
        <code>?key=your_api_key</code> in the URL.
      </div>
    );
  }

  return <ChatWidget apiKey="fb_OOto07DXTQDBSHFUnvvokcpUp8tYIUsrjOOwSt4zEJo" />;
}
