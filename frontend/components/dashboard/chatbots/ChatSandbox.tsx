"use client";
import { useChatAi } from "@/hooks/useChatAi";
import { WidgetPanel } from "@/components/widget/WidgetPanel";

interface ChatSandboxProps {
  chatbot_id: string;
  chatbot_name: string;
  header_color?: string;
  bubble_color?: string;
  accent_color?: string;
  welcome_message?: string;
  input_placeholder?: string;
  widget_spacing?: number;
  widget_placement?: "left" | "right";
  /** Explicitly passed from parent to avoid deriving from header_color (prevents reset bug) */
  isDark?: boolean;
}

export function ChatSandbox({
  chatbot_id,
  chatbot_name,
  header_color,
  accent_color,
  welcome_message,
  input_placeholder,
  widget_spacing = 20,
  widget_placement = "right",
  isDark = true,
}: ChatSandboxProps) {
  const { messages, sendMessage, status } = useChatAi(chatbot_id);

  return (
    <WidgetPanel
      botName={chatbot_name}
      headerColor={header_color}
      accentColor={accent_color}
      isDark={isDark}
      welcomeMessage={welcome_message}
      inputPlaceholder={input_placeholder}
      messages={messages}
      status={status}
      onSend={(text) => (sendMessage as any)({ text })}
      className="absolute z-10 w-[295px] rounded-2xl shadow-2xl border"
      style={{
        bottom: `${widget_spacing}px`,
        left: widget_placement === "left" ? `${widget_spacing}px` : "auto",
        right: widget_placement === "right" ? `${widget_spacing}px` : "auto",
        height: "395px",
      }}
    />
  );
}
