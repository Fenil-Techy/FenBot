"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DashboardShell } from "@/components/dashboard/shell/DashboardShell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/auth/login");
      } else {
        setChecked(true);
      }
    });
  }, [router, supabase.auth]);

  if (!checked) return null; // avoid flashing dashboard before auth check resolves

  return (
    <div className="min-h-screen bg-[#0B0B0C]">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
