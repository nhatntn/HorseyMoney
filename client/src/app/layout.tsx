import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Horsey Money | Mã Đáo Phát Bao",
  description: "Race your horse to win lucky Tet envelopes! Tap to run, finish first for the biggest prize.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="envelope-pattern min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
