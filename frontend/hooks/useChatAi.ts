import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";

function getVisitorId(){
  if (typeof window === "undefined") return

  let id=localStorage.getItem("fenbot_visitor_id")
  if (!id){
    id=crypto.randomUUID()
    localStorage.setItem("fenbot_visitor_id",id)
  }
  return id
}


export function useChatAi(chatbot_id: string) {
  return useChat({
    transport: new TextStreamChatTransport({
      api: `http://localhost:8000/chat/${chatbot_id}`,
      body:{
        visitor_id:getVisitorId()
      }
    })
  });
}