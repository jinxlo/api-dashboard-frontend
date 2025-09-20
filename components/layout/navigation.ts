import type { ComponentType, SVGProps } from "react";
import {
  BookOpen,
  Building2,
  FolderGit2,
  Key,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from "lucide-react";

export type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavigationItem {
  name: string;
  href: string;
  icon: NavigationIcon;
  description?: string;
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

export const navigationSections: NavigationSection[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Workspace",
    items: [
      { name: "Workspace", href: "/workspace", icon: Building2 },
      { name: "Projects", href: "/projects", icon: FolderGit2 },
    ],
  },
  {
    label: "Build",
    items: [
      { name: "Playground", href: "/playground", icon: MessageSquare },
      { name: "Docs", href: "/docs", icon: BookOpen },
    ],
  },
  {
    label: "Security",
    items: [
      { name: "API keys", href: "/keys", icon: Key },
      { name: "Account", href: "/settings", icon: Settings },
    ],
  },
];
