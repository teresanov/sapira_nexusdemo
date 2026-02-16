"use client";

import { useDemo } from "@/context/demo-context";
import { getRevisionLineage } from "@/lib/demo-engine";
import { CURRENT_REVISION_ID, PROJECT_ID, mockRevisions } from "@/lib/mock-data";

export function Step5Lineage() {
  const { selectedEmail } = useDemo();
  const revisionId = selectedEmail?.revisionId ?? CURRENT_REVISION_ID;
  const projectId = selectedEmail?.projectId ?? PROJECT_ID;

  const lineage = getRevisionLineage(projectId, revisionId, mockRevisions);
  const current = mockRevisions.find(
    (r) =>
      r.projectId === projectId && r.revisionId === lineage.currentRevisionId
  );
  const previous = lineage.previousRevisionId
    ? mockRevisions.find(
        (r) =>
          r.projectId === projectId &&
          r.revisionId === lineage.previousRevisionId
      )
    : undefined;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-neutral-900">
          Lineage de revisiones
        </h2>
        <p className="text-sm text-neutral-700">
          Se ha identificado qué revisión reemplaza a cuál para el proyecto{" "}
          <span className="font-medium">{lineage.projectId}</span>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Revisión actual
          </h3>
          <p className="text-sm font-medium text-neutral-900">
            {lineage.currentRevisionId}
          </p>
          {!previous && (
            <p className="mt-1 inline-flex items-center rounded-lg bg-neutral-100 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-neutral-600">
              Baseline
            </p>
          )}
          {current?.diffSummary && (
            <DiffSummary diff={current.diffSummary} />
          )}
        </div>

        {previous && (
          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Revisión anterior
            </h3>
            <p className="text-sm font-medium text-neutral-900">
              {previous.revisionId}
            </p>
            {previous.diffSummary && (
              <DiffSummary diff={previous.diffSummary} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DiffSummary({
  diff
}: {
  diff: { added: number; removed: number; qtyChanged: number };
}) {
  return (
    <dl className="mt-3 space-y-1 text-xs text-neutral-700">
      <div className="flex justify-between">
        <dt className="text-neutral-500">Añadidos</dt>
        <dd className="font-medium">{diff.added}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-neutral-500">Eliminados</dt>
        <dd className="font-medium">{diff.removed}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-neutral-500">Cambios de cantidad</dt>
        <dd className="font-medium">{diff.qtyChanged}</dd>
      </div>
    </dl>
  );
}

