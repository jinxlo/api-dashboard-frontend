import { useMemo } from "react";
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

import { useTranslations } from "@/components/providers/locale-provider";

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

export function useNavigationSections(): NavigationSection[] {
  const t = useTranslations();

  return useMemo(
    () => [
      {
        label: t("navigation.sections.overview"),
        items: [{ name: t("navigation.items.dashboard"), href: "/dashboard", icon: LayoutDashboard }],
      },
      {
        label: t("navigation.sections.workspace"),
        items: [
          { name: t("navigation.items.workspace"), href: "/workspace", icon: Building2 },
          { name: t("navigation.items.projects"), href: "/projects", icon: FolderGit2 },
        ],
      },
      {
        label: t("navigation.sections.build"),
        items: [
          { name: t("navigation.items.playground"), href: "/playground", icon: MessageSquare },
          { name: t("navigation.items.docs"), href: "/docs", icon: BookOpen },
        ],
      },
      {
        label: t("navigation.sections.security"),
        items: [
          { name: t("navigation.items.keys"), href: "/keys", icon: Key },
          { name: t("navigation.items.account"), href: "/settings", icon: Settings },
        ],
      },
    ],
    [t],
  );
}
