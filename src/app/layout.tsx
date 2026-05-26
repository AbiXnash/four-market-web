import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "four-market-web",
  description: "Four Market Web Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
