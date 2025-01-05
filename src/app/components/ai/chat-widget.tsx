"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface MemoryStatus {
  cleared: boolean;
  warning?: string;
  remainingCapacity: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [memoryWarning, setMemoryWarning] = useState<string | undefined>();

  // Add ref for chat container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add useEffect to scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add useEffect for keyboard events
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleEscKey);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]); // Only re-run if isOpen changes

  // Add initial greeting when chat opens
  useEffect(() => {
    if (isOpen) {
      const greetings = [
        "\nReady to help you brew up some success!",
        "\nWhat can I help you with today?",
        "\nLet's make something great together!",
        "\nHow can I make your day better?",
      ];

      const timeOfDay = new Date().getHours();
      let greeting = "Hello";

      if (timeOfDay < 12) greeting = "Good morning";
      else if (timeOfDay < 18) greeting = "Good afternoon";
      else greeting = "Good evening";

      const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];

      setMessages([
        {
          role: "assistant",
          content: `${greeting}! ☕\n${randomGreeting}`,
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Immediately add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await fetch("/api/ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle memory status
      if (data.memoryStatus) {
        if (data.memoryStatus.cleared) {
          // Clear messages if memory was cleared
          setMessages([
            {
              role: "assistant",
              content:
                "Previous conversation context has been cleared due to memory limits.",
            },
          ]);
        }

        if (data.memoryStatus.warning) {
          setMemoryWarning(data.memoryStatus.warning);
          // Clear warning after 5 seconds
          setTimeout(() => setMemoryWarning(undefined), 5000);
        }
      }

      // Update to only add AI message since user message is already added
      setMessages((prev) => [
        ...(data.memoryStatus?.cleared ? [] : prev),
        {
          role: "assistant",
          content: data.response || "Sorry, I couldn't process that request.",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 inset-x-0 flex justify-center z-50">
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-[#8B4513] p-4 text-white shadow-lg 
            hover:bg-[#A0522D] transition-all duration-200 flex items-center gap-2"
          aria-label="Open HomeBrew Assistant"
        >
          {/* Animated Robot Icon */}
          <motion.div
            animate={{
              y: [0, -4, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* Robot Face */}
            <div className="relative w-8 h-8 bg-white rounded-lg">
              {/* Eyes */}
              <motion.div
                animate={{
                  scaleY: [1, 0.1, 1],
                  transition: {
                    repeat: Infinity,
                    repeatDelay: 3,
                    duration: 0.1,
                  },
                }}
                className="absolute top-2 left-0 right-0 flex justify-around"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#8B4513]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#8B4513]" />
              </motion.div>
              {/* Mouth */}
              <div className="absolute bottom-2 left-1.5 right-1.5 h-1.5 bg-[#8B4513] rounded-full" />
            </div>
            {/* Antenna */}
            <motion.div
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 left-1/2 w-1 h-3 bg-white rounded-full origin-bottom"
            />
          </motion.div>
          <span className="text-base font-bold tracking-wide">
            Ask HomeBrew
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative w-full max-w-2xl h-[80vh] mx-4 bg-white rounded-xl shadow-2xl border border-[#DEB887]/20"
        >
          {/* Decorative coffee stain behind chat */}
          <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8B4513]/5 rounded-full blur-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#DEB887]/20 p-6 bg-white/80 backdrop-blur-sm rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Coffee className="h-6 w-6 text-[#8B4513]" />
                <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B4513]">
                HomeBrew Assistant
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-[#8B4513] hover:bg-[#8B4513]/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Container with gradient background */}
          <div className="h-[calc(80vh-8rem)] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#FDF6EC] to-white">
            {messages.map((message, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.role === "user"
                      ? "bg-[#B07B4C] text-white"
                      : "bg-white border border-[#DEB887]/20"
                  }`}
                >
                  <ReactMarkdown
                    className="prose prose-brown dark:prose-invert"
                    components={{
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold mb-2">
                          {children}
                        </h3>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-4 space-y-1">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-base">{children}</li>
                      ),
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      code: ({ children }) => (
                        <code className="bg-[#DEB887]/10 rounded px-1">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-[#DEB887]/20">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-[#8B4513] animate-spin" />
                    <span className="text-sm text-[#8B4513]">
                      Brewing response...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area with glass effect */}
          <form
            onSubmit={handleSubmit}
            className="absolute bottom-0 left-0 right-0 border-t border-[#DEB887]/20 p-6 bg-white/80 backdrop-blur-sm rounded-b-xl"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Brew up a question..."
                className="flex-1 rounded-xl border border-[#DEB887] px-4 py-3 
                  focus:border-[#8B4513] focus:outline-none focus:ring-1 
                  focus:ring-[#8B4513] bg-[#FDF6EC]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-xl bg-[#8B4513] px-6 py-3 text-white 
                  disabled:opacity-50 hover:bg-[#A0522D] transition-colors
                  flex items-center gap-2"
              >
                <span>Brew</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
