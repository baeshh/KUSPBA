import type { Metadata, Viewport } from "next";
import "./globals.css";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata("home"),
  icons: {
    icon: "/logo-symbol.png",
    apple: "/logo-symbol.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/variable/pretendardvariable.css"
          crossOrigin="anonymous"
          as="style"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
