"use client";

import { useDemo } from "@/context/demo-context";
import { computeBomDiffForRevision } from "@/lib/demo-engine";
import { CURRENT_REVISION_ID } from "@/lib/mock-data";

export function Step7DeltaSummary() {
  const { selectedEmail } = useDemo();
  const revisionId = selectedEmail?.revisionId ?? CURRENT_REVISION_ID;
  const diff = computeBomDiffForRevision(revisionId);

  const added = diff.lines.filter((l) => l.diffFlag === "added");
  const removed = diff.lines.filter((l) => l.diffFlag === "removed");
  const qtyChanged = diff.lines.filter((l) => l.diffFlag === "qty_changed");

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-neutral-900">
          Resumen de delta entre revisiones
        </h2>
        <p className="text-sm text-neutral-700">
          Comparando la revisión actual con la anterior, se han detectado los
          siguientes cambios en el BOM.
        </p>
        <dl className="mt-3 grid gap-2 text-sm text-neutral-800 md:grid-cols-3">
          <div className="rounded-lg bg-neutral-50 px-3 py-2">
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Añadidos
            </dt>
            <dd className="text-lg font-semibold">{added.length}</dd>
          </div>
          <div className="rounded-lg bg-neutral-50 px-3 py-2">
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Eliminados
            </dt>
            <dd className="text-lg font-semibold">{removed.length}</dd>
          </div>
          <div className="rounded-lg bg-neutral-50 px-3 py-2">
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Cambios de cantidad
            </dt>
            <dd className="text-lg font-semibold">{qtyChanged.length}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Muestras de cambios
        </h3>
        <ul className="space-y-2 text-sm text-neutral-800">
          {added.slice(0, 2).map((l) => (
            <li key={"a-" + l.lineId}>
              <span className="font-medium">[Añadido]</span> {l.description} ·{" "}
              {l.qty} {l.uom}
            </li>
          ))}
          {removed.slice(0, 2).map((l) => (
            <li key={"r-" + l.lineId}>
              <span className="font-medium">[Eliminado]</span> {l.description} ·{" "}
              {l.oldQty ?? l.qty} {l.uom}
            </li>
          ))}
          {qtyChanged.slice(0, 2).map((l) => (
            <li key={"q-" + l.lineId}>
              <span className="font-medium">[Δ Cantidad]</span> {l.description} ·{" "}
              {l.oldQty} → {l.qty} {l.uom}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

