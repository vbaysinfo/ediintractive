import type { Metadata, Viewport } from "next";
import { Baloo_2, Jost } from "next/font/google";
import "./globals.css";
import { PlatformProvider } from "@/platform/store";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "D.Interactive — Digital Interactive Learning Platform",
    template: "%s | D.Interactive",
  },
  description:
    "Turn any school textbook into a hands-on digital classroom. Students drag, drop and play through every subject from Class 1 to 10, while teachers and principals track real learning progress in real time.",
};

export const viewport: Viewport = {
  themeColor: "#6d5bfa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${baloo.variable} ${jost.variable} h-full antialiased`}>
      <body className="platform-theme min-h-full">
        <PlatformProvider>{children}</PlatformProvider>
      </body>
    </html>
  );
}
