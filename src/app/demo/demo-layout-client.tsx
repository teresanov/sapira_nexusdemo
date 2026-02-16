"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDemo } from "@/context/demo-context";
import { cn } from "@/lib/utils";
import { StepIndicator } from "./step-indicator";

export function DemoLayoutClient({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isNextEnabled,
    currentStep,
    nextStep,
    resetRunner,
    mockSendCompleted,
    hasBlockingError,
    prevStep
  } = useDemo();

  const isRunner = pathname === "/demo/runner";
  const isInbox = pathname === "/demo/inbox";
  const isLastStep = isRunner && currentStep === 9;

  let buttonLabel = "Continuar";
  if (isInbox) {
    buttonLabel = "Start demo";
  } else if (isLastStep) {
    buttonLabel = mockSendCompleted ? "Finalizar Demo" : "Enviando…";
  }

  let canAdvance: boolean;
  if (isRunner) {
    if (!isLastStep) {
      // En runner, pasos 1–8 solo avanzan si no hay error bloqueante
      canAdvance = !hasBlockingError;
    } else {
      // En paso 9 solo avanzamos (finalizamos) cuando la simulación ha terminado
      canAdvance = mockSendCompleted;
    }
  } else if (isInbox) {
    canAdvance = isNextEnabled;
  } else {
    canAdvance = true;
  }

  const handleContinuar = () => {
    if (isInbox) {
      router.push("/demo/runner");
      return;
    }
    if (isRunner) {
      if (!isLastStep && !hasBlockingError) {
        nextStep();
      } else if (isLastStep && mockSendCompleted) {
        resetRunner();
        router.push("/");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white/90 backdrop-blur px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-black hover:text-neutral-600 transition-colors"
        >
          Proyecto Nexus
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            aria-label="Volver al inicio"
          >
            <Home className="h-4 w-4" />
            Inicio
          </Link>
          <span className="rounded-full border border-neutral-400 bg-neutral-100 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-neutral-800">
            Modo Asistente
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-[30%] shrink-0 border-r border-neutral-200 bg-neutral-50/80 p-6">
          {pathname === "/demo/runner" && <StepIndicator />}
          {pathname === "/demo/inbox" && (
            <div className="space-y-4 text-sm text-neutral-700">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Asistente guiado
                </p>
                <h2 className="mt-2 text-base font-semibold text-neutral-900">
                  Proyecto Nexus · Compras Asia
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  De email con BOM a correos a proveedores, en 9 pasos.
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Cómo usar esta demo
                </h3>
                <ol className="list-decimal space-y-1 pl-5">
                  <li>Elige un email en la bandeja simulada.</li>
                  <li>Pulsa <span className="font-medium">“Start demo”</span> para fijar proyecto y revisión.</li>
                  <li>Usa <span className="font-medium">“Continuar”</span> y <span className="font-medium">“Atrás”</span> para avanzar o revisar pasos.</li>
                </ol>
              </div>
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Qué vas a ver
                </h3>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Metadatos del proyecto y validación de adjuntos.</li>
                  <li>Deltas entre revisiones del BOM.</li>
                  <li>Plan de acción por proveedor (comprar / cancelar / Δ cantidad).</li>
                  <li>Borradores de email editables y envío simulado.</li>
                </ul>
              </div>
            </div>
          )}
          {pathname !== "/demo/runner" && pathname !== "/demo/inbox" && (
            <p className="text-sm text-neutral-500">
              Usa el asistente para recorrer el flujo de principio a fin.
            </p>
          )}
        </aside>
        <main className="min-h-0 flex-1 bg-neutral-100/80 p-6">
          {children}
        </main>
      </div>

      <footer className="sticky bottom-0 shrink-0 border-t border-neutral-200 bg-white px-6 py-4">
        <div className="flex justify-between gap-3">
          <button
            type="button"
            disabled={isInbox}
            onClick={() => {
              if (isRunner && currentStep > 1) {
                prevStep();
              } else if (isRunner && currentStep === 1) {
                router.push("/demo/inbox");
              }
            }}
            className={cn(
              "rounded-md border px-4 py-2 text-sm font-medium transition",
              isInbox
                ? "cursor-not-allowed border-neutral-300 bg-neutral-100 text-neutral-400"
                : "cursor-pointer border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
            )}
          >
            Atrás
          </button>

          <button
            type="button"
            disabled={!canAdvance}
            onClick={handleContinuar}
            className={cn(
              "rounded-md border px-5 py-2.5 text-sm font-medium transition",
              !canAdvance
                ? "cursor-not-allowed border-neutral-300 bg-neutral-100 text-neutral-400"
                : "cursor-pointer border-neutral-400 bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
            )}
          >
            {buttonLabel}
          </button>
        </div>
      </footer>
    </div>
  );
}
