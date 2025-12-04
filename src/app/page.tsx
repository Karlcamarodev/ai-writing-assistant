"use client";

import { useState } from "react";

type Tone = "neutral" | "professional" | "casual" | "creative";
type Mode = "rewrite" | "expand" | "summarize";

interface HistoryItem {
  id: string;
  mode: Mode;
  tone: Tone;
  input: string;
  output: string;
  from: "mock" | "openai";
  createdAt: string;
}

const MODES: { id: Mode; label: string; description: string }[] = [
  {
    id: "rewrite",
    label: "Reescribir",
    description: "Mejora claridad y estilo sin cambiar el significado.",
  },
  {
    id: "expand",
    label: "Expandir",
    description: "Añade contexto, ejemplos y más detalles.",
  },
  {
    id: "summarize",
    label: "Resumir",
    description: "Reduce el texto manteniendo las ideas clave.",
  },
];

const TONES: { id: Tone; label: string }[] = [
  { id: "neutral", label: "Neutro" },
  { id: "professional", label: "Profesional" },
  { id: "casual", label: "Casual" },
  { id: "creative", label: "Creativo" },
];

export default function HomePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("rewrite");
  const [tone, setTone] = useState<Tone>("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastSource, setLastSource] =
    useState<"mock" | "openai" | null>(null);

  // Ejecutar IA
  const handleRun = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Escribe algún texto para que la IA pueda trabajar.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setLastSource(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, mode, tone }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data?.error ?? "No se pudo procesar la solicitud.";
        throw new Error(message);
      }

      const data = (await res.json()) as {
        result: string;
        from: "mock" | "openai";
      };

      setOutput(data.result);
      setLastSource(data.from);

      const item: HistoryItem = {
        id: crypto.randomUUID(),
        input: trimmed,
        output: data.result,
        mode,
        tone,
        from: data.from,
        createdAt: new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setHistory((prev) => [item, ...prev].slice(0, 20));
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido con la IA."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Copiar salida
  const handleCopyOutput = async () => {
    if (!output.trim()) return;
    try {
      await navigator.clipboard.writeText(output);
      setError("Texto copiado.");
      setTimeout(() => setError(null), 1500);
    } catch {
      setError("No se pudo copiar.");
      setTimeout(() => setError(null), 1500);
    }
  };

  // Cargar historial
  const handleLoadFromHistory = (item: HistoryItem) => {
    setInput(item.input);
    setOutput(item.output);
    setMode(item.mode);
    setTone(item.tone);
  };

  const currentModeConfig = MODES.find((m) => m.id === mode)!;

  return (
    <main className="space-y-6 lg:space-y-8">
      {/* HEADER */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-sky-500 to-emerald-400 shadow-lg">
            <span className="text-sm font-black tracking-tight text-slate-950">
              AI
            </span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">AI Writing Assistant</h1>
            <p className="text-xs text-slate-400">
              Reescribe, resume y expande texto con IA.
            </p>
          </div>
        </div>

        {lastSource && (
          <div className="text-xs text-slate-400">
            Motor activo:{" "}
            <span className="text-sky-400 font-medium">
              {lastSource === "mock" ? "Mock local" : "OpenAI"}
            </span>
          </div>
        )}
      </header>

      {/* GRID PRINCIPAL */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* PANEL IZQUIERDO */}
        <section className="card p-4 space-y-4">
          {/* CONTROLES */}
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-semibold">Configuración</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-3 py-1.5 text-xs rounded-full transition ${
                    mode === m.id
                      ? "bg-sky-500 text-slate-900 font-semibold shadow"
                      : "bg-slate-800/60 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  {m.label}
                </button>
              ))}

              <select
                className="bg-slate-900 border border-slate-700 rounded-full px-3 py-1.5 text-xs text-white"
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
              >
                {TONES.map((t) => (
                  <option key={t.id} value={t.id}>
                    Tono: {t.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {currentModeConfig.description}
            </p>
          </div>

          {/* EDITORES */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* ENTRADA */}
            <div>
              <label className="block mb-1 text-xs text-slate-300">
                Texto de entrada
              </label>
              <textarea
                className="w-full min-h-[180px] rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe o pega aquí tu texto..."
              />
            </div>

            {/* SALIDA */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-300">
                  Resultado IA
                </label>
                <button
                  onClick={handleCopyOutput}
                  className="text-[11px] text-slate-300 hover:text-white"
                >
                  Copiar
                </button>
              </div>

              <textarea
                className="w-full min-h-[180px] rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Aquí aparecerá el resultado..."
              />
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleRun}
              disabled={isLoading}
              className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-900 rounded-full text-xs font-semibold disabled:opacity-50"
            >
              {isLoading ? "Procesando..." : "Ejecutar IA"}
            </button>

            <button
              onClick={() => {
                setInput("");
                setOutput("");
              }}
              className="px-3 py-1.5 border border-slate-700 text-xs rounded-full text-slate-300 hover:bg-slate-800"
            >
              Limpiar
            </button>

            {error && (
              <span className="text-xs text-sky-300">{error}</span>
            )}
          </div>
        </section>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          {/* PRESETS */}
          <div className="card p-4 space-y-3">
            <h3 className="text-sm font-semibold">Presets rápidos</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setMode("rewrite");
                  setTone("professional");
                }}
                className="bg-slate-900 rounded-lg p-2 hover:bg-slate-800"
              >
                Email profesional
              </button>

              <button
                onClick={() => {
                  setMode("expand");
                  setTone("creative");
                }}
                className="bg-slate-900 rounded-lg p-2 hover:bg-slate-800"
              >
                Historia creativa
              </button>

              <button
                onClick={() => {
                  setMode("summarize");
                  setTone("neutral");
                }}
                className="bg-slate-900 rounded-lg p-2 hover:bg-slate-800"
              >
                Resumen ejecutivo
              </button>

              <button
                onClick={() => {
                  setMode("rewrite");
                  setTone("casual");
                }}
                className="bg-slate-900 rounded-lg p-2 hover:bg-slate-800"
              >
                Mensaje casual
              </button>
            </div>
          </div>

          {/* HISTORIAL */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Historial</h3>
              <button
                onClick={() => setHistory([])}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Limpiar
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500">
                No hay historial aún.
              </p>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-auto">
                {history.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleLoadFromHistory(h)}
                    className="w-full text-left bg-slate-900 p-2 rounded-lg hover:bg-slate-800"
                  >
                    <p className="text-[11px] text-slate-400">
                      {h.createdAt} · {h.mode} · {h.tone}
                    </p>
                    <p className="text-xs text-slate-200 line-clamp-2">
                      {h.output}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-[11px] text-slate-500">
        AI Writing Assistant · Next.js 16 + React 19 + TypeScript + Tailwind CSS
      </footer>
    </main>
  );
}
