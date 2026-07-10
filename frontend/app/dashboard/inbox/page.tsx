"use client";
import { useState } from "react";
import { Inbox as InboxIcon, Sliders, Send, User, Bot } from "lucide-react";
import { hasData as initialHasData, inboxConversations } from "@/lib/dashboard/mock-data";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InboxPage() {
  const [demoHasData, setDemoHasData] = useState(initialHasData.inbox);
  const [filter, setFilter] = useState<"all" | "open" | "pending" | "resolved">("all");
  const [conversations, setConversations] = useState(inboxConversations);
  const [selectedId, setSelectedId] = useState(inboxConversations[0]?.id || "");
  const [typedMessage, setTypedMessage] = useState("");

  const filtered = conversations.filter(
    (c) => filter === "all" || c.status === filter
  );

  const selectedConv = conversations.find((c) => c.id === selectedId) || filtered[0];

  const handleSendMessage = () => {
    if (!typedMessage.trim() || !selectedConv) return;
    
    const updatedConvs = conversations.map((c) => {
      if (c.id === selectedConv.id) {
        return {
          ...c,
          preview: typedMessage,
          messages: [
            ...c.messages,
            {
              id: `m-new-${Date.now()}`,
              sender: "agent" as const,
              content: typedMessage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setTypedMessage("");
  };

  const getStatusType = (status: string): "online" | "training" | "offline" => {
    if (status === "open") return "online";
    if (status === "pending") return "training";
    return "offline";
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)] overflow-hidden">
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A] shrink-0">
        <div>
          <p className="text-[14px] text-[#8B919D]">Monitor conversations and step in to help when needed.</p>
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
          icon={InboxIcon}
          title="Inbox is clear."
          description="All customer support queries have been automated or resolved. You're completely caught up!"
        />
      ) : (
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
          {/* Left panel: list of chats */}
          <div className="w-[340px] flex flex-col gap-3 shrink-0 min-h-0">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 p-1 bg-[#101113] border border-[#20232A] rounded-xl shrink-0">
              {(["all", "open", "pending", "resolved"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-1 px-2 rounded-lg text-[12px] font-medium capitalize transition-colors cursor-pointer ${
                    filter === f
                      ? "bg-[#252932] text-[#F5F5F5]"
                      : "text-[#8B919D] hover:text-[#F5F5F5]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-[#8B919D] text-[13px] border border-[#20232A] rounded-2xl bg-[#16181D]/20">
                  No conversations match this filter
                </div>
              ) : (
                filtered.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                      selectedConv?.id === conv.id
                        ? "bg-[#252932] border-[#2A2E36]"
                        : "bg-[#16181D] border-[#20232A] hover:bg-[#1D2026]/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[13px] text-[#F5F5F5] truncate">
                        {conv.customerName}
                      </span>
                      <span className="text-[10px] text-[#8B919D] font-mono shrink-0">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#8B919D] truncate mt-1 leading-normal">
                      {conv.preview}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[11px] text-[#8B919D] font-mono leading-none truncate max-w-[140px]">
                        {conv.email}
                      </span>
                      <StatusBadge
                        status={getStatusType(conv.status)}
                        label={conv.status}
                        className="text-[9px] py-0 px-1.5"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel: Active conversation details */}
          <div className="flex-1 flex flex-col border border-[#20232A] rounded-2xl bg-[#101113] min-h-0 overflow-hidden">
            {selectedConv ? (
              <>
                {/* Chat header */}
                <div className="px-6 h-14 border-b border-[#20232A] flex items-center justify-between bg-[#16181D] shrink-0">
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#F5F5F5] truncate">
                      {selectedConv.customerName}
                    </h3>
                    <p className="text-[11px] text-[#8B919D] mt-0.5 truncate">{selectedConv.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={getStatusType(selectedConv.status)} label={selectedConv.status} />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const updated = conversations.map((c) => {
                          if (c.id === selectedConv.id) {
                            return { ...c, status: c.status === "resolved" ? ("open" as const) : ("resolved" as const) };
                          }
                          return c;
                        });
                        setConversations(updated);
                      }}
                      className="bg-[#252932] border border-[#2A2E36] hover:bg-[#1D2026] text-[#F5F5F5] rounded-xl h-8 text-[12px] px-3 cursor-pointer"
                    >
                      {selectedConv.status === "resolved" ? "Reopen" : "Resolve"}
                    </Button>
                  </div>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                  {selectedConv.messages.map((msg) => {
                    const isAgent = msg.sender === "agent";
                    const isAI = msg.sender === "ai";
                    const senderLabel = isAgent ? "You" : isAI ? "AI Agent" : "Customer";
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[80%] ${isAgent ? "ml-auto flex-row-reverse" : isAI ? "mx-auto flex-row-reverse" : "mr-auto"}`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-[10px] ${
                            isAgent
                              ? "bg-[#252932] border-[#2A2E36] text-[#F5F5F5]"
                              : isAI
                              ? "bg-[#E8281E]/10 border-[#E8281E]/20 text-[#E8281E]"
                              : "bg-[#20232A] border-[#2A2E36] text-[#B4BAC5]"
                          }`}
                        >
                          {isAgent ? "ME" : isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        </div>

                        {/* Content */}
                        <div>
                          <div
                            className={`p-3.5 rounded-2xl text-[13px] leading-relaxed border ${
                              isAgent
                                ? "bg-[#E8281E] text-white border-transparent rounded-tr-none"
                                : isAI
                                ? "bg-[#252932] text-[#F5F5F5] border-[#2A2E36] rounded-tr-none"
                                : "bg-[#1D2026] text-[#F5F5F5] border-[#20232A] rounded-tl-none"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div className={`text-[10px] text-[#8B919D] mt-1 px-1 font-mono ${isAgent ? "text-right" : isAI ? "text-center" : "text-left"}`}>
                            {senderLabel} • {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input form */}
                <div className="p-4 border-t border-[#20232A] bg-[#16181D] flex gap-2 shrink-0">
                  <Input
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={`Reply to ${selectedConv.customerName}...`}
                    className="flex-1 bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] placeholder-[#8B919D] focus:ring-1 focus:ring-[#E8281E] focus:border-[#E8281E] focus:outline-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!typedMessage.trim()}
                    className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-10 w-10 p-0 flex items-center justify-center shrink-0 transition-colors cursor-pointer border-none"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#8B919D] text-[13px] p-6 text-center">
                Select a conversation from the list to view history and compose replies
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
