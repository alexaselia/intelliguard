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
  const isResetPasswordPage = pathname === "/reset-password";
  const isChangePasswordPage = pathname === "/change-password";
  const isMapPage = pathname === "/mapa";

  const shouldHideHeaderAndSidebar =
    isLoginPage || isResetPasswordPage || isChangePasswordPage;

  return (
    <div className="h-screen flex flex-col">
      {!shouldHideHeaderAndSidebar && <Header />}
      <div className={`flex flex-grow overflow-hidden ${shouldHideHeaderAndSidebar ? "" : "mt-16"}`}>
        {!shouldHideHeaderAndSidebar && <Sidebar />}
        <div className={`flex-grow ${!shouldHideHeaderAndSidebar ? "md:ml-[254px] ml-0" : ""} relative`}>
          {shouldHideHeaderAndSidebar ? (
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
