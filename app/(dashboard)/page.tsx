import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/app/lib/auth";
import DashboardPage from "@/modules/dashboard/ui/components/dashboard-view";
import LandingPage from "@/modules/landing-page/ui/components/landing-page";


export const dynamic = 'force-dynamic';

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if(!session) {
    return  <LandingPage/>
  }

  return <DashboardPage/>
}

export default page

