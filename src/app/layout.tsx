import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KUSPBA | 한국대학생제약바이오산업협회",
  description:
    "전국 유일의 대학생제약바이오산업협회. 세미나 신청, 교육 프로그램, 협회원 관리.",
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
