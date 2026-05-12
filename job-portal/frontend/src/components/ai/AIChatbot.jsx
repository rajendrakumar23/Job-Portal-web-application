// import { useState } from "react";
// import axios from "axios";

// const AIChatbot = () => {
//   const [message, setMessage] = useState("");
//   const [reply, setReply] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!message) return;

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:5000/api/ai/chat",
//         {
//           message,
//         }
//       );

//       console.log(res.data);

//       setReply(res.data.reply);
//     } catch (error) {
//       console.log(error);

//       setReply("AI not responding");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // <div className="fixed bottom-5 right-5 bg-white p-4 rounded-xl shadow-xl w-80 z-50">
//     // 
//     <div className="fixed bottom-5 right-5 bg-white p-4 rounded-2xl shadow-2xl w-[320px] h-[380px] z-50 flex flex-col">
//       <h2 className="font-bold mb-2 text-lg">
//         AI Career Assistant
//       </h2>

//       {/* <textarea
//          className="border w-full p-2 rounded resize-none"
//         rows="4"
//         placeholder="Ask anything..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       /> */}
//       <textarea
//   className="border w-full p-2 rounded resize-none outline-none"
//   rows="3"
//   placeholder="Ask anything..."
//   value={message}
//   onChange={(e) => setMessage(e.target.value)}
//   onKeyDown={(e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   }}
// />

//       <button
//         onClick={sendMessage}
//         className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full"
//       >
//         {loading ? "Thinking..." : "Ask AI"}
//       </button>

//       {/* <div className="mt-4 text-sm border-t pt-2 flex-1 overflow-y-auto"> */}
//       <div className="mt-3 text-sm border-t pt-3 flex-1 overflow-y-auto">
//   {reply}
// </div>
//     </div>
//   );
// };

// export default AIChatbot;

// import { useState } from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const AIChatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      type: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        {
          message: currentMessage,
        }
      );

      const aiMessage = {
        type: "ai",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "AI not responding",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-5 right-5 bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl text-2xl z-50"
    >
      🤖
    </button>
  );
}

  return (
    
    <div className="fixed bottom-5 right-5 bg-white p-4 rounded-2xl shadow-2xl w-[320px] h-[420px] z-50 flex flex-col">

      {/* <h2 className="font-bold text-lg mb-3">
        AI Career Assistant
      </h2> */}
      <div className="flex items-center justify-between mb-3">
  <h2 className="font-bold text-lg">
    AI Career Assistant
  </h2>

  <button
    onClick={() => setIsOpen(false)}
    className="text-xl font-bold"
  >
    ×
  </button>
</div>

      <div className="flex-1 overflow-y-auto border rounded-lg p-2 bg-gray-50 space-y-2">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg text-sm max-w-[85%] break-words ${
              msg.type === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-200 text-black p-2 rounded-lg text-sm w-fit">
            Thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <textarea
        className="border w-full p-2 rounded-lg resize-none outline-none mt-3"
        rows="2"
        placeholder="Ask anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />

      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white py-2 rounded-lg mt-2"
      >
        Ask AI
      </button>
    </div>
  );
};

export default AIChatbot;