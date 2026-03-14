import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kühlschrank Dashboard",
  description: "Überblick über Kühlschrankinhalte und Ablaufdaten",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">
            🧊 Kühlschrank Dashboard
          </h1>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
