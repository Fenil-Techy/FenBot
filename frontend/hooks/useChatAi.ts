import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function useChatAi(){
    return useChat({
        transport:new DefaultChatTransport({
            api:"http://localhost:8000/chat",
        })
    })
}