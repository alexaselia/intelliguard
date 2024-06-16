"use client"; // Add this line

import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWithConditionalRendering from "@/components/LayoutWithConditionalRendering";
import Head from 'next/head';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <AuthProvider>
          <LayoutWithConditionalRendering>
            {children}
          </LayoutWithConditionalRendering>
        </AuthProvider>
      </body>
    </html>
  );
}
