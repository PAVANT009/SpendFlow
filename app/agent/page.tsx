"use client";

import ChatComponent from "@/modules/agent/ui/components/Chat";
import { BotMessageSquare, GemIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-clent";

export default function Page() {
    const [conversationId, setConversationId] = useState<string>("");
    const [chatEnabled,setChatEnabled] = useState(true);

      const [userId, setUserId] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);


useEffect(() => {
  let mounted = true;

  async function init() {
    const session = await authClient.getSession();

    if (!session?.data?.user?.id) {
      if (mounted) {
        setLoading(false);
      }
      return;
    }

    if (mounted) {
      setUserId(session.data.user.id);
    }

    const res = await fetch("/api/upgrade/status");
    const data = await res.json();

    if (mounted) {
      setChatEnabled(data.isPaid); 
      setLoading(false);
    }
  }

  init();

  return () => {
    mounted = false;
  };
}, []);
    
    useEffect(() => {
      async function startConversation() {
        const res = await fetch("/api/chat/start", { method: "POST" });
        const data = await res.json();
        setConversationId(data.id);
      }
      startConversation();
  }, []);
  
  // if (!conversationId) return <p>Loading chat...</p>;
  // const customer = await polarClient.customers.getStateExternal({
  //   externalId: userId,
  // });

  // const isPaid =
  //   customer.activeSubscriptions &&
  //   customer.activeSubscriptions.length > 0;

        console.log(chatEnabled, userId);

  return (
    <div className="px-7 py-7 w-full  bg-background h-[1300px]">
      {!conversationId && (
        <>
        <div className=" flex flex-row justify-between">
            <p className="text-3xl ml-1 mb-1 font-semibold text-foreground">AI Agent</p>
            <div className="border border-border rounded-2xl hover:bg-primary hover:text-foreground hover:cursor-pointer text-sm px-3 py-2 text-muted-foreground">Upgrade to premium</div>        
        </div>
        <p className="text-muted-foreground px-2">Chat with your subscriptions: search, analyze spending, add/update subscriptions, and get insights.</p>
        <div className="bg-muted/50 rounded-2xl mt-7 px-4 py-4 border border-border ">
            <div className="flex flex-row justify-between items-center">
                <p className="font-semibold text-foreground py-6">What do you get in a full app</p>
                <div className="flex flex-row gap-1.5 px-1.5 justify-center h-6 items-center border border-border rounded-2xl">
                    <GemIcon size={13}/> 
                    <p className="text-sm text-foreground font-semibold">Premium experience</p>
                </div>
            </div>
                <ul className="grid [&>li]:text-sm [&>li]:text-muted-foreground grid-cols-2 list-disc marker:text-blue-500 pl-5 space-y-2">
                    <li>Detect price changes, promos and trial expirations automatically</li>
                    <li>Auto-remind stakeholders and request approvals before renewals</li>
                    <li>Multi-currency support with instant conversions and totals</li>
                    <li>One-click visual reports: trends, forecasts and cancellation impact</li>
                </ul>
        </div>
        </>
        )}

        <div className="bg-muted/50 my-7 py-3 border border-border rounded-2xl">
          <div className="w-full flex flex-col my-5 gap-3 justify-center items-center [&>div]:flex [&>div]:flex-row [&>div]:items-center [&>div]:gap-2">
            <div className="font-semibold  "> <BotMessageSquare color="#ffffff " size={19}/> Conversation preview</div>
            <div className="border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground flex items-center gap-1"><GemIcon  size={13}/> Pro feature</div>
          </div>
          <ChatComponent chatEnabled={chatEnabled}  conversationId={conversationId}/>
        </div>
    </div>
  )
}


// import { useEffect, useState } from "react";
// import ChatComponent from "@/modules/agent/ui/components/Chat";

// export default function Page() {
//   const [conversationId, setConversationId] = useState<string>("");

//   useEffect(() => {
//     async function startConversation() {
//       const res = await fetch("/api/chat/start", { method: "POST" });
//       const data = await res.json();
//       setConversationId(data.id);
//     }
//     startConversation();
//   }, []);

//   if (!conversationId) return <p>Loading chat...</p>;

//   return (
//     <div className="px-7 pt-7 w-full bg-background h-[1300px]">
//       <h1 className="text-3xl font-semibold mb-4">AI Agent</h1>
//       <ChatComponent conversationId={conversationId} />
//     </div>
//   );
// }