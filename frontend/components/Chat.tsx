"use client";
import { useChatAi } from "@/hooks/useChatAi";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function Chat() {
  const { messages, sendMessage, status } = useChatAi();

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto border border-gray-200 rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">
        AI Commerce Agent
      </div>

      <MessageList messages={messages} status={status} />

      <ChatInput
        onSend={(text) => sendMessage({ text })}
        disabled={status === "streaming"}
      />
    </div>
  );
}