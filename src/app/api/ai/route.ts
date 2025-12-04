import { NextResponse } from "next/server";

type Mode = "rewrite" | "expand" | "summarize";
type Tone = "neutral" | "professional" | "casual" | "creative";

/* ============================================================
   MOCK LOCAL (simula la respuesta de la IA)
   ============================================================ */

function mockAI(text: string, mode: Mode, tone: Tone): string {
  const trimmed = text.trim();
  if (!trimmed) return "Ingresa un texto para procesarlo.";

  if (mode === "summarize") {
    return `📝 Resumen (${tone}):\n\n${trimmed.slice(
      0,
      180
    )}...\n\n(Aquí iría el resumen real generado por la IA.)`;
  }

  if (mode === "expand") {
    return `📄 Expansión (${tone}):\n\n${trimmed}\n\n(Aquí la IA añadiría más contexto, ejemplos y detalles reales.)`;
  }

  // rewrite
  return `✨ Reescritura (${tone}):\n\n${trimmed}\n\n(Aquí la IA devolvería una versión reescrita con mejor estilo.)`;
}

/* ============================================================
   ENDPOINT PRINCIPAL /api/ai
   ============================================================ */

export async function POST(req: Request) {
  try {
    const { text, mode, tone } = (await req.json()) as {
      text?: string;
      mode?: Mode;
      tone?: Tone;
    };

    const safeText = String(text ?? "").trim();
    const safeMode: Mode = mode ?? "rewrite";
    const safeTone: Tone = tone ?? "neutral";

    if (!safeText) {
      return NextResponse.json(
        { error: "El campo 'text' es obligatorio." },
        { status: 400 }
      );
    }

    // Aquí usaríamos OpenAI en producción.
    const result = mockAI(safeText, safeMode, safeTone);

    return NextResponse.json({
      result,
      from: "mock" as const,
    });
  } catch (error) {
    console.error("Error en /api/ai:", error);
    return NextResponse.json(
      { error: "Error interno en el servidor de IA." },
      { status: 500 }
    );
  }
}
