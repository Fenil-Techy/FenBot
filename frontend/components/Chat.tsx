"use client"
import { useChatAi } from "@/hooks/useChatAi"

export function Chat(){
    const{messages,sendMessage,status}=useChatAi()

    return(

        <div>
      <h1>AI Commerce Agent</h1>

      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}</strong>

          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return <p key={index}>{part.text}</p>;
            }

            return null;
          })}
        </div>
      ))}
      <p>status : {status}</p>
    </div>
)
}