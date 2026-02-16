import Link from "next/link";
import { mockProjects } from "@/lib/mock-data";

export default function ProjectsIndexPage() {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          Proyectos
        </h1>
        <p className="text-sm text-neutral-500">
          Lista de proyectos activos basada en los datos mock del PRD.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-xs uppercase tracking-[0.16em] text-neutral-500">
              <th className="px-4 py-3 text-left font-medium">Proyecto</th>
              <th className="px-4 py-3 text-left font-medium">Nombre</th>
              <th className="px-4 py-3 text-left font-medium">Revisiones</th>
            </tr>
          </thead>
          <tbody>
            {mockProjects.map((project) => (
              <tr
                key={project.id}
                className="border-t border-neutral-200 text-neutral-800 hover:bg-neutral-50"
              >
                <td className="px-4 py-3 align-middle">
                  <Link
                    href={`/app/projects/${project.id}`}
                    className="text-xs font-medium tracking-[0.12em] text-neutral-900 underline-offset-4 hover:underline"
                  >
                    {project.id}
                  </Link>
                </td>
                <td className="px-4 py-3 align-middle text-sm">
                  {project.name}
                </td>
                <td className="px-4 py-3 align-middle text-xs text-neutral-500">
                  {project.revisions.length} revisiones
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

