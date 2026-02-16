"use client";

import { useDemo } from "@/context/demo-context";
import { getRevisionLineage } from "@/lib/demo-engine";
import { CURRENT_REVISION_ID, PROJECT_ID, mockRevisions } from "@/lib/mock-data";

export function Step2ParseMetadata() {
  const { selectedEmail } = useDemo();

  if (!selectedEmail) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-900">
        No hay email en contexto. Vuelve a la bandeja y selecciona uno para
        continuar.
      </div>
    );
  }

  const projectId = selectedEmail.projectId ?? PROJECT_ID;
  const revisionId = selectedEmail.revisionId ?? CURRENT_REVISION_ID;
  const lineage = getRevisionLineage(projectId, revisionId, mockRevisions);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">
          Metadatos extraídos
        </h2>
        <dl className="grid gap-2 text-sm text-neutral-700">
          <div className="flex gap-2">
            <dt className="w-32 text-neutral-500">Project ID</dt>
            <dd className="flex-1">{selectedEmail.projectId}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-32 text-neutral-500">Revision ID</dt>
            <dd className="flex-1">{selectedEmail.revisionId}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-32 text-neutral-500">Fecha recepción</dt>
            <dd className="flex-1">
              {new Date(selectedEmail.receivedAt).toLocaleString("es-ES")}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-neutral-900">
          Lineage de revisión
        </h3>
        {lineage.previousRevisionId ? (
          <p className="text-sm text-neutral-700">
            La revisión{" "}
            <span className="font-medium">{lineage.currentRevisionId}</span>{" "}
            reemplaza a{" "}
            <span className="font-medium">{lineage.previousRevisionId}</span>{" "}
            para el proyecto{" "}
            <span className="font-medium">{lineage.projectId}</span>.
          </p>
        ) : (
          <p className="text-sm text-neutral-700">
            La revisión{" "}
            <span className="font-medium">{lineage.currentRevisionId}</span> es
            la baseline del proyecto{" "}
            <span className="font-medium">{lineage.projectId}</span>. No hay
            revisiones previas.
          </p>
        )}
      </div>
    </div>
  );
}

