import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SideNav from "@/components/SideNav";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Haggle | Live Negotiation Marketplace",
  description:
    "Discover live sessions, reserve drops, message trusted sellers, and bargain in real time on Haggle.",
  openGraph: {
    title: "Haggle | Live Negotiation Marketplace",
    description:
      "A warm, premium marketplace built for live negotiation, seller discovery, and real-time deals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body>
        <ToastContainer />
        <ThemeProvider>
          <div className="w-full h-screen overflow-y-none">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
