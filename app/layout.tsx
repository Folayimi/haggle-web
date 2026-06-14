import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
