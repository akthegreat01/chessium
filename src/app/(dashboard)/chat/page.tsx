"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import AdSlot from "@/components/ui/AdSlot";
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
  const [activeChannel, setActiveChannel] = useState("general");
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
        user.email?.split("@")[0] ||
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

  const activeChannelData = CHANNELS.find((c) => c.id === activeChannel) || CHANNELS[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Community Forums</h1>
        <p className="text-[#a0a0a8] text-sm mt-1">Connect, share theory, and banter with chess players worldwide in real-time.</p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar - Channels */}
        <div className="lg:col-span-3 bg-[#141416] border border-[#2a2a30] rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-[#6b6b75] uppercase tracking-wider px-2">Forum Categories</h2>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
            {CHANNELS.map((channel) => {
              const isActive = activeChannel === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0 lg:shrink text-left w-auto lg:w-full ${
                    isActive
                      ? "bg-[#1a1a1f] text-white border-l-2 border-[#81b64c] shadow-[inset_4px_0_0_rgba(129,182,76,0.1)]"
                      : "text-[#8a8a93] hover:bg-[#141416] hover:text-[#d0d0d5]"
                  }`}
                >
                  <span className="text-base">{channel.icon}</span>
                  <span>#{channel.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Panel - Live Chat Window */}
        <div className="lg:col-span-6 bg-[#141416] border border-[#2a2a30] rounded-2xl flex flex-col overflow-hidden shadow-elevated h-[600px]">
          {/* Active Channel Header */}
          <div className="p-4 border-b border-[#2a2a30] flex items-center justify-between bg-[#18181b]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeChannelData.icon}</span>
                <span className="font-bold text-white text-base">#{activeChannelData.name}</span>
              </div>
              <span className="text-[11px] text-[#8a8a93] mt-0.5">{activeChannelData.description}</span>
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
                No messages in #{activeChannelData.name} yet. Be the first to start the discussion!
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
                  placeholder={`Post to #${activeChannelData.name}...`}
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
                <p className="text-[#6b6b75] text-xs mb-3">Join the Chessium community to write in the forum.</p>
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

        {/* Right Sidebar - Ad Space & Mock Promos */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-4">
            <h2 className="text-[10px] font-bold text-[#6b6b75] uppercase tracking-wider mb-3">SPONSOR ZONE</h2>
            <AdSlot slot="forum-sidebar-top" format="rectangle" className="w-full" />
          </div>

          {/* Premium Mock promos to look absolutely venture-backed / rich */}
          <div className="bg-gradient-to-br from-[#1a1a24] to-[#121216] border border-[#ca3431]/20 rounded-2xl p-4 space-y-3 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ca3431]/5 rounded-full blur-xl pointer-events-none group-hover:bg-[#ca3431]/10 transition-colors"></div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#ca3431] uppercase tracking-wider">
              <span>💎</span>
              <span>Chessium Premium</span>
            </div>
            <h3 className="text-sm font-bold text-white">Full Engine Reviews</h3>
            <p className="text-xs text-[#a0a0a8] leading-relaxed">
              Get detailed analysis accuracy, move-by-move classifications (Blunder, Mistake, Brilliant), and run unlimited lines using stockfish.
            </p>
            <button className="w-full bg-[#ca3431] hover:bg-[#d63f3c] text-white text-xs font-bold py-2 rounded-xl transition-colors">
              Upgrade Now
            </button>
          </div>

          <div className="bg-gradient-to-br from-[#181d18] to-[#111411] border border-[#81b64c]/20 rounded-2xl p-4 space-y-3 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#81b64c]/5 rounded-full blur-xl pointer-events-none group-hover:bg-[#81b64c]/10 transition-colors"></div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#81b64c] uppercase tracking-wider">
              <span>🧩</span>
              <span>Daily Challenge</span>
            </div>
            <h3 className="text-sm font-bold text-white">Solve Today's Puzzle</h3>
            <p className="text-xs text-[#a0a0a8] leading-relaxed">
              Test your calculation skills with our daily selected puzzle. Earn ranking points and climb the community leaderboards!
            </p>
            <a href="/puzzles" className="block text-center w-full bg-[#81b64c] hover:bg-[#9fcc6b] text-white text-xs font-bold py-2 rounded-xl transition-colors">
              Play Puzzle
            </a>
          </div>

          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-4">
            <h2 className="text-[10px] font-bold text-[#6b6b75] uppercase tracking-wider mb-3">SPONSOR ZONE</h2>
            <AdSlot slot="forum-sidebar-bottom" format="rectangle" className="w-full" />
          </div>
        </div>

      </div>
    </div>
  );
}
