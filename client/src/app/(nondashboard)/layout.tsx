"use client";

import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/search")) ||
        (userRole === "manager" && pathname === "/") || (userRole === "manager" && pathname.startsWith("/explore"))||(userRole === "manager" && pathname.startsWith("/discover"))
      ) {
        
        router.push("/managers/properties", { scroll: false });
      } else if((userRole === "tenant" && pathname.startsWith("/discover"))||(userRole === "tenant" && pathname.startsWith("/explore"))  ){
        router.push("/tenants/favorites", { scroll: false });
      }else
      {
        setIsLoading(false);

      }
    }
  }, [authUser, router, pathname]);

  if (isLoading)setIsLoading(false)

  if (authLoading || isLoading) return <>Loading...</>;

  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className={`h-full flex w-full flex-col`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
