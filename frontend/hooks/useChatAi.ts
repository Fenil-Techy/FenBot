import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";

export function useChatAi(chatbot_id: string) {
  return useChat({
    transport: new TextStreamChatTransport({
      api: `http://localhost:8000/chat/${chatbot_id}`
    })
  });
}