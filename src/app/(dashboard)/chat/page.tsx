"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "motion/react";

interface Message {
  id: string;
  user_id: string;
  username: string;
  content: string;
  channel: string;
  created_at: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const CHANNELS: Channel[] = [
  { id: "general", name: "general", description: "General chess discussion, banter, and platform news.", icon: "💬" },
  { id: "openings", name: "openings", description: "Discuss chess openings theory, novelties, and preparation.", icon: "🛡️" },
  { id: "tactics", name: "tactics", description: "Share puzzles, tactics, combinations, and interesting positions.", icon: "🧩" },
  { id: "tournaments", name: "tournaments", description: "Live professional events, chess tournaments, and standings.", icon: "🏆" },
  { id: "memes", name: "memes", description: "Chess memes, jokes, and funny checkmates.", icon: "🎭" }
];

export default function ChatPage() {
  const activeChannel = "general";
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  // Fetch messages for active channel
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("global_messages")
        .select("*")
        .eq("channel", activeChannel)
        .order("created_at", { ascending: true })
        .limit(50);
      if (data) {
        setMessages(data);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [supabase, activeChannel]);

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel("global_forum_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "global_messages" },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.channel === activeChannel) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg].slice(-50);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, activeChannel]);

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
        channel: activeChannel
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Chat</h1>
        <p className="text-[#a0a0a8] text-sm mt-1">Connect and talk with chess players worldwide in real-time.</p>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto">
        
        {/* Center Panel - Live Chat Window */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl flex flex-col overflow-hidden shadow-elevated h-[600px]">
          {/* Active Channel Header */}
          <div className="p-4 border-b border-[#2a2a30] flex items-center justify-between bg-[#18181b]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <span className="font-bold text-white text-base">#general</span>
              </div>
              <span className="text-[11px] text-[#8a8a93] mt-0.5">General chess discussion, banter, and platform news.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#81b64c]/10 px-2 py-0.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#81b64c] animate-pulse"></span>
              <span className="text-[10px] font-semibold text-[#81b64c] uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#2a2a30]">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-[#6b6b75] text-xs">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#81b64c] mb-2"></span>
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#6b6b75] text-sm text-center p-4">
                No messages yet. Be the first to start the conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="text-sm flex flex-col">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-[#81b64c] text-xs">
                      {msg.username}
                    </span>
                    <span className="text-[9px] text-[#4a4a55]">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-[#e2e2e9] text-xs leading-relaxed break-words bg-[#0a0a0b]/40 rounded-xl p-3 border border-[#1e1e21]/40">
                    {msg.content}
                  </p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#2a2a30] bg-[#0d0d0e]">
            {user ? (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Post to #general..."
                  maxLength={200}
                  className="flex-1 bg-[#0a0a0b] border border-[#2a2a30] text-white text-xs rounded-xl focus:ring-[#81b64c] focus:border-[#81b64c] p-3 outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="bg-[#81b64c] hover:bg-[#9fcc6b] disabled:bg-[#1f1f23] disabled:text-[#4a4a55] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                >
                  {sending ? "..." : "Send"}
                </button>
              </form>
            ) : (
              <div className="text-center py-2">
                <p className="text-[#6b6b75] text-xs mb-3">Join the Chessium community to write in the chat.</p>
                <a
                  href="/login"
                  className="inline-block bg-[#2a2a30] hover:bg-[#3a3a42] text-white text-xs font-semibold px-5 py-2 rounded-xl transition-all"
                >
                  Log In / Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
