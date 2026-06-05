"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

export default function GlobalChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  // Fetch initial 50 messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("global_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50);
      if (data) {
        setMessages(data);
      }
    };
    fetchMessages();
  }, [supabase]);

  // Subscribe to real-time inserts
  useEffect(() => {
    const channel = supabase
      .channel("global_chat_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "global_messages" },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg].slice(-50);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;
    setSending(true);

    try {
      // Get the profile display name
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single();

      const displayName =
        profile?.display_name ||
        profile?.username ||
        user.user_metadata?.username ||
        "Player";

      const { error } = await supabase.from("global_messages").insert({
        user_id: user.id,
        username: displayName,
        content: newMessage.trim(),
      });

      if (error) {
        console.error("Error sending message:", error);
      } else {
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error during send:", err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl flex flex-col overflow-hidden shadow-elevated">
      {/* Header */}
      <div className="p-4 border-b border-[#2a2a30] flex items-center justify-between bg-[#18181b]">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <span className="font-bold text-white text-sm">Global Chat</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#81b64c]/10 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#81b64c] animate-pulse"></span>
          <span className="text-[10px] font-semibold text-[#81b64c] uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto h-[280px] space-y-3 scrollbar-thin scrollbar-thumb-[#2a2a30]">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#6b6b75] text-xs text-center p-4">
            No messages yet. Say hello in the chat!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="text-sm flex flex-col">
              <div className="flex items-baseline gap-1.5 mb-0.5">
                <span className="font-semibold text-[#81b64c] text-xs">
                  {msg.username}
                </span>
                <span className="text-[9px] text-[#4a4a55]">
                  {formatTime(msg.created_at)}
                </span>
              </div>
              <p className="text-[#e2e2e9] text-xs leading-relaxed break-words bg-[#0a0a0b]/40 rounded-lg p-2 border border-[#1e1e21]/40">
                {msg.content}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-[#2a2a30] bg-[#0d0d0e]">
        {user ? (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message..."
              maxLength={200}
              className="flex-1 bg-[#0a0a0b] border border-[#2a2a30] text-white text-xs rounded-xl focus:ring-[#81b64c] focus:border-[#81b64c] p-2 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="bg-[#81b64c] hover:bg-[#9fcc6b] disabled:bg-[#1f1f23] disabled:text-[#4a4a55] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0"
            >
              {sending ? "..." : "Send"}
            </button>
          </form>
        ) : (
          <div className="text-center py-1.5">
            <p className="text-[#6b6b75] text-xs mb-2">Login to join the conversation.</p>
            <a
              href="/login"
              className="inline-block bg-[#2a2a30] hover:bg-[#3a3a42] text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition-all"
            >
              Log In
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
