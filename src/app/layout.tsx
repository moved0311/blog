import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LatexStyleSheet from "@/components/LatexStyleSheet";

import "@/styles/prism-plus.css";
import "@/styles/prism-ghcolors.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taiyi | Dev",
  description: "Notes",
  icons: { icon: { url: "/favicon.svg" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-tw">
      <head>
        <LatexStyleSheet />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
