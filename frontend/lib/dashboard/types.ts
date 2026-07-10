export interface Message {
  id: string;
  sender: "customer" | "ai" | "agent";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  preview: string;
  time: string;
  status: "open" | "resolved" | "pending";
  email: string;
  messages: Message[];
}

export interface Chatbot {
  id: string;
  name: string;
  status: "online" | "offline" | "training";
  createdAt: string;
  conversationsCount: number;
  resolutionRate: string;
  model: string;
}

export interface KnowledgeSource {
  id: string;
  type: "website" | "pdf" | "manual";
  name: string;
  value: string; // URL, file size, or FAQ preview
  status: "ready" | "training" | "failed";
  dateAdded: string;
}

export interface ActivityEvent {
  id: string;
  type: "create_bot" | "train" | "upload" | "install" | "billing";
  text: string;
  time: string;
  metadata?: string;
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  description: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export interface UsageMeter {
  id: string;
  label: string;
  value: number;
  max: number;
  unit: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: string;
  date: string;
  status: "paid" | "open" | "void";
}
