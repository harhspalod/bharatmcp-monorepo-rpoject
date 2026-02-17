import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BharatMCP — AI-Powered Action Chatbots",
  description:
    "Give any website an AI chatbot that can actually DO things — not just answer questions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
