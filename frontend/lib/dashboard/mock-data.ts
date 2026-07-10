import {
  Conversation,
  Chatbot,
  KnowledgeSource,
  ActivityEvent,
  KpiMetric,
  UsageMeter,
  Invoice
} from "./types";

// Toggle between data-populated and empty states for each route page
export const hasData = {
  chatbots: true,
  inbox: true,
  knowledge: true,
  analytics: true,
  billing: true,
  settings: true,
};

// Main Workspace Name
export const workspaceName = "Acme Support";

// Active User Mock
export const currentUser = {
  name: "Fenil Techy",
  email: "fenil@fenbot.ai",
  avatarUrl: "", // Defaults to initials
};

// Hero Status Details
export const aiStatus = {
  name: "Customer Support AI",
  status: "online" as const,
  message: "Working normally. Last response 14 seconds ago.",
};

// Home KPIs
export const homeKpis: KpiMetric[] = [
  {
    id: "kpi-1",
    title: "Conversations Today",
    value: "47",
    description: "vs 42 yesterday",
    trend: "+12%",
    trendDirection: "up",
  },
  {
    id: "kpi-2",
    title: "Resolution Rate",
    value: "89%",
    description: "vs 85% weekly avg",
    trend: "+4%",
    trendDirection: "up",
  },
  {
    id: "kpi-3",
    title: "Knowledge Sources",
    value: "12",
    description: "Updated 2h ago",
    trendDirection: "neutral",
  },
  {
    id: "kpi-4",
    title: "Chatbot Status",
    value: "Online",
    description: "All engines nominal",
    trendDirection: "neutral",
  },
];

// Recent Conversations (Home Grid list, 5 rows)
export const recentConversations: Conversation[] = [
  {
    id: "conv-1",
    customerName: "Sarah Jenkins",
    preview: "Hey, can I upgrade my subscription plan mid-billing cycle?",
    time: "4 mins ago",
    status: "open",
    email: "sarah.j@gmail.com",
    messages: [
      { id: "m1", sender: "customer", content: "Hey, can I upgrade my subscription plan mid-billing cycle?", timestamp: "10:17 AM" },
      { id: "m2", sender: "ai", content: "Yes! You can upgrade your plan at any time from your Billing Settings page. We will calculate a pro-rated amount for the remaining days of your billing cycle.", timestamp: "10:17 AM" },
      { id: "m3", sender: "customer", content: "Awesome, does it happen immediately?", timestamp: "10:18 AM" },
    ]
  },
  {
    id: "conv-2",
    customerName: "David K.",
    preview: "Refund policy for damaged goods? Ordered on Tuesday.",
    time: "15 mins ago",
    status: "open",
    email: "david.k@yahoo.com",
    messages: [
      { id: "m4", sender: "customer", content: "Refund policy for damaged goods? Ordered on Tuesday.", timestamp: "10:06 AM" },
      { id: "m5", sender: "ai", content: "According to Acme Support policy, damaged products can be refunded or replaced if reported within 30 days of delivery. Please upload a photo of the damaged items so I can generate a prepaid return label.", timestamp: "10:07 AM" },
    ]
  },
  {
    id: "conv-3",
    customerName: "Alex Rivera",
    preview: "Tracking code says invalid. Order #40889.",
    time: "1 hour ago",
    status: "pending",
    email: "arivera@techcorp.com",
    messages: [
      { id: "m6", sender: "customer", content: "Tracking code says invalid. Order #40889.", timestamp: "9:21 AM" },
      { id: "m7", sender: "ai", content: "Checking your order status. Order #40889 was shipped yesterday via FedEx, but it can take up to 24 hours for carrier tracking links to become active. I will check again shortly.", timestamp: "9:22 AM" }
    ]
  },
  {
    id: "conv-4",
    customerName: "Elena Rostova",
    preview: "How do I hook up the Slack integration? Got error 403.",
    time: "2 hours ago",
    status: "resolved",
    email: "elena@rostov-design.co",
    messages: [
      { id: "m8", sender: "customer", content: "How do I hook up the Slack integration? Got error 403.", timestamp: "8:10 AM" },
      { id: "m9", sender: "ai", content: "The 403 error suggests permission issues. Please make sure your workspace admin has approved the FenBot app. You can authorize it using the link: acme.com/auth/slack.", timestamp: "8:11 AM" },
      { id: "m10", sender: "customer", content: "Got it working. Thanks!", timestamp: "8:15 AM" }
    ]
  },
  {
    id: "conv-5",
    customerName: "Marcus Vance",
    preview: "Do you ship internationally to Germany?",
    time: "3 hours ago",
    status: "resolved",
    email: "marcus.v@web.de",
    messages: [
      { id: "m11", sender: "customer", content: "Do you ship internationally to Germany?", timestamp: "7:02 AM" },
      { id: "m12", sender: "ai", content: "Yes, Acme ships internationally to Germany! Shipping takes 5-7 business days and starts at $15. Customs fees are calculated at checkout.", timestamp: "7:03 AM" }
    ]
  }
];

// Expanded Conversations for Inbox (6 rows)
export const inboxConversations: Conversation[] = [
  ...recentConversations,
  {
    id: "conv-6",
    customerName: "Chloe Dupont",
    preview: "My discount code ACME20 isn't applying at checkout.",
    time: "5 hours ago",
    status: "open",
    email: "chloe.dupont@orange.fr",
    messages: [
      { id: "m13", sender: "customer", content: "My discount code ACME20 isn't applying at checkout.", timestamp: "5:12 AM" },
      { id: "m14", sender: "ai", content: "Discount code ACME20 is only applicable to orders over $50. It looks like your cart subtotal is currently $42.50. Adding one more item will activate the discount!", timestamp: "5:13 AM" }
    ]
  }
];

// Chatbots list (2 chatbots)
export const chatbotsList: Chatbot[] = [
  {
    id: "bot-1",
    name: "Customer Support AI",
    status: "online",
    createdAt: "Jul 01, 2026",
    conversationsCount: 1248,
    resolutionRate: "89.2%",
    model: "FenBot-Core-v2"
  },
  {
    id: "bot-2",
    name: "Lead Generation Assistant",
    status: "training",
    createdAt: "Jul 09, 2026",
    conversationsCount: 142,
    resolutionRate: "72.5%",
    model: "FenBot-Lite-v1"
  }
];

// Knowledge Sources (website, 3 PDFs, 2 manual entries)
export const knowledgeSources: KnowledgeSource[] = [
  {
    id: "ks-1",
    type: "website",
    name: "Acme Main Documentation Site",
    value: "https://docs.acme-corp.com",
    status: "ready",
    dateAdded: "Jul 02, 2026"
  },
  {
    id: "ks-2",
    type: "pdf",
    name: "Refund_Policy_2026_v2.pdf",
    value: "2.4 MB",
    status: "ready",
    dateAdded: "Jul 02, 2026"
  },
  {
    id: "ks-3",
    type: "pdf",
    name: "Shipping_Rates_International.pdf",
    value: "840 KB",
    status: "ready",
    dateAdded: "Jul 05, 2026"
  },
  {
    id: "ks-4",
    type: "pdf",
    name: "Slack_Integration_Developer_Guide.pdf",
    value: "1.1 MB",
    status: "ready",
    dateAdded: "Jul 08, 2026"
  },
  {
    id: "ks-5",
    type: "manual",
    name: "Standard FAQ: Slack Setup & Permissions",
    value: "4 QA Pairs",
    status: "ready",
    dateAdded: "Jul 08, 2026"
  },
  {
    id: "ks-6",
    type: "manual",
    name: "Manual QA: International Shipping Tax Info",
    value: "1 QA Pair",
    status: "training",
    dateAdded: "Jul 10, 2026"
  }
];

// Activity Timeline (chronological events)
export const activityEvents: ActivityEvent[] = [
  {
    id: "act-1",
    type: "train",
    text: "Website trained: docs.acme-corp.com",
    time: "2 hours ago",
    metadata: "148 pages indexed successfully"
  },
  {
    id: "act-2",
    type: "upload",
    text: "PDF uploaded: Shipping_Rates_International.pdf",
    time: "5 hours ago",
    metadata: "Extracted 12 tables, 14 paragraphs"
  },
  {
    id: "act-3",
    type: "install",
    text: "Widget code installed on acme.com storefront",
    time: "Yesterday",
    metadata: "Verified widget active on 1 domain"
  },
  {
    id: "act-4",
    type: "billing",
    text: "Workspace upgraded to Growth Plan",
    time: "3 days ago",
    metadata: "Limit extended to 2,500 active users"
  },
  {
    id: "act-5",
    type: "create_bot",
    text: "New assistant chatbot initialized",
    time: "4 days ago",
    metadata: "Lead Generation Assistant created"
  }
];

// Highlighted conversation preview snippet (displayed below activity)
export const highlightedConversationPreview: Conversation = {
  id: "conv-1",
  customerName: "Sarah Jenkins",
  preview: "Hey, can I upgrade my subscription plan mid-billing cycle?",
  time: "4 mins ago",
  status: "open",
  email: "sarah.j@gmail.com",
  messages: [
    { id: "m1", sender: "customer", content: "Hey, can I upgrade my subscription plan mid-billing cycle?", timestamp: "10:17 AM" },
    { id: "m2", sender: "ai", content: "Yes! You can upgrade your plan at any time from your Billing Settings page. We will calculate a pro-rated amount for the remaining days of your billing cycle.", timestamp: "10:17 AM" },
    { id: "m3", sender: "customer", content: "Awesome, does it happen immediately?", timestamp: "10:18 AM" },
    { id: "m4", sender: "ai", content: "Yes, once checkout is complete, your workspace limits will instantly upgrade to the Growth tier. Let me know if you would like me to draft an invoice preview.", timestamp: "10:19 AM" },
  ]
};

// Analytics KPIs & Chart Data
export const analyticsMetrics: KpiMetric[] = [
  { id: "am-1", title: "Total Conversations", value: "3,284", description: "+15.4% this month", trend: "+15.4%", trendDirection: "up" },
  { id: "am-2", title: "AI Automated Rate", value: "81.6%", description: "2,680 inquiries answered", trend: "+2.1%", trendDirection: "up" },
  { id: "am-3", title: "Avg Resolution Time", value: "1m 14s", description: "Decreased by 24s", trend: "-18%", trendDirection: "up" }, // decreasing time is positive
  { id: "am-4", title: "CSAT Score", value: "4.82/5", description: "Based on 412 ratings", trend: "+0.15", trendDirection: "up" }
];

// Mock analytics graphs data (days & counts for CSS bar charts)
export const dailyConversationCounts = [
  { day: "Mon", count: 42, automated: 34 },
  { day: "Tue", count: 55, automated: 44 },
  { day: "Wed", count: 68, automated: 52 },
  { day: "Thu", count: 48, automated: 40 },
  { day: "Fri", count: 72, automated: 58 },
  { day: "Sat", count: 35, automated: 30 },
  { day: "Sun", count: 28, automated: 24 },
];

export const hourlyPerformance = [
  { hour: "9 AM", rate: 78 },
  { hour: "12 PM", rate: 84 },
  { hour: "3 PM", rate: 89 },
  { hour: "6 PM", rate: 82 },
  { hour: "9 PM", rate: 88 },
];

// Billing state details
export const billingPlan = {
  currentPlanName: "Pro Tier",
  price: "$49/month",
  billingCycle: "Renews on August 1, 2026",
};

export const usageMeters: UsageMeter[] = [
  { id: "um-1", label: "Active Conversations", value: 1478, max: 2500, unit: "chats" },
  { id: "um-2", label: "Knowledge Sources", value: 6, max: 20, unit: "sources" },
  { id: "um-3", label: "AI Model Fine-tuning", value: 1, max: 3, unit: "runs" }
];

export const invoicesList: Invoice[] = [
  { id: "inv-1", invoiceNumber: "INV-2026-004", amount: "$49.00", date: "Jul 01, 2026", status: "paid" },
  { id: "inv-2", invoiceNumber: "INV-2026-003", amount: "$49.00", date: "Jun 01, 2026", status: "paid" },
  { id: "inv-3", invoiceNumber: "INV-2026-002", amount: "$49.00", date: "May 01, 2026", status: "paid" },
  { id: "inv-4", invoiceNumber: "INV-2026-001", amount: "$19.00", date: "Apr 01, 2026", status: "paid" }
];

// API Keys Mock (for Settings)
export const mockApiKeys = [
  { id: "key-1", name: "Production API Key", prefix: "fb_live_4j93", created: "Jul 01, 2026" },
  { id: "key-2", name: "Development Sandbox", prefix: "fb_test_3h11", created: "Jul 08, 2026" }
];

// FAQ items for Help Page
export const helpFaqs = [
  { q: "How does the AI verify source documents?", a: "FenBot uses RAG (Retrieval-Augmented Generation) technology. It splits your documents into vectors and only references matching chunks to construct responses. It will never make up information that isn't inside your knowledge base." },
  { q: "Can I direct conversations to a human agent?", a: "Yes. From the Chatbots settings, you can define fallback rules. If the AI confidence falls below a threshold, or if the user explicitly asks for a human, the status changes to open and notifications trigger." },
  { q: "How do I install the web widget?", a: "Go to Settings -> Widget, copy the script tag, and paste it before the closing </body> tag of your HTML. We support Shopify, Webflow, WordPress, and Custom React integrations." },
  { q: "Is customer conversation history encrypted?", a: "All conversations are encrypted in transit via TLS 1.3 and at rest using AES-256 keys. We never train public foundation models on your customer data." }
];
