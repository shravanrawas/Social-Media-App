import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({subsets: ['latin']});

export const metadata = {
  title: "Socialo - Connect with world",
  description: "social media for everyone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
