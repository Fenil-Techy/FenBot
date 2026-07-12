"use client";
import { useEffect, useState, useCallback } from "react";
import { Inbox as InboxIcon, Bot, User, Loader2, WifiOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { Button } from "@/components/ui/button";

type Conversation = {
  id: string;
  bot_name: string;
  visitor_id: string;
  last_message: string;
  last_message_at: string;
  message_count: number;
};

type Message = {
  role: string;
  content: string;
  created_at: string;
};

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/dashboard/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await res.json();
      setConversations(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (e) {
      console.error(e);
      setError("unreachable");
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedId]);

  const loadThread = useCallback(async (id: string) => {
    setSelectedId(id);
    setLoadingThread(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) return;

      const res = await fetch(`http://localhost:8000/dashboard/conversations/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingThread(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadThread(selectedId);
    }
  }, [selectedId, loadThread]);

  const selectedConv = conversations.find((c) => c.id === selectedId);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString();
    } catch {
      return "";
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 text-[#E8281E] animate-spin" />
        <p className="text-[14px] text-[#8B919D]">Loading conversations...</p>
      </div>
    );
  }

  if (error === "unreachable") {
    return (
      <div
        style={{ width: "100%", maxWidth: "32rem" }}
        className="flex flex-col items-center justify-center text-center py-16 px-6 border border-[#EF4444]/20 rounded-2xl bg-[#EF4444]/5 mx-auto my-8 text-[#F5F5F5]"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#EF4444]/10 text-[#EF4444] mb-4">
          <WifiOff className="w-6 h-6" />
        </div>
        <h3 className="text-[16px] font-semibold text-[#F5F5F5] mb-1">Server Unreachable</h3>
        <p className="text-[14px] text-[#8B919D] max-w-sm mb-6">
          Failed to fetch inbox data from the server at <code className="text-[#F5F5F5] bg-[#16181D] px-1.5 py-0.5 rounded font-mono text-xs">http://localhost:8000</code>.
        </p>
        <Button
          onClick={loadConversations}
          className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl px-5 h-10 text-[14px] font-medium border-none cursor-pointer"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)] overflow-hidden">
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A] shrink-0">
        <div>
          <p className="text-[14px] text-[#8B919D]">Monitor conversations and step in to help when needed.</p>
        </div>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={InboxIcon}
          title="Inbox is clear."
          description="All customer support queries have been automated or resolved. You're completely caught up!"
        />
      ) : (
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
          {/* Left panel: list of chats */}
          <div className="w-[340px] flex flex-col gap-3 shrink-0 min-h-0">
            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                    selectedId === conv.id
                      ? "bg-[#252932] border-[#2A2E36]"
                      : "bg-[#16181D] border-[#20232A] hover:bg-[#1D2026]/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[13px] text-[#F5F5F5] truncate">
                      Visitor {conv.visitor_id.slice(0, 8)}
                    </span>
                    <span className="text-[10px] text-[#8B919D] font-mono shrink-0">
                      {formatTime(conv.last_message_at)}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#8B919D] truncate mt-1 leading-normal">
                    {conv.last_message || "No messages yet"}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[11px] text-[#8B919D] font-mono leading-none truncate max-w-[180px]">
                      Bot: {conv.bot_name}
                    </span>
                    {conv.message_count > 0 && (
                      <span className="bg-[#2A2E36] text-[#F5F5F5] text-[10px] px-2 py-0.5 rounded-full font-mono font-medium">
                        {conv.message_count} msgs
                      </span>
                    )}
                  </div>
                </div>
              ))}
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
                      Visitor {selectedConv.visitor_id.slice(0, 8)}
                    </h3>
                    <p className="text-[11px] text-[#8B919D] mt-0.5 truncate">
                      Active on bot: {selectedConv.bot_name}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#8B919D] font-mono bg-[#1D2026] px-2.5 py-1 rounded-lg border border-[#20232A]">
                    Started {formatDate(selectedConv.last_message_at)}
                  </span>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                  {loadingThread ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 gap-2">
                      <Loader2 className="w-6 h-6 text-[#E8281E] animate-spin" />
                      <p className="text-[12px] text-[#8B919D]">Loading transcript...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[#8B919D] text-[13px]">
                      No messages in this conversation.
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isUser = msg.role === "user";
                      const isAI = msg.role === "assistant" || msg.role === "ai";
                      const senderLabel = isUser ? "Visitor" : isAI ? "AI Agent" : "System";
                      return (
                        <div
                          key={idx}
                          className={`flex gap-3 max-w-[80%] ${
                            isUser ? "mr-auto" : isAI ? "ml-auto flex-row-reverse" : "mx-auto"
                          }`}
                        >
                          {/* Icon */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-[10px] ${
                              isUser
                                ? "bg-[#20232A] border-[#2A2E36] text-[#B4BAC5]"
                                : isAI
                                ? "bg-[#E8281E]/10 border-[#E8281E]/20 text-[#E8281E]"
                                : "bg-[#252932] border-[#2A2E36] text-[#F5F5F5]"
                            }`}
                          >
                            {isUser ? <User className="w-3.5 h-3.5" /> : isAI ? <Bot className="w-3.5 h-3.5" /> : "SYS"}
                          </div>

                          {/* Content */}
                          <div>
                            <div
                              className={`p-3.5 rounded-2xl text-[13px] leading-relaxed border ${
                                isUser
                                  ? "bg-[#1D2026] text-[#F5F5F5] border-[#20232A] rounded-tl-none"
                                  : isAI
                                  ? "bg-[#252932] text-[#F5F5F5] border-[#2A2E36] rounded-tr-none"
                                  : "bg-[#E8281E] text-white border-transparent"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <div
                              className={`text-[10px] text-[#8B919D] mt-1 px-1 font-mono ${
                                isUser ? "text-left" : isAI ? "text-right" : "text-center"
                              }`}
                            >
                              {senderLabel} • {formatTime(msg.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer read-only banner */}
                <div className="p-4 border-t border-[#20232A] bg-[#16181D] text-center text-[12px] text-[#8B919D] flex items-center justify-center gap-2 shrink-0">
                  <Bot className="w-4 h-4 text-[#E8281E]" />
                  <span>This conversation is handled by the AI Agent. Transcripts are read-only.</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#8B919D] text-[13px] p-6 text-center">
                Select a conversation from the list to view history and transcripts.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
