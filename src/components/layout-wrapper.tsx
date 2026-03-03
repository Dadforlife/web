"use client";

import { usePathname } from "next/navigation";

export function LayoutWrapper({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const hasSidebar =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/espace-papas") ||
    pathname.startsWith("/admin");

  if (hasSidebar) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      {children}
      {footer}
    </>
  );
}
