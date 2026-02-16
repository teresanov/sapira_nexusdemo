"use client";

import { useProduct } from "@/context/product-context";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const { emails, openDrawer, drawerItem } = useProduct();

  const selectedId = drawerItem?.type === "email" ? drawerItem.data.id : null;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold text-neutral-900">Bandeja de entrada</h1>
        <p className="text-sm text-neutral-600">
          Bandeja de emails. Selecciona una fila para ver el detalle y acceder a Biblioteca, Borradores o Incidencias.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              <th className="px-4 py-3 text-left">Remitente</th>
              <th className="px-4 py-3 text-left">Asunto</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Proyecto</th>
              <th className="px-4 py-3 text-left">Revisión</th>
              <th className="px-4 py-3 text-left">Validación</th>
              <th className="px-4 py-3 text-left">Adjuntos</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr
                key={email.id}
                role="button"
                tabIndex={0}
                onClick={() => openDrawer("inbox", { type: "email", data: email })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDrawer("inbox", { type: "email", data: email });
                  }
                }}
                className={cn(
                  "border-t border-neutral-200 text-neutral-800 transition-colors cursor-pointer",
                  selectedId === email.id
                    ? "bg-neutral-100"
                    : "hover:bg-neutral-50"
                )}
              >
                <td className="px-4 py-3 align-middle text-neutral-900">{email.sender}</td>
                <td className="px-4 py-3 align-middle max-w-[200px] truncate" title={email.subject}>
                  {email.subject}
                </td>
                <td className="px-4 py-3 align-middle text-neutral-600">
                  {new Date(email.receivedAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </td>
                <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-700">
                  {email.projectId}
                </td>
                <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-700">
                  {email.revisionId}
                </td>
                <td className="px-4 py-3 align-middle">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      email.validationStatus === "valid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    )}
                  >
                    {email.validationStatus === "valid" ? "Válido" : "Inválido"}
                  </span>
                </td>
                <td className="px-4 py-3 align-middle text-xs text-neutral-600">
                  {email.attachments.length > 0 ? email.attachments.join(", ") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
