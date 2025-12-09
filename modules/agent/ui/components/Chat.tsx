"use client";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ChatComponent({
  conversationId,
}: {
  conversationId: string;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [convo, setConvo] = useState<{content: string,role:string,id:string}[]>();
  const [loading,setLoading] = useState(false);

  const fetchData = async() => {
      // const res = await fetch(`/api/messages/${conversationId}`);      
      // const data = await res.json();
      //   setConvo(data);
      //   console.log(data);
      // console.log("data",data);
      try {
          setLoading(true);                          
          const res = await fetch(`/api/messages/${conversationId}`);
          const data = await res.json();
          setConvo(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setLoading(false);                         
        }
      }
  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!ignore) {
        await fetchData()
      }
    }

    load();

    return () => {
      ignore = true; 
    };
  }, [conversationId]);

  const send = () => {
    if (!input) return;

    setMessages((m) => [...m, input]);  
    setMessages((m) => [...m, ""]);     

    setLoading(true)

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

     eventSource.onerror = async () => {
      eventSource.close();
      await fetchData(); 
      setLoading(false)
    };
    setInput("");
  };

  console.log("convo",convo);

  return (
    <div>
      { !convo || convo.length === 0 ? (
                  <div className="bg-card border border-border flex flex-col gap-2.5 px-4 py-3 mx-4 my-4 rounded-2xl">
            <div className="bg-background rounded-2xl px-4 py-4 gap-1.5 ">
              <p className="text-muted-foreground text-[12px]">YOU</p>
              <p className="text-sm font-semibold">Find subscriptions over $20 and categorize them.</p>
            </div>
            <div className="bg-background rounded-2xl px-4 py-4 gap-1.5">
              <p className="text-muted-foreground text-[12px]">YOU</p>
              <p className="text-sm font-semibold">Find subscriptions over $20 and categorize them.</p>
            </div>
            <div className="bg-background rounded-2xl px-4 py-4 gap-1.5">
              <p className="text-muted-foreground text-[12px]">YOU</p>
              <p className="text-sm font-semibold">Find subscriptions over $20 and categorize them.</p>
            </div>
          </div>
      ) : 
      <div className="px-4 py-2.5 my-3 bg-card border border-border mx-3.5 rounded-2xl">
        <div className="flex flex-col gap-1.5">
          {convo?.map((co) => (
            <div 
              // className="bg-background rounded-2xl px-4 py-4 gap-1.5 w-fit" key={co.id}
               key={co.id}
                className={cn(
                  "rounded-2xl px-4 py-4 gap-1.5 max-w-[70%]",
                  co.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto bg-background text-foreground"
                )}
              >
              <p className="text-muted-foreground text-[12px]">{co.role}</p>
              <p className="text-sm font-semibold">{co.content}</p>
            </div>
          ))}
          {loading && (
            <div className="flex flex-col gap-1.5">
              <div className="ml-auto bg-primary text-primary-foreground rounded-2xl px-4 py-4 gap-1.5 max-w-[70%]">
                <p className="text-muted-foreground text-[12px]">user</p>
                <p className="text-sm font-semibold">
                  {messages[messages.length - 2]}
                </p>
              </div>
              <div className="mr-auto bg-background text-foreground rounded-2xl px-4 py-4 gap-1.5 max-w-[70%]">
                <p className="text-muted-foreground text-[12px]">assistant</p>
                <p className="text-sm font-semibold">
                  <Spinner className="mt-1"/>
                </p>
              </div>
            </div>
            )}
        </div>

      </div>
  }
    <div className="px-4 py-2.5 my-3 bg-card border border-border mx-3.5 rounded-2xl">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="w-[93%] border border-border/50 rounded-[10px]  px-3.5 py-2 mr-1"
      />
      <button className="rounded-2xl bg-primary px-3 py-2 ml-1" onClick={send}>Send</button>
  </div>
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
