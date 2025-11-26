import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, MessageSquare, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface ChatAssistantProps {
  chatSession: React.MutableRefObject<Chat | null>;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ chatSession }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession.current) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsSending(true);

    try {
      const response: GenerateContentResponse = await chatSession.current.sendMessage({
          message: userMsg
      });
      const text = response.text || "I'm having trouble connecting to headquarters.";

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Connection disrupted. Please try again." }]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 z-50 flex items-center gap-2 font-bold"
      >
        <Sparkles size={20} />
        <span className="hidden md:inline">Ask Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col h-[600px] animate-fade-in-up">
      {/* Header */}
      <div className="bg-indigo-600 p-4 rounded-t-2xl flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
                <MessageSquare size={18} />
            </div>
            <span className="font-bold">AI 教学顾问</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 p-1 rounded transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10 text-sm px-6">
            <p>我是您的专属 AI 教学顾问。</p>
            <p className="mt-2">关于如何给书灵讲解，或者需要更多生活化的例子，随时问我。</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.role === 'user' ? (
                 msg.text
              ) : (
                <div className="prose prose-sm prose-indigo max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isSending && (
           <div className="flex justify-start">
             <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                <Loader2 size={16} className="animate-spin text-indigo-500" />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入问题 (例如: 给我举个关于小猫的例子)"
            disabled={isSending}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-2 rounded-xl transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};