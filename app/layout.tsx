import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import RootProviders from "./_components/RootProviders";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coinly - Your Pocket-Sized Financial Wizard",
  description: "Discover Coinly, your trusted companion for effortless budget tracking. Seamlessly manage expenses, track spending, and unlock financial freedom with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <RootProviders>
            {children}
          </RootProviders>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
