"use client";
import { ProfileDetail } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  userId: string;
  nickname: string;
  content: string;
}
const supabase = createClient();

export default function LiveTalk({ userData }: { userData: ProfileDetail | null }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAutoUpdate, setIsAutoUpdate] = useState(true); // 자동 업데이트 상태
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) {
        const clientMessages = data.map((msg) => ({
          id: msg.id,
          userId: msg.user_id,
          nickname: msg.nickname,
          content: msg.content,
        }));
        setMessages(clientMessages);
      }
      if (error) console.error("Error fetching messages:", error.message);
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    if (isAutoUpdate) {
      channel = supabase
        .channel("realtime-chat")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [isAutoUpdate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !userData) return;

    const { error } = await supabase.from("messages").insert([
      {
        user_id: userData.id,
        nickname: userData.nickname || "Anonymous",
        content: input.trim(),
      },
    ]);
    if (error) console.error("Error sending message:", error.message);
    setInput("");
  };

  const toggleAutoUpdate = () => {
    setIsAutoUpdate((prev) => !prev);
  };

  const messagesList = messages.map((msgObj) => (
    <div key={msgObj.id} className="flex w-full">
      <div className="flex flex-col text-sm w-full">
        <div className="bg-gray-100 text-gray-800 rounded-xl shadow-sm w-full px-4 pt-2 pb-3 break-words space-y-3">
          <div className="text-gray-600 font-semibold mb-1 text-xs">{msgObj.nickname}</div>
          <div>{msgObj.content}</div>
        </div>
      </div>
    </div>
  ));
  

  return (
    <div className="bg-white w-[400px] h-[630px] flex flex-col mt-[50px] border rounded-xl">
      <div className="p-4 pb-2 font-extrabold">응원 오픈톡</div>
      <div className="flex items-center justify-end px-2">
        <span className="text-xs">자동 업데이트</span>
        <button
          onClick={toggleAutoUpdate}
          className={`ml-2 px-3 py-1 text-xs font-semibold rounded ${
            isAutoUpdate ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          {isAutoUpdate ? "ON" : "OFF"}
        </button>
      </div>
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <input
            className="flex-1 py-3 px-4 border rounded-xl focus:outline-none text-sm h-[60px]"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
          />
        </div>
      </div>
      <div ref={chatContainerRef} className="flex-1 p-2 overflow-y-auto">
        <div className="flex flex-col-reverse space-y-4">{messagesList}</div>
      </div>
    </div>
  );
}
