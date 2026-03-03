"use client";

import { useEffect, useState } from "react";

export function UnreadBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/messagerie/unread-count");
        if (!res.ok) return;
        const data = await res.json();
        setCount(data.count || 0);
      } catch {
        // Silently ignore
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <span className="h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center px-1 ml-auto">
      {count > 99 ? "99+" : count}
    </span>
  );
}
