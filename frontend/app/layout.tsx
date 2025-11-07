import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seatly - Smart Seat Booking Platform",
  description: "Book your bus, matatu, or airplane seats with ease. Real-time seat selection and M-Pesa payment integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
