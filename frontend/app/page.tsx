
import WidgetContent from "./widget/WidgetContent";
const apiKey = process.env.NEXT_PUBLIC_FENBOT_API_KEY;
export default function Home() {
  return (
    <div className="h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Your Website Content</h1>
        <p className="text-slate-500 mt-2">The chat widget lives in the bottom-right corner →</p>
      </div>
      <WidgetContent/>
    </div>
  );
}