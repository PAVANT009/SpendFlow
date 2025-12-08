"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
 } from "@/components/ui/sidebar";
import {  StarIcon, BellIcon,LayoutDashboard, Layers, ChartPie, BotMessageSquare  } from "lucide-react";

// import { DashboardUserButton } from "./dashboard-user-button";
// import { DashboardTrail } from "./dashboard-trail";


 const firstSection = [
    {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard 
    },
    {
        label: "AI Agent",
        href: '/agent',
        icon: BotMessageSquare
    },
    {
        label: "Categories",
        href: "/categories",
        icon: Layers
    },
    {
        label: "Analytics",
        href: "/analytics",
        icon: ChartPie
    },
    {
        label: "Notifications",
        href: "/notifications",
        icon: BellIcon
    }
]
 const secondSection = [
    {
        label: "Upgrade",
        href: "/upgrade",
        icon: StarIcon
    },
]

export const PageSidebar = () => {
    const pathname = usePathname();
    return (
        <Sidebar className="bg-sidebar">
            <SidebarHeader>
                <Link href={"/"} className="flex items-center gap-4 px-2 pt-2">
                    <Image src={"/logo.svg"} alt="logo" width={32} height={32}/>
                    <p className="text-2xl text-sidebar-primary-foreground font-semibold">SpendFlow</p>
                </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className="opacity-10 bg-[#5D6B68]" />
            </div>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        className="h-10 hover:bg-linear-to-r/oklch 
                                                    border border-transparent 
                                                    hover:border-[#5D6B68]/10
                                                    data-[active=true]:bg-primary
                                                    data-[active=true]:text-white
                                                    data-[active=true]:border-[#5D6B68]/10"
                                                    
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="text-foreground w-5 h-5" />
                                                <span className="ml-2 text-sm font-medium tracking-tight">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            <div className="px-4 py-2">
                <Separator className="opacity-10 bg-[#5D6B68]"/>
            </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                    asChild
                                    className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-5% via-30% via-sidebar/50 to-sidebar/50",
                                        pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                    )}
                                    isActive={pathname === item.href}
                                    >
                                        <Link href={item.href} 
                                        >
                                            <item.icon size={22} className="text-foreground"/>
                                            <span className="text-sm font-medium tracking-tight">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="text-white">
                    {/* <DashboardTrail /> */}
                    {/* <DashboardUserButton/> */}
            </SidebarFooter>
        </Sidebar>
    )
}

