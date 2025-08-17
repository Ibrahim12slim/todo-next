import "./globals.css";
import { ReactNode } from "react";
import Header from "../components/header";

export const metadata = {
  title: "Todo App",
  description: "Full-stack Todo app with NestJS + Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Header />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
