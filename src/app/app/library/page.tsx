"use client";

import { useEffect, useState } from "react";
import { useProduct } from "@/context/product-context";
import { ProductFilterSelectors } from "@/components/product/product-filter-selectors";
import { cn } from "@/lib/utils";

const TYPE_OPTIONS: { value: "" | "baseline" | "incremental"; label: string }[] = [
  { value: "", label: "Todos los tipos" },
  { value: "baseline", label: "Baseline" },
  { value: "incremental", label: "Incremental" }
];

export default function LibraryPage() {
  const { revisions, filter, clearFilter, openDrawer, drawerItem } = useProduct();
  const [typeFilter, setTypeFilter] = useState<"" | "baseline" | "incremental">("");

  // Al entrar en Biblioteca no aplicar filtro por defecto: mostrar todo
  useEffect(() => {
    clearFilter();
  }, [clearFilter]);

  const filteredByProject = revisions.filter((r) => {
    if (filter.projectId && filter.revisionId) {
      return r.projectId === filter.projectId && r.revisionId === filter.revisionId;
    }
    if (filter.projectId) {
      return r.projectId === filter.projectId;
    }
    return true;
  });

  const filtered =
    typeFilter === "baseline"
      ? filteredByProject.filter((r) => !r.previousRevisionId)
      : typeFilter === "incremental"
        ? filteredByProject.filter((r) => !!r.previousRevisionId)
        : filteredByProject;

  const selectedRevision =
    drawerItem?.type === "library" && "revisionId" in drawerItem.data
      ? (drawerItem.data as { projectId: string; revisionId: string })
      : null;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold text-neutral-900">Biblioteca</h1>
        <p className="text-sm text-neutral-600">
          Proyectos y revisiones BOM. Selecciona una fila para ver el detalle.
        </p>
      </div>

      <div className="flex flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 sm:px-4 sm:py-3">
        <ProductFilterSelectors />
        <span className="h-4 w-px bg-neutral-300 shrink-0" aria-hidden />
        <label className="flex flex-nowrap items-center gap-1.5 shrink-0">
          <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">Tipo</span>
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter((e.target.value || "") as "" | "baseline" | "incremental")
            }
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            aria-label="Filtrar por tipo de revisión"
          >
            {TYPE_OPTIONS.map((o) => (
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
              <th className="px-4 py-3 text-left">Proyecto</th>
              <th className="px-4 py-3 text-left">Revisión</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Resumen de cambios</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rev) => {
              const isSelected =
                selectedRevision?.projectId === rev.projectId &&
                selectedRevision?.revisionId === rev.revisionId;
              return (
                <tr
                  key={`${rev.projectId}-${rev.revisionId}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => openDrawer("library", { type: "library", data: rev })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDrawer("library", { type: "library", data: rev });
                    }
                  }}
                  className={cn(
                    "border-t border-neutral-200 text-neutral-800 cursor-pointer transition-colors",
                    isSelected ? "bg-neutral-100" : "hover:bg-neutral-50"
                  )}
                >
                  <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-900">
                    {rev.projectId}
                  </td>
                  <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-900">
                    {rev.revisionId}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        rev.previousRevisionId
                          ? "bg-neutral-100 text-neutral-700"
                          : "bg-amber-100 text-amber-800"
                      )}
                    >
                      {rev.previousRevisionId ? "Incremental" : "Baseline"}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle text-xs text-neutral-600">
                    {rev.diffSummary
                      ? `+${rev.diffSummary.added} / −${rev.diffSummary.removed} / Δ${rev.diffSummary.qtyChanged}`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
