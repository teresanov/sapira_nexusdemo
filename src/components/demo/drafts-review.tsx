"use client";

import { useEffect, useState } from "react";
import { useDemo } from "@/context/demo-context";
import type { EditableDraft } from "@/lib/models";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

type ViewMode = "grid" | "list";

export function DraftsReview() {
  const { drafts, ensureDraftsForStep8, updateDraft } = useDemo();
  const [openId, setOpenId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    ensureDraftsForStep8();
  }, [ensureDraftsForStep8]);

  const currentDraft = drafts.find((d) => d.draftId === openId);

  const openEditor = (d: EditableDraft) => {
    setOpenId(d.draftId);
    setEditSubject(d.subject);
    setEditBody(d.body);
  };

  const closeEditor = () => {
    setOpenId(null);
  };

  const handleSave = () => {
    if (openId) {
      updateDraft(openId, editSubject, editBody);
      closeEditor();
    }
  };

  if (drafts.length === 0) {
    return (
      <div className="rounded-md border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
        Cargando borradores…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-neutral-600">
          Revisa y edita los borradores por proveedor antes de continuar.
        </p>
        <div className="flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={
              viewMode === "list"
                ? "rounded-md bg-white px-2 py-1 font-medium text-neutral-900"
                : "rounded-md px-2 py-1 text-neutral-600 hover:bg-neutral-100"
            }
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={
              viewMode === "grid"
                ? "rounded-md bg-white px-2 py-1 font-medium text-neutral-900"
                : "rounded-md px-2 py-1 text-neutral-600 hover:bg-neutral-100"
            }
          >
            Cuadrícula
          </button>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid gap-3 sm:grid-cols-2"
            : "flex flex-col gap-3"
        }
      >
        {drafts.map((d) => (
          <div
            key={d.draftId}
            className="flex flex-col rounded-md border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-neutral-500">
                Destinatario
              </span>
              {d.isEdited && (
                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
                  Editado
                </span>
              )}
            </div>
            <p className="mb-1 truncate text-sm font-medium text-neutral-900">
              {d.to}
            </p>
            <p className="mb-3 line-clamp-2 text-sm text-neutral-600">
              {d.subject}
            </p>
            <button
              type="button"
              onClick={() => openEditor(d)}
              className="mt-auto rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Revisar y Editar
            </button>
          </div>
        ))}
      </div>

      <Sheet open={!!openId} onOpenChange={(open) => !open && closeEditor()}>
        <SheetContent side="right" className="flex flex-col">
          {currentDraft && (
            <>
              <SheetHeader>
                <SheetTitle>Borrador — {currentDraft.supplierName}</SheetTitle>
                <p className="text-sm text-neutral-500">{currentDraft.to}</p>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-4 overflow-hidden">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-neutral-700">
                    Asunto
                  </span>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
                  />
                </label>
                <label className="flex flex-1 flex-col gap-1.5 overflow-hidden">
                  <span className="text-sm font-medium text-neutral-700">
                    Cuerpo
                  </span>
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={12}
                    className="min-h-[200px] w-full resize-y rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
                  />
                </label>
              </div>
              <SheetFooter className="gap-2 sm:gap-0">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md border border-neutral-400 bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-300"
                >
                  Guardar Cambios
                </button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
