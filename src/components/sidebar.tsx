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
  ClipboardList,
  ShieldCheck,
  MessageCircle,
  AlertTriangle,
  FileText,
  CreditCard,
  Bell,
  Cog,
  HandHeart,
  Mail,
  CalendarCheck,
  Briefcase,
  Baby,
  Star,
  Inbox,
} from "lucide-react";
import { logout } from "@/app/auth/actions";
import { useEffect, useState } from "react";
import { NotificationBell } from "@/components/notification-bell";
import { UnreadBadge } from "@/components/messagerie/unread-badge";

interface SidebarProps {
  user: {
    email: string;
    fullName: string;
  } | null;
  primaryRole: string;
  roles: string[];
}

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: React.ComponentType;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

type MenuMode = "primary" | "benevole" | "professionnel" | "admin";

function getPrimaryLabel(primaryRole: string): string {
  switch (primaryRole) {
    case "maman_demande": return "Mode Maman";
    case "papa_benevole": return "Mode Papa";
    default: return "Mode Papa";
  }
}

function getPrimarySections(primaryRole: string, roles: string[]): NavSection[] {
  if (primaryRole === "maman_demande") {
    const sections: NavSection[] = [
      {
        label: "Suivi",
        items: [
          { href: "/dashboard/maman", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
          { href: "/dashboard/demande-rdv", label: "Demander un RDV", icon: CalendarCheck },
          { href: "/dashboard/messagerie", label: "Messagerie", icon: Mail, badge: UnreadBadge },
        ],
      },
      {
        label: "Compte",
        items: [
          { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
          { href: "/dashboard/parametres", label: "Param\u00e8tres", icon: Settings },
        ],
      },
    ];
    const soutienItems: NavItem[] = [
      { href: "/dashboard/don", label: "Faire un don", icon: Heart },
    ];
    if (!roles.includes("volunteer") && !roles.includes("partner")) {
      soutienItems.push(
        { href: "/dashboard/devenir-benevole", label: "Devenir b\u00e9n\u00e9vole", icon: HandHeart },
      );
    }
    if (!roles.includes("partner")) {
      soutienItems.push(
        { href: "/dashboard/devenir-professionnel", label: "Devenir professionnel", icon: Briefcase },
      );
    }
    sections.push({ label: "Soutien", items: soutienItems });
    return sections;
  }

  // papa_aide or papa_benevole in primary mode
  const soutienItems: NavItem[] = [
    { href: "/dashboard/don", label: "Faire un don", icon: Heart },
  ];

  if (!roles.includes("volunteer") && !roles.includes("partner")) {
    soutienItems.push(
      { href: "/dashboard/devenir-benevole", label: "Devenir b\u00e9n\u00e9vole", icon: HandHeart },
    );
  }
  if (!roles.includes("partner")) {
    soutienItems.push(
      { href: "/dashboard/devenir-professionnel", label: "Devenir professionnel", icon: Briefcase },
    );
  }

  const sections: NavSection[] = [
    {
      label: "Parcours",
      items: [
        { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
        { href: "/dashboard/diagnostic", label: "Ma situation", icon: ClipboardList },
        { href: "/dashboard/programme", label: "Programme", icon: BookOpen },
        { href: "/dashboard/demande-rdv", label: "Demander un RDV", icon: CalendarCheck },
      ],
    },
    {
      label: "Communaut\u00e9",
      items: [
        { href: "/espace-papas", label: "Espace Papas", icon: MessageCircle },
        { href: "/dashboard/messagerie", label: "Messagerie", icon: Mail, badge: UnreadBadge },
        { href: "/dashboard/annuaire", label: "Annuaire", icon: Users },
        { href: "/dashboard/calendrier", label: "Calendrier", icon: Calendar },
      ],
    },
    {
      label: "Compte",
      items: [
        { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
        { href: "/dashboard/parametres", label: "Param\u00e8tres", icon: Settings },
      ],
    },
    {
      label: "Soutien",
      items: soutienItems,
    },
  ];

  return sections;
}

const benevoleSections: NavSection[] = [
  {
    label: "B\u00e9n\u00e9volat",
    items: [
      { href: "/dashboard/benevole", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/benevole/demandes", label: "Demandes de RDV", icon: Inbox },
      { href: "/dashboard/benevole/papas", label: "Mes papas", icon: Users },
      { href: "/dashboard/benevole/rendez-vous", label: "Rendez-vous", icon: CalendarCheck },
      { href: "/dashboard/benevole/alertes", label: "Alertes", icon: AlertTriangle },
      { href: "/dashboard/messagerie", label: "Messagerie", icon: Mail, badge: UnreadBadge },
    ],
  },
  {
    label: "Compte",
    items: [
      { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
      { href: "/dashboard/parametres", label: "Param\u00e8tres", icon: Settings },
    ],
  },
];

const professionnelSections: NavSection[] = [
  {
    label: "Espace Pro",
    items: [
      { href: "/dashboard/professionnel", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/profil-pro", label: "Mon profil", icon: Briefcase },
      { href: "/dashboard/messagerie", label: "Messagerie", icon: Mail, badge: UnreadBadge },
    ],
  },
  {
    label: "Compte",
    items: [
      { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
      { href: "/dashboard/parametres", label: "Param\u00e8tres", icon: Settings },
    ],
  },
];

const adminSections: NavSection[] = [
  {
    label: "Pilotage",
    items: [{ href: "/admin", label: "Vue d\u2019ensemble", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Mod\u00e9ration",
    items: [
      { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
      { href: "/admin/discussions", label: "Discussions", icon: MessageCircle },
      { href: "/admin/messagerie", label: "Messagerie", icon: Mail, badge: UnreadBadge },
      { href: "/admin/signalements", label: "Signalements", icon: AlertTriangle },
      { href: "/admin/benevoles", label: "Candidatures b\u00e9n\u00e9voles", icon: HandHeart },
      { href: "/admin/professionnels", label: "Validation professionnels", icon: ShieldCheck },
      { href: "/admin/demandes-accompagnement", label: "Demandes mamans", icon: Baby },
    ],
  },
  {
    label: "Contenu & finances",
    items: [
      { href: "/admin/contenus", label: "Contenus", icon: FileText },
      { href: "/admin/paiements", label: "Paiements", icon: CreditCard },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/parametres", label: "Param\u00e8tres", icon: Cog },
    ],
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

function isLinkActive(pathname: string, item: NavItem) {
  if (item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(item.href);
}

interface ModeOption {
  mode: MenuMode;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

function getAvailableModes(primaryRole: string, roles: string[]): ModeOption[] {
  const modes: ModeOption[] = [];

  const primaryLabel = getPrimaryLabel(primaryRole);
  const primaryShort = primaryRole === "maman_demande" ? "M" : "P";
  const primaryIcon = primaryRole === "maman_demande" ? Baby : Heart;
  modes.push({ mode: "primary", label: primaryLabel, shortLabel: primaryShort, icon: primaryIcon });

  if (roles.includes("volunteer")) {
    modes.push({ mode: "benevole", label: "Mode B\u00e9n\u00e9vole", shortLabel: "B", icon: HandHeart });
  }

  if (roles.includes("partner")) {
    modes.push({ mode: "professionnel", label: "Mode Pro", shortLabel: "Pro", icon: Briefcase });
  }

  if (roles.includes("admin")) {
    modes.push({ mode: "admin", label: "Mode Admin", shortLabel: "A", icon: ShieldCheck });
  }

  return modes;
}

function SidebarContent({
  user,
  pathname,
  collapsed,
  onLinkClick,
  primaryRole,
  roles,
  mode,
  onModeChange,
}: {
  user: SidebarProps["user"];
  pathname: string;
  collapsed: boolean;
  onLinkClick?: () => void;
  primaryRole: string;
  roles: string[];
  mode: MenuMode;
  onModeChange?: (mode: MenuMode) => void;
}) {
  const availableModes = getAvailableModes(primaryRole, roles);
  const showModeSwitcher = availableModes.length > 1;

  let sectionsToRender: NavSection[];
  switch (mode) {
    case "admin":
      sectionsToRender = adminSections;
      break;
    case "benevole":
      sectionsToRender = benevoleSections;
      break;
    case "professionnel":
      sectionsToRender = professionnelSections;
      break;
    default:
      sectionsToRender = getPrimarySections(primaryRole, roles);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo + Notifications */}
      <div className={cn("flex items-center justify-between px-4 h-16 shrink-0", collapsed && "justify-center px-2")}>
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="Papa pour la vie"
            width={32}
            height={32}
            className="h-8 w-8 object-contain shrink-0 dark:brightness-0 dark:invert"
          />
          {!collapsed && (
            <span className="text-lg font-bold text-primary tracking-tight">
              Papa pour la vie
            </span>
          )}
        </div>
        {!collapsed && <NotificationBell />}
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {showModeSwitcher && (
          <div className="mb-3">
            {!collapsed && (
              <p className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                Navigation
              </p>
            )}
            <div className={cn(
              "grid gap-1",
              collapsed
                ? "grid-cols-1"
                : availableModes.length >= 3
                  ? "grid-cols-3"
                  : "grid-cols-2"
            )}>
              {availableModes.map((opt) => (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => onModeChange?.(opt.mode)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
                    mode === opt.mode
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                  title={opt.label}
                >
                  {collapsed ? (
                    opt.shortLabel
                  ) : (
                    <>
                      <opt.icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{opt.label}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "admin" && !collapsed && (
          <span className="px-3 py-1 mb-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Administration
          </span>
        )}

        {sectionsToRender.map((section, sectionIndex) => (
          <div key={section.label} className={cn(sectionIndex > 0 && "mt-3")}>
            {!collapsed && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = isLinkActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
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
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {!collapsed && item.badge && <item.badge />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
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
                title="D\u00e9connexion"
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

export function Sidebar({ user, primaryRole, roles }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const resolveInitialMode = (): MenuMode => {
    if (pathname.startsWith("/admin") && roles.includes("admin")) return "admin";
    if (pathname.startsWith("/dashboard/benevole") && roles.includes("volunteer")) return "benevole";
    if (pathname.startsWith("/dashboard/professionnel") && roles.includes("partner")) return "professionnel";
    return "primary";
  };

  const [menuMode, setMenuMode] = useState<MenuMode>(resolveInitialMode);

  useEffect(() => {
    if (pathname.startsWith("/admin") && roles.includes("admin")) {
      setMenuMode("admin");
    } else if (pathname.startsWith("/dashboard/benevole") && roles.includes("volunteer")) {
      setMenuMode("benevole");
    } else if (pathname.startsWith("/dashboard/professionnel") && roles.includes("partner")) {
      setMenuMode("professionnel");
    }
  }, [pathname, roles]);

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
          primaryRole={primaryRole}
          roles={roles}
          mode={menuMode}
          onModeChange={setMenuMode}
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
            alt="Papa pour la vie"
            width={28}
            height={28}
            className="h-7 w-7 object-contain dark:brightness-0 dark:invert"
          />
          <span className="text-base font-bold text-primary">Papa pour la vie</span>
        </Link>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" suppressHydrationWarning>
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
              primaryRole={primaryRole}
              roles={roles}
              mode={menuMode}
              onModeChange={setMenuMode}
            />
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </>
  );
}
