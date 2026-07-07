/**
 * Widget Page — /widget?key=<api_key>
 *
 * Why the Suspense wrapper?
 * useSearchParams() makes this component "dynamic" (it reads from the URL at
 * request time). Next.js App Router requires a Suspense boundary around any
 * component that calls useSearchParams() so it knows what to render during
 * static generation / streaming. Without it, the build fails.
 *
 * Pattern: split into two components —
 *   WidgetContent  — the actual logic (uses useSearchParams)
 *   WidgetPage     — the page export (provides the Suspense boundary)
 */

import { Suspense } from "react";
import WidgetContent from "@/app/widget/WidgetContent";

export default function WidgetPage() {
  return (
    <Suspense fallback={null}>
      <WidgetContent />
    </Suspense>
  );
}
