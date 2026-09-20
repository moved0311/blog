import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Taiyi Dev",
  description: "關於 Taiyi 的投影片",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
