"use client";

import { useMemo } from "react";
import { CURRENT_REVISION_ID, mockBomLines } from "@/lib/mock-data";

export function Step4NormalizeBom() {
  const lines = useMemo(
    () =>
      mockBomLines
        .filter((l) => l.revisionId === CURRENT_REVISION_ID)
        .slice(0, 6),
    []
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-neutral-900">
          Normalización de BOM completada
        </h2>
        <p className="text-sm text-neutral-700">
          El archivo adjunto se ha convertido a una tabla canónica de líneas
          BOM. Cada fila representa un ítem con código, descripción, UOM,
          cantidad, categoría y proveedor.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full table-fixed border-collapse text-xs md:text-sm">
          <thead className="bg-neutral-50/80">
            <tr className="border-b border-neutral-200">
              <th className="px-3 py-2 text-left font-medium text-neutral-700">
                Código
              </th>
              <th className="px-3 py-2 text-left font-medium text-neutral-700">
                Descripción
              </th>
              <th className="w-16 px-3 py-2 text-left font-medium text-neutral-700">
                UOM
              </th>
              <th className="w-20 px-3 py-2 text-right font-medium text-neutral-700">
                Cant.
              </th>
              <th className="w-24 px-3 py-2 text-left font-medium text-neutral-700">
                Proveedor
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr
                key={l.lineId + l.revisionId}
                className="border-b border-neutral-100"
              >
                <td className="px-3 py-2 text-neutral-800">{l.sapCode}</td>
                <td className="px-3 py-2 text-neutral-800">{l.description}</td>
                <td className="px-3 py-2 text-neutral-600">{l.uom}</td>
                <td className="px-3 py-2 text-right text-neutral-800">
                  {l.qty}
                </td>
                <td className="px-3 py-2 text-neutral-700">
                  {l.supplierName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

