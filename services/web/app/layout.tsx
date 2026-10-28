import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "Yashika Hidau — Full-Stack Engineer & UI/UX Designer",
  description:
    "The portfolio of Yashika Hidau, a full-stack engineer and UI/UX designer bridging backend depth, AI workflows, and thoughtful digital experiences.",
  applicationName: "Yashika Hidau Portfolio",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${syne.variable}`}>{children}</body>
    </html>
  );
}
