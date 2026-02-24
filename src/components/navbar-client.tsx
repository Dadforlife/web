"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, LayoutDashboard, User } from "lucide-react";
import { logout } from "@/app/auth/actions";

interface NavbarClientProps {
  user: {
    email: string;
    fullName: string;
  } | null;
}

const publicLinks: { href: string; label: string }[] = [
  { href: "/", label: "Accueil" },
  { href: "/#mission", label: "Notre mission" },
  { href: "/#programme", label: "Programme" },
  { href: "/diagnostic", label: "Demander un accompagnement" },
];

const authLinks: { href: string; label: string }[] = [];

export function NavbarClient({ user }: NavbarClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-sm transition-all overflow-x-hidden">
      <div className="container mx-auto flex h-16 items-center justify-between gap-2 px-4 min-w-0">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-all hover:opacity-90 rounded-lg py-2 -my-2"
        >
          <Image
            src="/logo.svg"
            alt="Dad for Life"
            width={36}
            height={36}
            className="h-9 w-9 object-contain dark:brightness-0 dark:invert"
            priority
          />
          <span className="text-base sm:text-xl font-bold text-primary tracking-tight truncate min-w-0">
            Dad for Life
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-1 min-w-0 flex-shrink">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
          {user && authLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">
                  {user.fullName || user.email}
                </span>
              </div>
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="mr-1.5 h-4 w-4" />
                  D&eacute;connexion
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" className="font-semibold" asChild>
                <Link href="/auth/login">Connexion</Link>
              </Button>
              <Button
                className="bg-warm text-warm-foreground hover:bg-warm/90 shadow-md shadow-warm/20 font-semibold rounded-xl"
                asChild
              >
                <Link href="/auth/register">Adh&eacute;rer</Link>
              </Button>
            </>
          )}
        </div>

        {/* Menu mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100vw-2rem,18rem)] sm:w-72 max-w-full flex flex-col p-0">
            <div className="flex flex-col gap-6 pt-14 px-6 pb-6 overflow-y-auto flex-1 min-h-0">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Image
                  src="/logo.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain dark:brightness-0 dark:invert"
                />
                <span className="text-lg font-bold text-primary">
                  Dad for Life
                </span>
              </Link>
              <nav className="flex flex-col gap-4">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {user && authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-3 mt-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pb-2 border-b">
                      <User className="h-4 w-4" />
                      <span>{user.fullName || user.email}</span>
                    </div>
                    <Button variant="outline" asChild>
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <form action={logout}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive"
                        type="submit"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        D&eacute;connexion
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link
                        href="/auth/login"
                        onClick={() => setOpen(false)}
                      >
                        Connexion
                      </Link>
                    </Button>
                    <Button className="bg-warm text-warm-foreground hover:bg-warm/90" asChild>
                      <Link
                        href="/auth/register"
                        onClick={() => setOpen(false)}
                      >
                        Adh&eacute;rer
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
