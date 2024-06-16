"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

const LayoutWithConditionalRendering: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isMapPage = pathname === "/mapa";

  return (
    <div className="h-screen flex flex-col">
      {!isLoginPage && <Header />}
      <div className={`flex flex-grow overflow-hidden ${isLoginPage ? "" : "mt-16"}`}>
        {!isLoginPage && <Sidebar />}
        <div className={`flex-grow ${!isLoginPage ? "md:ml-[254px] ml-0" : ""} relative`}>
          {isLoginPage ? (
            <main className="relative h-full w-full flex justify-center items-center bg-background">
              {children}
            </main>
          ) : (
            <>
              {isMapPage ? (
                <main className="relative h-full w-full overflow-hidden pb-16 md:pb-0">
                  {children}
                </main>
              ) : (
                <ScrollArea className="h-full w-full pb-16 md:pb-0">
                  <main className="relative h-full w-full">
                    {children}
                  </main>
                </ScrollArea>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutWithConditionalRendering;
