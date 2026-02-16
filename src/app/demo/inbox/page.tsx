"use client";

import { useDemo } from "@/context/demo-context";
import { mockEmails } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function DemoInboxPage() {
  const { selectedEmail, setSelectedEmail, setNextEnabled } = useDemo();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">
        Bandeja de Entrada Simulada
      </h1>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/80">
              <th className="px-4 py-3 text-left font-medium text-neutral-700">
                Remitente
              </th>
              <th className="px-4 py-3 text-left font-medium text-neutral-700">
                Asunto
              </th>
              <th className="w-32 px-4 py-3 text-left font-medium text-neutral-700">
                Fecha
              </th>
              <th className="w-28 px-4 py-3 text-left font-medium text-neutral-700">
                Proyecto
              </th>
            </tr>
          </thead>
          <tbody>
            {mockEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              return (
                <tr
                  key={email.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedEmail(email);
                    setNextEnabled(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedEmail(email);
                      setNextEnabled(true);
                    }
                  }}
                  className={cn(
                    "border-b border-neutral-100 transition cursor-pointer",
                    isSelected
                      ? "bg-neutral-200"
                      : "hover:bg-neutral-100"
                  )}
                >
                  <td className="px-4 py-3 text-neutral-900">{email.sender}</td>
                  <td className="px-4 py-3 text-neutral-800">{email.subject}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatDate(email.receivedAt)}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {email.projectId}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
