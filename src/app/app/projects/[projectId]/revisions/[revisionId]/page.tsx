import { notFound } from "next/navigation";
import {
  PROJECT_ID,
  mockBomLines,
  mockRevisions
} from "@/lib/mock-data";
import {
  computeBomDiffForRevision,
  getRevisionLineage
} from "@/lib/demo-engine";

interface RevisionDetailPageProps {
  params: { projectId: string; revisionId: string };
}

export default function RevisionDetailPage({
  params
}: RevisionDetailPageProps) {
  const { projectId, revisionId } = params;

  if (projectId !== PROJECT_ID) {
    return notFound();
  }

  const rev = mockRevisions.find(
    (r) => r.projectId === projectId && r.revisionId === revisionId
  );

  if (!rev) {
    return notFound();
  }

  const lineage = getRevisionLineage(projectId, revisionId, mockRevisions);
  const diff = computeBomDiffForRevision(revisionId);

  const added = diff.lines.filter((l) => l.diffFlag === "added").length;
  const removed = diff.lines.filter((l) => l.diffFlag === "removed").length;
  const qtyChanged = diff.lines.filter(
    (l) => l.diffFlag === "qty_changed"
  ).length;

  const isBaseline = !lineage.previousRevisionId;

  const visibleLines = mockBomLines.filter(
    (l) => l.projectId === projectId && l.revisionId === revisionId
  );

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Revisión
        </p>
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          {projectId} · {revisionId}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
        <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Contexto
          </p>
          {isBaseline ? (
            <p className="text-sm text-neutral-700">
              Esta revisión actúa como{" "}
              <span className="font-semibold">Baseline</span> para el
              proyecto. No hay revisión anterior, por lo que todo el
              contenido de la BOM se considera carga inicial.
            </p>
          ) : (
            <div className="space-y-2 text-sm text-neutral-700">
              <p>
                Reemplaza a{" "}
                <span className="font-semibold">
                  {lineage.previousRevisionId}
                </span>{" "}
                con cambios cuantificados en la tabla de la derecha.
              </p>
            </div>
          )}

          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <MetricPill label="Líneas nuevas" value={added} />
            <MetricPill label="Líneas canceladas" value={removed} />
            <MetricPill label="Ajustes de cantidad" value={qtyChanged} />
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            BOM normalizada
          </p>
          <div className="overflow-auto">
            <table className="min-w-full border-collapse text-xs">
              <thead className="bg-neutral-50">
                <tr className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  <th className="px-3 py-2 text-left font-medium">Línea</th>
                  <th className="px-3 py-2 text-left font-medium">Descripción</th>
                  <th className="px-3 py-2 text-left font-medium">Proveedor</th>
                  <th className="px-3 py-2 text-left font-medium">Qty</th>
                  <th className="px-3 py-2 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {visibleLines.map((line) => {
                  const diffFlag = diff.lines.find(
                    (d) => d.lineId === line.lineId
                  )?.diffFlag;
                  return (
                    <tr
                      key={line.lineId}
                      className="border-t border-neutral-200 text-neutral-800"
                    >
                      <td className="px-3 py-2 align-middle font-mono text-[11px] text-neutral-500">
                        {line.sapCode}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        {line.description}
                      </td>
                      <td className="px-3 py-2 align-middle text-neutral-400">
                        {line.supplierName}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        {line.qty} {line.uom}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <DiffBadge flag={diffFlag ?? "unchanged"} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricPill(props: { label: string; value: number }) {
  const { label, value } = props;
  return (
    <div className="space-y-1 rounded-lg border border-neutral-900 bg-neutral-950/80 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </p>
      <p className="text-lg font-semibold text-neutral-50">{value}</p>
    </div>
  );
}

function DiffBadge(props: { flag: "added" | "removed" | "qty_changed" | "unchanged" }) {
  const { flag } = props;
  if (flag === "added") {
    return (
      <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-emerald-300">
        Nuevo
      </span>
    );
  }
  if (flag === "removed") {
    return (
      <span className="rounded-full border border-rose-500/40 bg-rose-500/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-rose-300">
        Cancelado
      </span>
    );
  }
  if (flag === "qty_changed") {
    return (
      <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-amber-300">
        Qty Δ
      </span>
    );
  }
  return (
    <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
      Sin cambio
    </span>
  );
}

