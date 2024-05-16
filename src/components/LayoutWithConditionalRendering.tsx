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

  return (
    <div className="h-screen overflow-hidden">
      {!isLoginPage && <Header />}
      <div className={`flex h-full ${isLoginPage ? 'justify-center items-center' : ''}`}>
        {!isLoginPage && <Sidebar />}
        <div className={`flex-grow ${!isLoginPage ? "ml-[254px] mt-16" : ""}`}>
          {isLoginPage ? (
            <main className="relative h-full w-full flex justify-center items-center bg-background">
              {children}
            </main>
          ) : (
            <ScrollArea className="h-full">
              <main className="relative h-full">
                {children}
              </main>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutWithConditionalRendering;
