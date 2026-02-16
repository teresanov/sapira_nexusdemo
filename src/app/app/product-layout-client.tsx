"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/context/product-context";
import type { DraftStatus, IncidentType, IncidentSeverity, IncidentStatus } from "@/lib/models";

const DRAFT_STATUS_LABEL: Record<DraftStatus, string> = {
  draft: "Borrador",
  ready: "Listo",
  sent: "Enviado",
};

const INCIDENT_TYPE_LABEL: Record<IncidentType, string> = {
  missing_attachment: "Adjunto faltante",
  metadata_missing: "Metadatos faltantes",
  invalid_format: "Formato inválido",
  parse_error: "Error de análisis",
  mismatch_revision: "Revisión no coincide",
};

const INCIDENT_SEVERITY_LABEL: Record<IncidentSeverity, string> = {
  blocking: "Bloqueante",
  non_blocking: "No bloqueante",
};

const INCIDENT_STATUS_LABEL: Record<IncidentStatus, string> = {
  open: "Abierta",
  waiting_reply: "En espera",
  resolved: "Resuelta",
};

export function ProductLayoutClient({
  children
}: { children: React.ReactNode }) {
  const {
    drawerOpen,
    drawerType,
    drawerItem,
    drafts,
    updateDraft,
    sendDraft,
    closeDrawer,
    setFilter
  } = useProduct();
  const router = useRouter();

  const draft =
    drawerItem?.type === "draft"
      ? drafts.find((d) => d.draftId === drawerItem.data.draftId) ?? drawerItem.data
      : null;

  const [localSubject, setLocalSubject] = useState("");
  const [localBody, setLocalBody] = useState("");

  useEffect(() => {
    if (drawerItem?.type === "draft") {
      const d = drafts.find((x) => x.draftId === drawerItem.data.draftId) ?? drawerItem.data;
      setLocalSubject(d.subject);
      setLocalBody(d.body);
    }
  }, [drawerItem?.type, drawerItem?.data.draftId, drafts]);

  const handleOpenInLibrary = () => {
    if (drawerItem?.type === "email") {
      setFilter(drawerItem.data.projectId, drawerItem.data.revisionId);
      closeDrawer();
      router.push("/app/library");
    }
  };

  const handleViewDrafts = () => {
    if (drawerItem?.type === "email") {
      setFilter(drawerItem.data.projectId, drawerItem.data.revisionId);
      closeDrawer();
      router.push("/app/drafts");
    }
  };

  const handleViewIncidents = () => {
    if (drawerItem?.type === "email") {
      setFilter(drawerItem.data.projectId, drawerItem.data.revisionId);
      closeDrawer();
      router.push("/app/incidents");
    }
  };

  const handleProcessEmail = () => {
    if (drawerItem?.type === "email") {
      setFilter(drawerItem.data.projectId, drawerItem.data.revisionId);
      closeDrawer();
      router.push(`/app/process?emailId=${drawerItem.data.id}`);
    }
  };

  const handleSaveDraft = () => {
    if (drawerItem?.type !== "draft" || !draft) return;
    updateDraft(draft.draftId, { subject: localSubject, body: localBody });
    toast.success("Cambios guardados");
  };

  const handleSendDraft = () => {
    if (drawerItem?.type !== "draft" || !draft) return;
    sendDraft(draft.draftId);
    closeDrawer();
    toast.success(`Correo enviado a ${draft.supplierName}`);
  };

  return (
    <>
      <main className="flex-1 pb-10">{children}</main>

      <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
        <SheetContent side="right" className="flex flex-col">
          {drawerType === "inbox" && drawerItem?.type === "email" && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">Detalle del email</SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-4 overflow-auto text-sm">
                <dl className="space-y-2 text-neutral-700">
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">Remitente</dt>
                    <dd>{drawerItem.data.sender}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">Asunto</dt>
                    <dd>{drawerItem.data.subject}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">Proyecto / Revisión</dt>
                    <dd>{drawerItem.data.projectId} · {drawerItem.data.revisionId}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">Validación</dt>
                    <dd>{drawerItem.data.validationStatus === "valid" ? "Válido" : "Inválido"}</dd>
                  </div>
                  {drawerItem.data.attachments.length > 0 && (
                    <div>
                      <dt className="text-xs font-medium uppercase text-neutral-500">Adjuntos</dt>
                      <dd>{drawerItem.data.attachments.join(", ")}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-4 flex flex-col gap-2 border-t border-neutral-200 pt-4">
                  <p className="text-xs font-medium uppercase text-neutral-500">Acciones</p>
                  <Button
                    className="w-full justify-start"
                    onClick={handleProcessEmail}
                  >
                    Procesar este email
                  </Button>
                  <p className="text-[11px] text-neutral-500">
                    Revisar, validar adjunto, ver pedido, redactar borradores y enviar.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleOpenInLibrary}
                  >
                    Abrir en Biblioteca
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleViewDrafts}
                  >
                    Ver borradores
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleViewIncidents}
                  >
                    Ver incidencias
                  </Button>
                </div>
              </div>
            </>
          )}

          {drawerType === "library" && drawerItem?.type === "library" && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">
                  {"revisionId" in drawerItem.data
                    ? `Revisión ${(drawerItem.data as { revisionId: string }).revisionId}`
                    : `Proyecto ${(drawerItem.data as { id: string }).id}`}
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-4 overflow-auto text-sm text-neutral-700">
                {"revisionId" in drawerItem.data && (
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs font-medium uppercase text-neutral-500">Revisión</dt>
                      <dd>{(drawerItem.data as { revisionId: string; projectId: string }).revisionId}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase text-neutral-500">Proyecto</dt>
                      <dd>{(drawerItem.data as { projectId: string }).projectId}</dd>
                    </div>
                  </dl>
                )}
                {"name" in drawerItem.data && (
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs font-medium uppercase text-neutral-500">Proyecto</dt>
                      <dd>{(drawerItem.data as { id: string; name: string }).id} — {(drawerItem.data as { name: string }).name}</dd>
                    </div>
                  </dl>
                )}
              </div>
            </>
          )}

          {drawerType === "drafts" && drawerItem?.type === "draft" && draft && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">Borrador</SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-4 overflow-auto text-sm text-neutral-700">
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">Para</dt>
                    <dd>{draft.to}</dd>
                  </div>
                  {draft.status === "sent" ? (
                    <>
                      <div>
                        <dt className="text-xs font-medium uppercase text-neutral-500">Asunto</dt>
                        <dd>{draft.subject}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase text-neutral-500">Estado</dt>
                        <dd>{DRAFT_STATUS_LABEL[draft.status]}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase text-neutral-500">Proyecto · Revisión</dt>
                        <dd>{draft.projectId} · {draft.revisionId}</dd>
                      </div>
                      <div className="rounded border border-neutral-200 bg-neutral-50 p-3 text-xs whitespace-pre-wrap">
                        {draft.body}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <dt className="text-xs font-medium uppercase text-neutral-500">Asunto</dt>
                        <dd className="mt-1">
                          <input
                            type="text"
                            value={localSubject}
                            onChange={(e) => setLocalSubject(e.target.value)}
                            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                            placeholder="Asunto del correo"
                          />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase text-neutral-500">Cuerpo</dt>
                        <dd className="mt-1">
                          <textarea
                            value={localBody}
                            onChange={(e) => setLocalBody(e.target.value)}
                            rows={10}
                            className="w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                            placeholder="Cuerpo del correo"
                          />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase text-neutral-500">Estado</dt>
                        <dd>{DRAFT_STATUS_LABEL[draft.status]}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase text-neutral-500">Proyecto · Revisión</dt>
                        <dd>{draft.projectId} · {draft.revisionId}</dd>
                      </div>
                      <div className="mt-4 flex flex-col gap-2 border-t border-neutral-200 pt-4">
                        <Button
                          variant="outline"
                          className="w-full justify-center"
                          onClick={handleSaveDraft}
                        >
                          Guardar cambios
                        </Button>
                        <Button
                          className="w-full justify-center bg-neutral-900 text-white hover:bg-neutral-800"
                          onClick={handleSendDraft}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Enviar correo
                        </Button>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            </>
          )}

          {drawerType === "incidents" && drawerItem?.type === "incident" && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">Incidente</SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-4 overflow-auto text-sm text-neutral-700">
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">ID</dt>
                    <dd>{drawerItem.data.id}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">Tipo</dt>
                    <dd>{INCIDENT_TYPE_LABEL[drawerItem.data.type]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">Severidad</dt>
                    <dd>{INCIDENT_SEVERITY_LABEL[drawerItem.data.severity]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">Estado</dt>
                    <dd>{INCIDENT_STATUS_LABEL[drawerItem.data.status]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">Proyecto · Revisión</dt>
                    <dd>{drawerItem.data.projectId} · {drawerItem.data.revisionId}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-neutral-500">Recomendación</dt>
                    <dd className="mt-1 rounded border border-neutral-200 bg-neutral-50 p-2 text-xs">
                      {drawerItem.data.recommendedFix}
                    </dd>
                  </div>
                </dl>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
