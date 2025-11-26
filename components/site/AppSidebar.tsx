import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Rocket,
  BarChart2,
  Briefcase,
  Presentation,
  Sparkles,
  Mail,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const generatorItems = [
  {
    title: "Pitch Deck Generator",
    url: "#",
    icon: Presentation,
  },
  {
    title: "One Liner Generator",
    url: "#",
    icon: Sparkles,
  },
  {
    title: "Outreach Email Generator",
    url: "#",
    icon: Mail,
  },
];

const toolItems = [
  {
    title: "Investor Finder",
    url: "#",
    icon: Rocket,
  },
  {
    title: "Market Research Tool",
    url: "#",
    icon: BarChart2,
  },
  {
    title: "Startup Valuation Tool",
    url: "#",
    icon: Briefcase,
  },
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: Settings,
  //   },
];

export function AppSidebar() {
  return (
    <Sidebar className="fixed top-[80px] h-[calc(100vh-60px-40px)] text-black border-r border-gray-300 z-40">
      <SidebarContent>
        {/* STARTUP GENERATORS */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl text-black py-6 pt-15">
            Startup Generators
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {generatorItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* STARTUP TOOLS */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl text-black py-6">
            Startup Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
