"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Head from 'next/head';
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    console.log("RootLayout mounted");

    return () => {
      console.log("RootLayout unmounted");
    };
  }, []);

  const isAuthPage =
    pathname === "/login" || pathname === "/reset-password" || pathname === "/change-password";
  const isMapPage = pathname === "/mapa";
  const isMosaicPage = pathname === "/mosaico"; // Check if on mosaico page

  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <div className="h-screen flex flex-col">
          {!isAuthPage && !isMosaicPage && <Header />}
          <div className={`flex flex-grow overflow-hidden ${isAuthPage || isMosaicPage ? "" : "mt-16"}`}>
            {!isAuthPage && !isMosaicPage && <Sidebar />}
            <div className={`flex-grow ${!isAuthPage && !isMosaicPage ? "md:ml-[254px] ml-0" : ""} relative`}>
              {isAuthPage ? (
                <main className="relative h-full w-full flex justify-center items-center bg-background">
                  {children}
                </main>
              ) : (
                <>
                  {isMapPage || isMosaicPage ? (
                    <main className="relative h-full w-full overflow-hidden pb-16 md:pb-0">
                      {children}
                    </main>
                  ) : (
                    <ScrollArea className="h-full w-full p-2 pt-0 pb-16 md:p-12 md:pt-0 md:pb-0">
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
      </body>
    </html>
  );
}
