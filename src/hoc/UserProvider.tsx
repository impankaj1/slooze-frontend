"use client";

import { accessToken } from "@/helpers";
import { initUser } from "@/lib/initUser";
import { useEffect } from "react";

export function UserProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (accessToken) {
      initUser();
    }
  }, []);

  return <>{children}</>;
}
