"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname })
    }).catch(console.error);
  }, [pathname]);

  return null;
}
