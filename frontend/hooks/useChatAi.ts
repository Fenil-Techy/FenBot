import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";

export function useChatAi(){
    return useChat({
        transport:new TextStreamChatTransport({
            api:"http://localhost:8000/chat",
        })
    })
}