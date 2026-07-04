export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
}

export type MessageBubbleProps = {
  role: "user" | "assistant" | "system";
  text: string;
};