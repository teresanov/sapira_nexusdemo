import Link from "next/link";
import { notFound } from "next/navigation";
import { mockProjects, mockRevisions } from "@/lib/mock-data";

interface ProjectDetailPageProps {
  params: { projectId: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = mockProjects.find((p) => p.id === params.projectId);

  if (!project) {
    return notFound();
  }

  const revisions = mockRevisions.filter(
    (r) => r.projectId === project.id
  );

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Proyecto
        </p>
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          {project.id} · {project.name}
        </h1>
      </div>

      <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-800">
        <p>
          Estado: <span className="font-medium">{project.status}</span>
        </p>
        <p className="text-xs text-neutral-500">
          Este proyecto está sincronizado con la bandeja simulada y el modo
          asistente. Cada revisión puede explorarse aquí o reproducirse en la
          demo guiada.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Revisiones
        </p>
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-neutral-50">
              <tr className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                <th className="px-4 py-3 text-left font-medium">Revisión</th>
                <th className="px-4 py-3 text-left font-medium">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Resumen de cambios
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {revisions.map((rev) => {
                const isBaseline = !rev.previousRevisionId;
                return (
                  <tr
                    key={rev.revisionId}
                    className="border-t border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3 align-middle">
                      <span className="text-xs font-medium tracking-[0.12em] text-neutral-900">
                        {rev.revisionId}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle text-xs">
                      {isBaseline ? (
                        <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-neutral-700 bg-neutral-50">
                          Baseline
                        </span>
                      ) : (
                        <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-neutral-700 bg-neutral-50">
                          Incremental
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle text-xs text-neutral-500">
                      {isBaseline ? (
                        <>Carga inicial de BOM para Asia build.</>
                      ) : (
                        <>
                          +{rev.diffSummary?.added ?? 0} / -
                          {rev.diffSummary?.removed ?? 0} / Δ
                          {rev.diffSummary?.qtyChanged ?? 0} líneas.
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle text-xs">
                      <Link
                        href={`/app/projects/${project.id}/revisions/${rev.revisionId}`}
                        className="rounded-sm border border-neutral-300 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-800 hover:bg-neutral-100"
                      >
                        Ver detalle BOM
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

