import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SideNav from "@/components/SideNav";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastContainer />
        <ThemeProvider>
          <div className="w-full flexss h-screen">
            <div className="absolute z-50 w-[80px] h-full">
              <SideNav />
            </div>
            <div className="w-[calc(100vw-80px)] ml-[80px] h-full overflow-y-auto">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
