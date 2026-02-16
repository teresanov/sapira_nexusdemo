"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useDemo } from "@/context/demo-context";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

export function Step3ValidateAttachment() {
  const router = useRouter();
  const { selectedEmail, setHasBlockingError } = useDemo();

  const [open, setOpen] = useState(false);
  const [hasError, setHasError] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [reason, setReason] = useState("");
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const emailId = selectedEmail?.id;
  const isAlex = emailId === "email-1"; // primer email: siempre OK
  const isLaura = emailId === "email-2"; // baseline: reintento falla → solicitar reenvío
  const isMaria = emailId === "email-3"; // revisión: reintento OK

  // Cada vez que cambia el email, reseteamos el estado según el caso
  useEffect(() => {
    if (!selectedEmail) {
      setHasError(true);
      setRetryCount(0);
      setReason("");
      setInfoMessage(null);
      return;
    }

    if (isAlex) {
      // alex.chen → adjunto válido desde el principio
      setHasError(false);
      setRetryCount(0);
      setReason("");
      setInfoMessage(null);
      return;
    }

    // laura / maria / otros → empezamos en error
    setHasError(true);
    setRetryCount(0);
    setReason("");
    setInfoMessage(null);
  }, [emailId, isAlex, selectedEmail]);

  // Mantener bloqueado el botón Continuar mientras haya error
  useEffect(() => {
    // Para Alex nunca bloqueamos el botón, aunque hasError esté en true
    setHasBlockingError(!isAlex && hasError);
    return () => setHasBlockingError(false);
  }, [hasError, isAlex, setHasBlockingError]);

  if (!selectedEmail) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-900">
        No hay email en contexto. Vuelve a la bandeja y selecciona uno para
        continuar.
      </div>
    );
  }

  // Caso Alex: adjunto válido desde el principio, sin mostrar error ni modal
  if (isAlex) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
          <CheckCircle2 className="h-5 w-5" />
          <p>
            El adjunto{" "}
            <span className="font-medium">
              {selectedEmail.attachments[0] ?? "Adjunto"}
            </span>{" "}
            ha sido validado correctamente.
          </p>
        </div>
        {infoMessage && (
          <p className="text-xs text-neutral-500">{infoMessage}</p>
        )}
      </div>
    );
  }

  // Cuando ya no hay error, mostramos la confirmación de validación correcta
  if (!hasError) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
          <CheckCircle2 className="h-5 w-5" />
          <p>
            El adjunto{" "}
            <span className="font-medium">
              {selectedEmail.attachments[0] ?? "Adjunto"}
            </span>{" "}
            ha sido validado correctamente.
          </p>
        </div>
        {infoMessage && (
          <p className="text-xs text-neutral-500">{infoMessage}</p>
        )}
      </div>
    );
  }

  // SOLO mostramos textarea + botón "Solicitar reenvío" cuando:
  // - es el email de Laura (email-2)
  // - y YA se ha intentado reintentar al menos una vez
  const showRequestUI = isLaura && retryCount > 0;

  const handleRetry = () => {
    // Caso ALEX: por seguridad, tratamos el reintento como éxito (no deberíamos llegar aquí)
    if (isAlex) {
      setHasError(false);
      setOpen(false);
      setInfoMessage("La validación se ha completado correctamente.");
      return;
    }

    // Caso LAURA: el reintento falla; solo entonces mostramos Solicitar reenvío
    if (isLaura) {
      if (retryCount === 0) {
        setRetryCount(1);
        setInfoMessage(
          "Tras reintentar, el adjunto sigue siendo inválido. Ahora puedes solicitar un nuevo archivo al remitente."
        );
        return;
      }
      // En siguientes reintentos no cambiamos el estado: el error persiste
      return;
    }

    // Caso MARIA: el reintento funciona a la primera
    if (isMaria) {
      setHasError(false);
      setOpen(false);
      setInfoMessage(
        "La validación se ha completado correctamente tras reintentar."
      );
      return;
    }

    // Caso GENERAL (otros emails): el reintento arregla el problema
    setHasError(false);
    setOpen(false);
    setInfoMessage("La validación se ha completado correctamente.");
  };

  const handleRequestResend = () => {
    // En un sistema real habría una llamada a backend; aquí lo simulamos
    console.log("Solicitud de reenvío de adjunto:", {
      emailId,
      reason
    });
    setOpen(false);
    setInfoMessage("Se ha enviado una solicitud de reenvío al remitente.");
    router.push("/demo/inbox");
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p>
            El adjunto no se ha podido validar. Revisa el archivo antes de
            continuar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border border-amber-300 bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-200"
        >
          Ver detalles
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Problema al validar el adjunto</SheetTitle>
          </SheetHeader>
          <div className="mt-3 space-y-3 text-sm text-neutral-700">
            <p>
              El archivo{" "}
              <span className="font-medium">
                {selectedEmail.attachments[0] ?? "Adjunto"}
              </span>{" "}
              no cumple el formato esperado (Excel/CSV con estructura de BOM).
            </p>
            <p>
              Para continuar con el proceso, puedes reintentar la validación o
              volver a la bandeja para solicitar un nuevo archivo al
              stakeholder.
            </p>

            {showRequestUI && (
              <div className="space-y-1 pt-2">
                <label className="text-sm font-medium text-neutral-700">
                  Mensaje para el remitente
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
                  placeholder="Ej. El archivo está corrupto o no incluye todas las columnas requeridas…"
                />
              </div>
            )}
          </div>
          <SheetFooter className="mt-6 gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setInfoMessage("Has vuelto a la bandeja de entrada.");
                router.push("/demo/inbox");
              }}
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Volver a la bandeja
            </button>

            {showRequestUI && (
              <button
                type="button"
                onClick={handleRequestResend}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Solicitar reenvío
              </button>
            )}

            <button
              type="button"
              onClick={handleRetry}
              className="rounded-md border border-emerald-400 bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200"
            >
              Reintentar validación
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
