"use client";
import { ModeToggle } from "@/components/theme-button";
import Image from "next/image";
import { authClient } from "./lib/auth-clent";
import { useRouter } from "next/navigation";

export default function Home() {
  const Router = useRouter();
  const handleSignOut = async () => {
    authClient.signOut();
    Router.push("/sign-up");
  }

  return (
    <div>
      <button onClick={handleSignOut}>SignOut</button>
    </div>
  )  
}
