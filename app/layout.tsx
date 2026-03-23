import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ReduxProvider from "./providers/ReduxProvider";
import AuthInitializer from "./components/AuthInitializer";
import ActivityTracker from "./components/ActivityTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecom Taki",
  description: "Nền tảng thương mại điện tử hiện đại",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <AuthInitializer />
          <ActivityTracker />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
