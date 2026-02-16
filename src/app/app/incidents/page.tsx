"use client";

import { useState } from "react";
import { useProduct } from "@/context/product-context";
import { ProductFilterSelectors } from "@/components/product/product-filter-selectors";
import { cn } from "@/lib/utils";
import type { IncidentStatus, IncidentSeverity, IncidentType } from "@/lib/models";

const STATUS_OPTIONS: { value: "" | IncidentStatus; label: string }[] = [
  { value: "", label: "Todos los estados" },
  { value: "open", label: "Abierta" },
  { value: "waiting_reply", label: "En espera" },
  { value: "resolved", label: "Resuelta" }
];

const SEVERITY_OPTIONS: { value: "" | IncidentSeverity; label: string }[] = [
  { value: "", label: "Todas las severidades" },
  { value: "blocking", label: "Bloqueante" },
  { value: "non_blocking", label: "No bloqueante" }
];

const INCIDENT_TYPE_LABEL: Record<IncidentType, string> = {
  missing_attachment: "Adjunto faltante",
  metadata_missing: "Metadatos faltantes",
  invalid_format: "Formato inválido",
  parse_error: "Error de análisis",
  mismatch_revision: "Revisión no coincide",
};

const INCIDENT_SEVERITY_LABEL: Record<IncidentSeverity, string> = {
  blocking: "Bloqueante",
  non_blocking: "No bloqueante",
};

const INCIDENT_STATUS_LABEL: Record<IncidentStatus, string> = {
  open: "Abierta",
  waiting_reply: "En espera",
  resolved: "Resuelta",
};

export default function IncidentsPage() {
  const { incidents, filter, openDrawer, drawerItem } = useProduct();
  const [statusFilter, setStatusFilter] = useState<"" | IncidentStatus>("");
  const [severityFilter, setSeverityFilter] = useState<"" | IncidentSeverity>("");

  const filteredByProject = incidents.filter((i) => {
    if (filter.projectId && filter.revisionId) {
      return i.projectId === filter.projectId && i.revisionId === filter.revisionId;
    }
    if (filter.projectId) {
      return i.projectId === filter.projectId;
    }
    return true;
  });

  let filtered = filteredByProject;
  if (statusFilter) filtered = filtered.filter((i) => i.status === statusFilter);
  if (severityFilter) filtered = filtered.filter((i) => i.severity === severityFilter);

  const selectedId = drawerItem?.type === "incident" ? drawerItem.data.id : null;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold text-neutral-900">Incidencias</h1>
        <p className="text-sm text-neutral-600">
          Incidencias. Selecciona una fila para ver el detalle y la recomendación.
        </p>
      </div>

      <div className="flex flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 sm:px-4 sm:py-3">
        <ProductFilterSelectors />
        <span className="h-4 w-px bg-neutral-300 shrink-0" aria-hidden />
        <label className="flex flex-nowrap items-center gap-1.5 shrink-0">
          <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">Estado</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter((e.target.value || "") as "" | IncidentStatus)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            aria-label="Filtrar por estado de la incidencia"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-nowrap items-center gap-1.5 shrink-0">
          <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">Severidad</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter((e.target.value || "") as "" | IncidentSeverity)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            aria-label="Filtrar por severidad"
          >
            {SEVERITY_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Severidad</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Proyecto</th>
              <th className="px-4 py-3 text-left">Revisión</th>
              <th className="px-4 py-3 text-left">Recomendación (resumen)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((incident) => (
              <tr
                key={incident.id}
                role="button"
                tabIndex={0}
                onClick={() => openDrawer("incidents", { type: "incident", data: incident })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDrawer("incidents", { type: "incident", data: incident });
                  }
                }}
                className={cn(
                  "border-t border-neutral-200 text-neutral-800 cursor-pointer transition-colors",
                  selectedId === incident.id ? "bg-neutral-100" : "hover:bg-neutral-50"
                )}
              >
                <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-900">
                  {incident.id}
                </td>
                <td className="px-4 py-3 align-middle text-xs text-neutral-700">
                  {INCIDENT_TYPE_LABEL[incident.type]}
                </td>
                <td className="px-4 py-3 align-middle">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      incident.severity === "blocking"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {INCIDENT_SEVERITY_LABEL[incident.severity]}
                  </span>
                </td>
                <td className="px-4 py-3 align-middle text-xs text-neutral-700">
                  {INCIDENT_STATUS_LABEL[incident.status]}
                </td>
                <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-700">
                  {incident.projectId}
                </td>
                <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-700">
                  {incident.revisionId}
                </td>
                <td className="px-4 py-3 align-middle max-w-[240px] truncate text-xs text-neutral-600" title={incident.recommendedFix}>
                  {incident.recommendedFix}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
