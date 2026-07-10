"use client";
import { useState } from "react";
import { CreditCard, Sliders, ArrowUpRight, Check, Download, AlertCircle } from "lucide-react";
import { hasData as initialHasData, billingPlan, usageMeters, invoicesList } from "@/lib/dashboard/mock-data";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  const [demoHasData, setDemoHasData] = useState(initialHasData.billing);

  return (
    <div className="flex flex-col gap-6">
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A] shrink-0">
        <div>
          <p className="text-[14px] text-[#8B919D]">Manage your subscription plan, usage limits, and invoices.</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setDemoHasData(!demoHasData)}
          className="text-[12px] h-8 text-[#8B919D] hover:text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl flex items-center gap-1.5 px-3 border border-[#2A2E36] cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>State: {demoHasData ? "Populated" : "Empty"}</span>
        </Button>
      </div>

      {!demoHasData ? (
        <EmptyState
          icon={CreditCard}
          title="No billing history."
          description="You are currently on the Free Trial. Upgrading to a premium tier will unlock advanced features and billing logs."
          actionLabel="Upgrade Plan"
          onAction={() => alert("Redirecting to Checkout...")}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan details and usage meters */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Current Plan */}
            <DashboardCard className="relative overflow-hidden bg-gradient-to-br from-[#16181D] to-[#101113]">
              <div className="space-y-1 z-10 relative">
                <span className="text-[11px] font-bold text-[#E8281E] uppercase tracking-wider">
                  Active Subscription
                </span>
                <h3 className="text-[20px] font-bold text-[#F5F5F5]">{billingPlan.currentPlanName}</h3>
                <p className="text-[24px] font-bold text-[#F5F5F5] mt-2">
                  {billingPlan.price}
                  <span className="text-[12px] font-normal text-[#8B919D]"> / month</span>
                </p>
                <p className="text-[12px] text-[#8B919D] pt-1">
                  {billingPlan.billingCycle}
                </p>
              </div>

              <div className="mt-6 flex gap-2 z-10 relative">
                <Button
                  onClick={() => alert("Opening plan upgrade panel...")}
                  className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl h-9 text-[13px] font-medium px-4 cursor-pointer border-none flex items-center gap-1"
                >
                  <span>Change Plan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => alert("Cancelling subscription modal...")}
                  className="bg-transparent border border-[#2A2E36] text-[#8B919D] hover:text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl h-9 text-[13px] font-medium px-4 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>

              {/* Vercel styled glow */}
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#E8281E]/10 rounded-full blur-2xl pointer-events-none" />
            </DashboardCard>

            {/* Usage limits */}
            <DashboardCard className="space-y-4">
              <h3 className="text-card-title text-[#F5F5F5] pb-2 border-b border-[#24262D]">
                Usage This Period
              </h3>
              <div className="space-y-4">
                {usageMeters.map((meter) => {
                  const pct = Math.min((meter.value / meter.max) * 100, 100);
                  const isCloseToLimit = pct >= 80;

                  return (
                    <div key={meter.id} className="space-y-1">
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="font-semibold text-[#B4BAC5]">{meter.label}</span>
                        <span className="text-[#8B919D]">
                          <strong className="text-[#F5F5F5]">{meter.value}</strong> / {meter.max} {meter.unit}
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-[#1D2026] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCloseToLimit ? "bg-[#EF4444]" : "bg-[#E8281E]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {isCloseToLimit && (
                        <div className="flex items-center gap-1 text-[10px] text-[#EF4444] pt-0.5">
                          <AlertCircle className="w-3 h-3" />
                          <span>Close to period limits</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </DashboardCard>
          </div>

          {/* Invoice List */}
          <div className="lg:col-span-2">
            <DashboardCard className="space-y-4 h-full flex flex-col">
              <h3 className="text-card-title text-[#F5F5F5] pb-2 border-b border-[#24262D]">
                Invoices History
              </h3>

              <div className="flex-1 overflow-x-auto min-w-0">
                <table className="w-full text-[13px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#20232A] text-[#8B919D] text-left">
                      <th className="py-2.5 font-medium">Invoice Number</th>
                      <th className="py-2.5 font-medium">Date</th>
                      <th className="py-2.5 font-medium">Amount</th>
                      <th className="py-2.5 font-medium">Status</th>
                      <th className="py-2.5 font-medium text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#20232A]">
                    {invoicesList.map((inv) => (
                      <tr key={inv.id} className="text-[#B4BAC5] hover:text-[#F5F5F5]">
                        <td className="py-3.5 font-mono text-[#F5F5F5]">{inv.invoiceNumber}</td>
                        <td className="py-3.5">{inv.date}</td>
                        <td className="py-3.5 font-semibold text-[#F5F5F5]">{inv.amount}</td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#22C55E]/10 text-[#22C55E] leading-none border border-[#22C55E]/20">
                            <Check className="w-3 h-3 text-[#22C55E]" />
                            <span>Paid</span>
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => alert(`Downloading ${inv.invoiceNumber}...`)}
                            className="w-8 h-8 text-[#8B919D] hover:text-[#F5F5F5] hover:bg-[#1D2026] rounded-lg cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
          </div>
        </div>
      )}
    </div>
  );
}
