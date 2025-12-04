import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Writing Assistant",
  description:
    "Asistente de escritura con IA para reescribir, resumir y expandir textos con una interfaz profesional.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
