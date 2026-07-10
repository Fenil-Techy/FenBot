import {
  LayoutDashboard,
  Bot,
  Inbox,
  BookOpen,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  LucideIcon
} from "lucide-react";

export interface NavItemConfig {
  href: string;
  label: string;
  icon: LucideIcon;
  group: "main" | "secondary";
}

export const navItems: NavItemConfig[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    group: "main",
  },
  {
    href: "/dashboard/chatbots",
    label: "Chatbots",
    icon: Bot,
    group: "main",
  },
  {
    href: "/dashboard/inbox",
    label: "Inbox",
    icon: Inbox,
    group: "main",
  },
  {
    href: "/dashboard/knowledge",
    label: "Knowledge",
    icon: BookOpen,
    group: "main",
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart3,
    group: "main",
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
    group: "secondary",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    group: "secondary",
  },
  {
    href: "/dashboard/help",
    label: "Help",
    icon: HelpCircle,
    group: "secondary",
  },
];
