import { auth } from "@/app/lib/auth"
import { SignInView } from "@/modules/auth/views/sign-in-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

const  Page = async() => {
  const session =  await auth.api.getSession({
        headers: await headers(),
      });
    
      if(!!session) {
        redirect('/');
      }
  return (
    <SignInView/>
  )
}

export default Page 
