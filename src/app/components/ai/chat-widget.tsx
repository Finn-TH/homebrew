"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
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
    <div className="fixed bottom-8 right-8 z-50">
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-[#8B4513] p-6 text-white shadow-lg hover:bg-[#A0522D] transition-colors"
        >
          <MessageCircle className="h-8 w-8" />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[480px] rounded-xl bg-white shadow-2xl"
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h3 className="text-xl font-semibold text-[#8B4513]">
              AI Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-lg px-6 py-4 ${
                    message.role === "user"
                      ? "bg-[#8B4513] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.role === "user" ? (
                    message.content
                  ) : (
                    <ReactMarkdown
                      className="prose prose-sm max-w-none"
                      components={{
                        // Custom styling for markdown elements
                        h1: ({ node, ...props }) => (
                          <h1 className="text-xl font-bold mb-4" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-lg font-bold mb-3" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-md font-bold mb-2" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-4 mb-4" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal pl-4 mb-4" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="mb-1" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="mb-4 last:mb-0" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-bold" {...props} />
                        ),
                        em: ({ node, ...props }) => (
                          <em className="italic" {...props} />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-6 py-4 text-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">Thinking</div>
                    <div className="flex space-x-1">
                      <div className="animate-bounce delay-100">.</div>
                      <div className="animate-bounce delay-200">.</div>
                      <div className="animate-bounce delay-300">.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Add invisible div for scrolling */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t p-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-lg border px-6 py-4 focus:border-[#8B4513] focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-[#8B4513] px-6 py-4 text-white disabled:opacity-50 hover:bg-[#A0522D] transition-colors"
              >
                <Send className="h-6 w-6" />
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Add memory warning display */}
      {memoryWarning && (
        <div className="absolute top-0 left-0 right-0 p-2 bg-yellow-100 text-yellow-800 text-sm rounded-t-lg">
          {memoryWarning}
        </div>
      )}
    </div>
  );
}
