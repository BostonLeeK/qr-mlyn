import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const eUkraineHead = localFont({
  src: [
    { path: "../../public/fonts/e-ukrainehead-bold.woff2", weight: "700" },
    { path: "../../public/fonts/e-ukrainehead-regular.woff2", weight: "400" },
  ],
  variable: "--font-head",
});

const eUkraine = localFont({
  src: [
    { path: "../../public/fonts/e-ukraine-light.woff2", weight: "300" },
    { path: "../../public/fonts/e-ukraine-regular.woff2", weight: "400" },
  ],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "MLYN — Каталог",
  description: "Каталог арт-проєктів",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body
        className={`${eUkraineHead.variable} ${eUkraine.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
