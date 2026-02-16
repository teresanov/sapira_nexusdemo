"use client";

import { useState } from "react";
import { useProduct } from "@/context/product-context";
import { ProductFilterSelectors } from "@/components/product/product-filter-selectors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { DraftStatus } from "@/lib/models";

const DRAFT_STATUS_LABEL: Record<DraftStatus, string> = {
  draft: "Borrador",
  ready: "Listo",
  sent: "Enviado",
};

const PENDING_STATUS_OPTIONS: { value: "" | "draft" | "ready"; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "draft", label: "Borrador" },
  { value: "ready", label: "Listo" },
];

export default function DraftsPage() {
  const { drafts, filter, openDrawer, drawerItem } = useProduct();
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [pendingStatusFilter, setPendingStatusFilter] = useState<"" | "draft" | "ready">("");

  const filteredByProject = drafts.filter((d) => {
    if (filter.projectId && filter.revisionId) {
      return d.projectId === filter.projectId && d.revisionId === filter.revisionId;
    }
    if (filter.projectId) {
      return d.projectId === filter.projectId;
    }
    return true;
  });

  const pending = filteredByProject.filter((d) => d.status === "draft" || d.status === "ready");
  const history = filteredByProject.filter((d) => d.status === "sent");

  const filteredPending = pendingStatusFilter
    ? pending.filter((d) => d.status === pendingStatusFilter)
    : pending;

  const selectedId = drawerItem?.type === "draft" ? drawerItem.data.draftId : null;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold text-neutral-900">Borradores</h1>
        <p className="text-sm text-neutral-600">
          Borradores de email. Pendientes para editar o enviar; histórico de los ya enviados.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "history")} className="space-y-4">
        <TabsList className="grid w-full max-w-[280px] grid-cols-2">
          <TabsTrigger value="pending">
            Pendientes {pending.length > 0 && `(${pending.length})`}
          </TabsTrigger>
          <TabsTrigger value="history">
            Histórico {history.length > 0 && `(${history.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-0">
          <div className="flex flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 sm:px-4 sm:py-3">
            <ProductFilterSelectors />
            <span className="h-4 w-px bg-neutral-300 shrink-0" aria-hidden />
            <label className="flex flex-nowrap items-center gap-1.5 shrink-0">
              <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">Estado</span>
              <select
                value={pendingStatusFilter}
                onChange={(e) => setPendingStatusFilter((e.target.value || "") as "" | "draft" | "ready")}
                className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                aria-label="Filtrar por estado en pendientes"
              >
                {PENDING_STATUS_OPTIONS.map((o) => (
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
                  <th className="px-4 py-3 text-left">Destinatario</th>
                  <th className="px-4 py-3 text-left">Asunto</th>
                  <th className="px-4 py-3 text-left">Proyecto</th>
                  <th className="px-4 py-3 text-left">Revisión</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredPending.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-500">
                      No hay borradores pendientes.
                    </td>
                  </tr>
                ) : (
                  filteredPending.map((draft) => (
                    <tr
                      key={draft.draftId}
                      role="button"
                      tabIndex={0}
                      onClick={() => openDrawer("drafts", { type: "draft", data: draft })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openDrawer("drafts", { type: "draft", data: draft });
                        }
                      }}
                      className={cn(
                        "border-t border-neutral-200 text-neutral-800 cursor-pointer transition-colors",
                        selectedId === draft.draftId ? "bg-neutral-100" : "hover:bg-neutral-50"
                      )}
                    >
                      <td className="px-4 py-3 align-middle text-neutral-900">{draft.to}</td>
                      <td className="px-4 py-3 align-middle max-w-[220px] truncate" title={draft.subject}>
                        {draft.subject}
                      </td>
                      <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-700">
                        {draft.projectId}
                      </td>
                      <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-700">
                        {draft.revisionId}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            draft.status === "ready" && "bg-amber-100 text-amber-800",
                            draft.status === "draft" && "bg-neutral-100 text-neutral-700"
                          )}
                        >
                          {DRAFT_STATUS_LABEL[draft.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-0">
          <div className="flex flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 sm:px-4 sm:py-3">
            <ProductFilterSelectors />
          </div>
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-neutral-50">
                <tr className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                  <th className="px-4 py-3 text-left">Destinatario</th>
                  <th className="px-4 py-3 text-left">Asunto</th>
                  <th className="px-4 py-3 text-left">Proyecto</th>
                  <th className="px-4 py-3 text-left">Revisión</th>
                  <th className="px-4 py-3 text-left">Enviado</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-500">
                      No hay borradores en el histórico.
                    </td>
                  </tr>
                ) : (
                  history.map((draft) => (
                    <tr
                      key={draft.draftId}
                      role="button"
                      tabIndex={0}
                      onClick={() => openDrawer("drafts", { type: "draft", data: draft })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openDrawer("drafts", { type: "draft", data: draft });
                        }
                      }}
                      className={cn(
                        "border-t border-neutral-200 text-neutral-800 cursor-pointer transition-colors",
                        selectedId === draft.draftId ? "bg-neutral-100" : "hover:bg-neutral-50"
                      )}
                    >
                      <td className="px-4 py-3 align-middle text-neutral-900">{draft.to}</td>
                      <td className="px-4 py-3 align-middle max-w-[220px] truncate" title={draft.subject}>
                        {draft.subject}
                      </td>
                      <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-700">
                        {draft.projectId}
                      </td>
                      <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-700">
                        {draft.revisionId}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
                          {DRAFT_STATUS_LABEL[draft.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
