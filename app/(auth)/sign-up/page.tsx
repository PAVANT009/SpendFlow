import { auth } from "@/app/lib/auth"
import { SignUpView } from "@/modules/auth/views/sign-up-view";
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
  return <SignUpView/>
}

export default Page 
