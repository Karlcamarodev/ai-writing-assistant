import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Writing Assistant",
  description: "Asistente de escritura impulsado por IA: reescribe, resume y mejora tu texto con precisión profesional.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
