"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useDemo } from "@/context/demo-context";
import { cn } from "@/lib/utils";

type DraftStatus = "pending" | "sending" | "sent";

export function MockSendTimeline() {
  const { drafts, setMockSendCompleted } = useDemo();
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Reiniciar estado de envío al entrar en el paso 9
    setMockSendCompleted(false);
    setDone(false);
    setIndex(0);

    if (drafts.length === 0) return;

    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      if (i <= drafts.length) {
        setIndex(i);
      }
      if (i >= drafts.length) {
        clearInterval(timer);
        setDone(true);
        setMockSendCompleted(true);
      }
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, [drafts, setMockSendCompleted]);

  const statusFor = (idx: number): DraftStatus => {
    if (done) return "sent";
    if (idx < index) return "sent";
    if (idx === index) return "sending";
    return "pending";
  };

  if (drafts.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
        No hay borradores generados para enviar.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-neutral-900">
          Simulación de envío de correos a proveedores
        </h2>
        <p className="text-sm text-neutral-600">
          El sistema está simulando el envío de los correos, uno por proveedor.
        </p>
      </div>

      <ul className="space-y-3">
        {drafts.map((d, idx) => {
          const status = statusFor(idx);

          return (
            <li
              key={d.draftId}
              className="flex items-start justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm"
            >
              <div className="space-y-1">
                <p className="font-medium text-neutral-900">
                  {d.supplierName}
                </p>
                <p className="text-xs text-neutral-500">{d.to}</p>
                {d.isEdited && (
                  <p className="text-xs text-amber-700">
                    Enviado con cambios personalizados
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={status} />
                <span
                  className={cn(
                    "text-xs font-medium",
                    status === "pending" && "text-neutral-500",
                    status === "sending" && "text-neutral-700",
                    status === "sent" && "text-emerald-700"
                  )}
                >
                  {status === "pending" && "Pendiente"}
                  {status === "sending" && "Enviando…"}
                  {status === "sent" && "Enviado"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {done && (
        <div className="mt-4 flex flex-col items-center gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-5 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          <h3 className="text-lg font-semibold text-emerald-900">
            ¡Proceso Completado!
          </h3>
          <p className="text-sm text-emerald-800">
            Todos los correos han sido enviados correctamente en la simulación.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-2 rounded-lg border border-emerald-400 bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200"
          >
            Volver al Inicio
          </button>
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: DraftStatus }) {
  if (status === "sending") {
    return (
      <Loader2 className="h-4 w-4 animate-spin text-neutral-500" aria-hidden />
    );
  }
  if (status === "sent") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden />;
  }
  return <Clock className="h-4 w-4 text-neutral-400" aria-hidden />;
}

