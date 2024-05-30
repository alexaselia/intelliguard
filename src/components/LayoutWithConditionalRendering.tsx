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
      <div className="flex flex-grow overflow-hidden">
        {!isLoginPage && <Sidebar />}
        <div className={`flex-grow ${!isLoginPage ? "md:ml-[254px] ml-[60px] mt-16" : ""} relative`}>
          {isLoginPage ? (
            <main className="relative h-full w-full flex justify-center items-center bg-background">
              {children}
            </main>
          ) : (
            <>
              {isMapPage ? (
                <main className="relative h-full w-full overflow-hidden">
                  {children}
                </main>
              ) : (
                <ScrollArea className="h-full w-full">
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
