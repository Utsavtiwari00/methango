import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const ConceptAI = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);


  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // initialize chat session
  const [chatSession] = useState(() =>
    genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are a helpful tutor. Always explain concepts step-by-step with examples, keep it beginner-friendly.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Got it! I'll explain in simple terms with examples." },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7, // creativity level
      },
    })
  );

  const sendMessage = async () => {
    if (!query.trim()) return;
    setLoading(true);

    // add user message
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    const userMessage = query;
    setQuery("");

    try {
      const result = await chatSession.sendMessage(userMessage);
      const aiReply = result.response.text();

      setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Error fetching AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-200 mb-10">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Learn Concept by AI 🤖</h2>

        {/* Chat Window */}
        <div
          ref={chatRef}
          className="h-80 overflow-y-auto bg-base-300 rounded-lg p-4 mb-4"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat ${
                msg.role === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  msg.role === "user"
                    ? "chat-bubble-primary"
                    : "chat-bubble-secondary"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Input + Send */}
        <div className="flex gap-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about any concept..."
            className="textarea textarea-bordered flex-1"
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="btn btn-primary self-end"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConceptAI;
