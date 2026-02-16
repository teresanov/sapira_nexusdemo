"use client";

import { useProduct } from "@/context/product-context";

export function ProductFilterSelectors() {
  const { projects, revisions, filter, setFilter, clearFilter } = useProduct();

  const revisionsForProject = filter.projectId
    ? revisions.filter((r) => r.projectId === filter.projectId)
    : revisions;

  const hasActiveFilter = filter.projectId !== null;

  return (
    <div className="flex flex-nowrap items-center gap-2 sm:gap-3 shrink-0">
      <span className="text-xs font-medium text-neutral-500 shrink-0">Filtrar por</span>

      <label className="flex flex-nowrap items-center gap-1.5 shrink-0">
        <span className="sr-only">Proyecto</span>
        <select
          value={filter.projectId ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) {
              clearFilter();
            } else {
              setFilter(v, null);
            }
          }}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          aria-label="Proyecto"
        >
          <option value="">Todos los proyectos</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-nowrap items-center gap-1.5 shrink-0">
        <span className="sr-only">Revisión</span>
        <select
          value={filter.revisionId ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (!filter.projectId) return;
            setFilter(filter.projectId, v || null);
          }}
          disabled={!filter.projectId}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 disabled:bg-neutral-100 disabled:text-neutral-400"
          aria-label="Revisión"
        >
          <option value="">Todas las revisiones</option>
          {revisionsForProject.map((r) => (
            <option key={`${r.projectId}-${r.revisionId}`} value={r.revisionId}>
              {r.revisionId}
            </option>
          ))}
        </select>
      </label>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={clearFilter}
          className="shrink-0 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Quitar filtro
        </button>
      )}
    </div>
  );
}
