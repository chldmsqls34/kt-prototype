"use client";
import { ProfileDetail } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  userId: string;
  nickname: string;
  content: string;
}
const supabase = createClient();

export default function LiveTalk({userData}:{userData:ProfileDetail|null}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const userId = userData?.id;
  const nickname = userData?.nickname;

  useEffect(() => {

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
      if (data) {
        const clientMessages = data.map((msg) => ({
          id: msg.id,
          userId: msg.user_id,
          nickname: msg.nickname,
          content: msg.content,
        }));
        setMessages(clientMessages)
      };
      if (error) console.error('Error fetching messages:', error.message);
    };

    fetchMessages();

    const channel = supabase
      .channel('realtime-chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  

  const handleSendMessage = async () => {
    if (!input.trim() || !userId) return;
    const { error } = await supabase.from('messages').insert([
      {
        user_id: userId,
        nickname: nickname || 'Anonymous',
        content: input.trim(),
      },
    ]);
    if (error) console.error('Error sending message:', error.message);
    setInput('');

  };
  

  

  const messagesList = messages.map((msgObj) => (
    <div
      key={msgObj.id}
      className={`flex ${msgObj.userId === userId ? "justify-end" : "justify-start"}`}
    >
      <div className="flex flex-col text-xs max-w-xs">
        <div className={`font-semibold mb-1 ${msgObj.userId === userId ? "text-right" : "text-left"}`}>
          {msgObj.nickname}
        </div>
        <div
          className={`px-4 py-2 rounded-lg text-sm ${
            msgObj.userId === userId
              ? "bg-gray-500 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {msgObj.content}
        </div>
      </div>
    </div>
  ));
  
  return (
    <div className="bg-white w-[400px] h-[500px] flex flex-col relative border rounded-lg shadow-lg">
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="flex flex-col space-y-4">{messagesList}</div>
      </div>

      <div className="p-2 bg-gray-100 border-t">
        <div className="flex items-center space-x-2">
          <input
            className="flex-1 py-2 px-2 border rounded-lg focus:outline-none text-sm"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="여기에 메시지를 입력하세요..."
            onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
            autoComplete="off"
          />
          <button
            className="p-2 bg-gray-500 text-white rounded w-8 h-8 flex items-center justify-center"
            onClick={handleSendMessage}
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}