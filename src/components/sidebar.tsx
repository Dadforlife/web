"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Heart,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Home,
  MessageCircle,
} from "lucide-react";
import { logout } from "@/app/auth/actions";
import { useState } from "react";

interface SidebarProps {
  user: {
    email: string;
    fullName: string;
  } | null;
}

const sidebarLinks = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/diagnostic",
    label: "Diagnostic",
    icon: MessageCircle,
  },
  {
    href: "/dashboard/programme",
    label: "Programme",
    icon: BookOpen,
  },
  {
    href: "/dashboard/annuaire",
    label: "Annuaire",
    icon: Users,
  },
  {
    href: "/dashboard/calendrier",
    label: "Calendrier",
    icon: Calendar,
  },
  {
    href: "/dashboard/don",
    label: "Faire un don",
    icon: Heart,
  },
  {
    href: "/dashboard/parametres",
    label: "Paramètres",
    icon: Settings,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SidebarContent({
  user,
  pathname,
  collapsed,
  onLinkClick,
}: {
  user: SidebarProps["user"];
  pathname: string;
  collapsed: boolean;
  onLinkClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 h-16 shrink-0", collapsed && "justify-center px-2")}>
        <Image
          src="/logo.svg"
          alt="Dad for Life"
          width={32}
          height={32}
          className="h-8 w-8 object-contain shrink-0 dark:brightness-0 dark:invert"
        />
        {!collapsed && (
          <span className="text-lg font-bold text-primary tracking-tight">
            Dad for Life
          </span>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                "hover:bg-primary/5 hover:text-primary",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <link.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Retour accueil */}
      <div className="px-3 pb-2">
        <Link
          href="/"
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Retour au site</span>}
        </Link>
      </div>

      <Separator />

      {/* User info + Logout */}
      <div className={cn("p-4 shrink-0", collapsed && "px-2")}>
        {user && (
          <div className={cn("flex items-center gap-3", collapsed && "flex-col gap-2")}>
            <Avatar className="h-9 w-9 shrink-0 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {getInitials(user.fullName || user.email)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.fullName || "Utilisateur"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
            <form action={logout}>
              <Button
                variant="ghost"
                size="icon"
                type="submit"
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed top-0 left-0 h-screen border-r border-border/60 bg-background z-40 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <SidebarContent
          user={user}
          pathname={pathname}
          collapsed={collapsed}
        />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </aside>

      {/* Mobile header + sidebar drawer */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between h-14 px-4 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Dad for Life"
            width={28}
            height={28}
            className="h-7 w-7 object-contain dark:brightness-0 dark:invert"
          />
          <span className="text-base font-bold text-primary">Dad for Life</span>
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent
              user={user}
              pathname={pathname}
              collapsed={false}
              onLinkClick={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
