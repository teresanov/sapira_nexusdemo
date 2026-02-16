"use client";

import { useRouter } from "next/navigation";
import { useDemo } from "@/context/demo-context";

export function Step1ReadEmail() {
  const router = useRouter();
  const { selectedEmail } = useDemo();

  if (!selectedEmail) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-900">
        <p className="mb-3 font-medium">
          No hay ningún email seleccionado para iniciar la demo.
        </p>
        <p className="mb-4">
          Vuelve a la bandeja de entrada simulada, elige un correo y pulsa
          &quot;Start demo&quot; para continuar.
        </p>
        <button
          type="button"
          onClick={() => router.push("/demo/inbox")}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Volver a la bandeja
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-neutral-900">
          Email seleccionado
        </h2>
        <dl className="grid gap-2 text-sm text-neutral-700">
          <div className="flex gap-2">
            <dt className="w-24 text-neutral-500">Remitente</dt>
            <dd className="flex-1">{selectedEmail.sender}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 text-neutral-500">Asunto</dt>
            <dd className="flex-1">{selectedEmail.subject}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 text-neutral-500">Fecha</dt>
            <dd className="flex-1">
              {new Date(selectedEmail.receivedAt).toLocaleString("es-ES")}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-neutral-900">
          Adjuntos
        </h3>
        {selectedEmail.attachments.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No se han encontrado archivos adjuntos.
          </p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
            {selectedEmail.attachments.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

