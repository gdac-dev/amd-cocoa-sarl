"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

export function FloatingWidgets() {
  const { t } = useTranslation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: "user" | "bot", text: string}[]>([
    { role: "bot", text: t("chatbot.welcome") }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen, isThinking]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const userMsg = inputValue.trim();
    const newMessages = [...messages, { role: "user" as const, text: userMsg }];
    setMessages(newMessages);
    setInputValue("");
    setIsThinking(true);

    try {
      // Send to AI API with conversation history (last 10 messages for context)
      const historyForAPI = newMessages.slice(-10).map(m => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: historyForAPI.slice(0, -1), // exclude the current message from history
        }),
      });

      const data = await res.json();

      if (data.response) {
        setMessages(prev => [...prev, { role: "bot", text: data.response }]);
      } else if (data.fallback) {
        // AI service unavailable — log the query and show fallback
        setMessages(prev => [...prev, { role: "bot", text: t("chatbot.fallback") }]);
        
        // Log unanswered query to database
        try {
          await fetch("/api/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: userMsg }),
          });
        } catch { /* silent */ }
      } else {
        setMessages(prev => [...prev, { role: "bot", text: t("chatbot.fallback") }]);
      }
    } catch {
      // Network error — complete fallback
      setMessages(prev => [...prev, { role: "bot", text: t("chatbot.fallback") }]);
      
      // Log the query for support review
      try {
        await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: userMsg }),
        });
      } catch { /* silent */ }
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end space-y-4">
      {/* Bot Window */}
      {isChatOpen && (
        <div className="w-80 h-[400px] bg-white rounded-xl shadow-2xl border border-cocoa-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary text-beige px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">{t("chatbot.assistant_name")}</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-cocoa-200 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-beige space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === "user" ? "bg-accent text-primary rounded-br-none" : "bg-white border border-cocoa-100 text-primary rounded-bl-none shadow-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-white border border-cocoa-100 text-cocoa-400 rounded-bl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {t("chatbot.thinking")}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-cocoa-100 p-3 bg-white flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("chatbot.placeholder")}
              disabled={isThinking}
              className="flex-1 px-3 py-2 text-sm border border-cocoa-200 rounded-md focus:outline-none focus:border-accent text-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isThinking}
              className="p-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Buttons Layout */}
      <div className="flex flex-col space-y-3">
        {/* Chatbot Button */}
        <button
          onClick={() => setIsChatOpen((prev) => !prev)}
          className={`p-4 rounded-full shadow-xl transition-transform hover:scale-110 flex items-center justify-center
            ${isChatOpen ? 'bg-cocoa-500 text-white' : 'bg-primary text-white'}`}
          aria-label="Toggle Chatbot"
        >
          {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>

        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/237653522435?text=Hello%20AMD%20Cocoa,%20I%20have%20an%20inquiry." 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-xl transition-transform hover:scale-110 flex items-center justify-center"
          aria-label="Contact us on WhatsApp"
        >
          {/* WhatsApp icon using plain SVG path to avoid heavy imports */}
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
