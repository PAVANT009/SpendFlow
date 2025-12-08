"use client";

import { useState } from "react";

export default function ChatComponent({
  conversationId,
}: {
  conversationId: string;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const send = () => {
    if (!input) return;

    setMessages((m) => [...m, input]); // show user
    setMessages((m) => [...m, ""]);    // placeholder for assistant

    const eventSource = new EventSource(
      `/api/chat/send?conversationId=${conversationId}&content=${encodeURIComponent(
        input
      )}`
    );

    let assistantMsg = "";

    eventSource.onmessage = (e) => {
      assistantMsg += e.data;
      setMessages((m) => [...m.slice(0, -1), assistantMsg]);
    };

    eventSource.onerror = () => eventSource.close();
    setInput("");
  };

  return (
    <div className="px-4 py-2.5 border border-border my-4 mx-3.5 rounded-2xl">
      <div>
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="w-[93%] border border-border/50 rounded-[14px]  px-3.5 py-2 mr-1"
      />
      <button className="rounded-2xl bg-primary px-2.5 py-2" onClick={send}>Send</button>
    </div>
  );
}


// "use client";

// import { useState } from "react";

// export default function Chat({ conversationId }: { conversationId: string }) {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<string[]>([]);

//   const send = async () => {
//     const res = await fetch("/api/chat/send", {
//       method: "POST",
//       body: JSON.stringify({ conversationId, content: input }),
//     });

//     const { streamUrl } = await res.json();
//     const eventSource = new EventSource(streamUrl);

//     let streamed = "";
//     setMessages(m => [...m, input]);      // show user message
//     setMessages(m => [...m, ""]);         // placeholder for assistant
//     setInput("");

//     eventSource.onmessage = (e) => {
//       streamed += e.data;
//       setMessages(m => [...m.slice(0, -1), streamed]);
//     };

//     eventSource.onerror = () => eventSource.close();
//   };

//   return (
//     <div>
//       {messages.map((m, i) => <p key={i}>{m}</p>)}

//       <input value={input} onChange={e => setInput(e.target.value)} />
//       <button onClick={send}>Send</button>
//     </div>
//   );
// }
