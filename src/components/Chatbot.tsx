import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Volume2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = geminiService.createChat();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      setMessages((prev) => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { role: 'model', text: "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioUrl = await geminiService.textToSpeech(text);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      }
    } catch (error) {
      console.error("Error in TTS:", error);
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-[60] border-4 border-surface active:scale-90 transition-transform"
      >
        <MessageSquare className="w-8 h-8 fill-current" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full border-2 border-surface animate-bounce" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-32 sm:right-6 sm:w-[400px] sm:h-[600px] bg-surface z-[70] flex flex-col shadow-2xl sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            {/* Header */}
            <div className="bg-primary p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight">ÁO Conecta AI</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Asistente Virtual</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <Bot className="w-16 h-16 text-primary" />
                  <p className="text-sm font-bold text-on-surface-variant max-w-[200px]">
                    ¡Hola! Soy tu asistente de Álvaro Obregón. ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-secondary text-white" : "bg-primary text-white"
                  )}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm shadow-sm relative group",
                    msg.role === 'user' ? "bg-secondary text-white rounded-tr-none" : "bg-surface text-on-surface rounded-tl-none border border-gray-100 dark:border-gray-800"
                  )}>
                    <div className="prose prose-sm max-w-none text-on-surface">
                      <ReactMarkdown>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                    {msg.role === 'model' && (
                      <button 
                        onClick={() => handleSpeak(msg.text)}
                        className="absolute -bottom-6 right-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Volume2 className="w-3 h-3" /> Escuchar
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-surface p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800 shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-surface border-t border-gray-100 dark:border-gray-800">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="w-full h-14 pl-4 pr-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
