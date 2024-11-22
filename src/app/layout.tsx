import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import cx from "classnames";
import { GoogleAnalytics } from "@next/third-parties/google";

import "@/styles/prism-plus.css";
import "@/styles/prism-vsc-dark-plus.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taiyi | Dev",
  description: "Notes",
  icons: { icon: { url: "/favicon.svg" } },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-tw" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cx(
          inter.className,
          "mx-auto max-w-3xl px-4 pb-8 lg:px-0 dark:bg-[#0d1117]",
        )}
      >
        <Header />
        {children}
      </body>
      <GoogleAnalytics gaId={String(process.env.GA4)} />
    </html>
  );
}
