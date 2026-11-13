import type { Metadata } from "next";
import { Figtree, Lora } from "next/font/google";
import AdminShell from "@/components/AdminShell";
import AuthGate from "@/components/AuthGate";
import DataProvider from "@/components/DataProvider";
import "./globals.css";

// Fonts from docs/theme.md: Lora for headings, Figtree for everything else.
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], weight: ["600", "700"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Whitman Bike Share Admin",
  description: "Manage stations and bikes for Whitman Bike Share.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lora.variable} ${figtree.variable}`}>
      <body>
        <AuthGate>
          <DataProvider>
            <AdminShell>{children}</AdminShell>
          </DataProvider>
        </AuthGate>
      </body>
    </html>
  );
}
