import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";

export function useChatAi(apiKey: string) {
  return useChat({
    transport: new TextStreamChatTransport({
      api: "http://localhost:8000/chat",
      headers: {
        "X-Api-Key": apiKey,
      }
    })
  });
}