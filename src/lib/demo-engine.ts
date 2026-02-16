import type {
  BomLine,
  BomRevisionSummary,
  EditableDraft,
  SupplierActionPlan,
  SupplierActionPlanCounts
} from "./models";
import {
  BASE_REVISION_ID,
  CURRENT_REVISION_ID,
  PROJECT_ID,
  SUPPLIER_EMAILS,
  mockBomLines,
  mockRevisions
} from "./mock-data";

export interface RevisionLineage {
  projectId: string;
  currentRevisionId: string;
  previousRevisionId?: string;
  currentRevision?: BomRevisionSummary;
  previousRevision?: BomRevisionSummary;
}

export function getDefaultRevisionLineage(): RevisionLineage {
  return getRevisionLineage(PROJECT_ID, CURRENT_REVISION_ID, mockRevisions);
}

export function getRevisionLineage(
  projectId: string,
  revisionId: string,
  revisions: BomRevisionSummary[]
): RevisionLineage {
  const currentRevision = revisions.find(
    (r) => r.projectId === projectId && r.revisionId === revisionId
  );
  const previousRevisionId = currentRevision?.previousRevisionId;
  const previousRevision = revisions.find(
    (r) => r.projectId === projectId && r.revisionId === previousRevisionId
  );

  return {
    projectId,
    currentRevisionId: revisionId,
    previousRevisionId: previousRevision?.revisionId,
    currentRevision,
    previousRevision
  };
}

export interface BomDiffResult {
  projectId: string;
  previousRevisionId?: string;
  currentRevisionId: string;
  lines: BomLine[];
}

export function computeBomDiffForDefaultContext(): BomDiffResult {
  return computeBomDiffForRevision(CURRENT_REVISION_ID);
}

// Calcula el diff para una revisión concreta, usando su lineage.
export function computeBomDiffForRevision(revisionId: string): BomDiffResult {
  const lineage = getRevisionLineage(PROJECT_ID, revisionId, mockRevisions);
  const previousRevisionId = lineage.previousRevisionId;

  return computeBomDiff({
    projectId: PROJECT_ID,
    previousRevisionId,
    currentRevisionId: revisionId,
    allLines: mockBomLines
  });
}

export function computeBomDiff(params: {
  projectId: string;
  previousRevisionId?: string;
  currentRevisionId: string;
  allLines: BomLine[];
}): BomDiffResult {
  const { projectId, previousRevisionId, currentRevisionId, allLines } = params;

  const currentLines = allLines.filter(
    (l) =>
      l.projectId === projectId && l.revisionId === currentRevisionId
  );

  const previousLines = previousRevisionId
    ? allLines.filter(
        (l) => l.projectId === projectId && l.revisionId === previousRevisionId
      )
    : [];

  const previousByLineId = new Map(
    previousLines.map((line) => [line.lineId, line])
  );

  const mergedLines: BomLine[] = currentLines.map((current) => {
    const previous = previousByLineId.get(current.lineId);

    if (!previous) {
      return { ...current, diffFlag: "added" };
    }

    if (current.qty !== previous.qty) {
      return {
        ...current,
        oldQty: previous.qty,
        diffFlag: "qty_changed"
      };
    }

    return {
      ...current,
      oldQty: previous.qty,
      diffFlag: "unchanged"
    };
  });

  // Detect removed lines (present in previous but not in current)
  for (const prev of previousLines) {
    const stillExists = currentLines.some(
      (line) => line.lineId === prev.lineId
    );
    if (!stillExists) {
      mergedLines.push({
        ...prev,
        revisionId: currentRevisionId,
        qty: 0,
        oldQty: prev.qty,
        diffFlag: "removed"
      });
    }
  }

  return {
    projectId,
    previousRevisionId,
    currentRevisionId,
    lines: mergedLines
  };
}

export interface PurchaseActionPlan {
  projectId: string;
  revisionId: string;
  suppliers: SupplierActionPlan[];
}

export function buildPurchaseActionPlan(
  diff: BomDiffResult
): PurchaseActionPlan {
  const bySupplier = new Map<string, SupplierActionPlan>();

  for (const line of diff.lines) {
    const key = line.supplierId;
    if (!bySupplier.has(key)) {
      const plan: SupplierActionPlan = {
        supplierId: line.supplierId,
        supplierName: line.supplierName,
        projectId: line.projectId,
        revisionId: line.revisionId,
        toBuy: [],
        toCancel: [],
        qtyChanged: [],
        counts: { toBuy: 0, toCancel: 0, qtyChanged: 0 },
        categoriesInvolved: []
      };
      bySupplier.set(key, plan);
    }

    const plan = bySupplier.get(key)!;

    switch (line.diffFlag) {
      case "added":
        plan.toBuy.push(line);
        plan.counts.toBuy += 1;
        break;
      case "removed":
        plan.toCancel.push(line);
        plan.counts.toCancel += 1;
        break;
      case "qty_changed":
        plan.qtyChanged.push(line);
        plan.counts.qtyChanged += 1;
        break;
      default:
        break;
    }

    if (!plan.categoriesInvolved.includes(line.categoryId)) {
      plan.categoriesInvolved.push(line.categoryId);
    }
  }

  return {
    projectId: diff.projectId,
    revisionId: diff.currentRevisionId,
    suppliers: Array.from(bySupplier.values())
  };
}

export function summarizeSupplierCounts(
  plan: PurchaseActionPlan
): SupplierActionPlanCounts {
  return plan.suppliers.reduce(
    (acc, supplierPlan) => ({
      toBuy: acc.toBuy + supplierPlan.counts.toBuy,
      toCancel: acc.toCancel + supplierPlan.counts.toCancel,
      qtyChanged: acc.qtyChanged + supplierPlan.counts.qtyChanged
    }),
    { toBuy: 0, toCancel: 0, qtyChanged: 0 }
  );
}

// --- Plan por proveedor para UI (Paso 6) ---

export interface SupplierPlanItem {
  supplierId: string;
  supplierName: string;
  to: string;
  toBuy: BomLine[];
  toCancel: BomLine[];
  qtyChanges: {
    line: BomLine;
    oldQty: number;
    newQty: number;
    delta: number;
  }[];
  summary: string;
}

export function getPurchasePlan(revisionId: string): SupplierPlanItem[] {
  // Usamos el lineage para comparar la revisión actual contra su anterior.
  const lineage = getRevisionLineage(PROJECT_ID, revisionId, mockRevisions);
  const previousRevisionId = lineage.previousRevisionId;

  const diff = computeBomDiff({
    projectId: PROJECT_ID,
    previousRevisionId,
    currentRevisionId: revisionId,
    allLines: mockBomLines
  });
  const plan = buildPurchaseActionPlan(diff);

  return plan.suppliers.map((s) => {
    const qtyChanges = s.qtyChanged.map((line) => ({
      line,
      oldQty: line.oldQty ?? 0,
      newQty: line.qty,
      delta: line.qty - (line.oldQty ?? 0)
    }));
    const parts: string[] = [];
    if (s.counts.toBuy > 0) parts.push(`Comprar ${s.counts.toBuy}`);
    if (s.counts.toCancel > 0) parts.push(`Cancelar ${s.counts.toCancel}`);
    if (s.counts.qtyChanged > 0) parts.push(`Cambios ${s.counts.qtyChanged}`);
    const summary =
      parts.length > 0
        ? `Plan recomendado: ${parts.join(", ")}. Categorías: ${s.categoriesInvolved.join(", ")}.`
        : "Sin cambios para este proveedor.";

    return {
      supplierId: s.supplierId,
      supplierName: s.supplierName,
      to: SUPPLIER_EMAILS[s.supplierId] ?? `${s.supplierId.toLowerCase()}@supplier.com`,
      toBuy: s.toBuy,
      toCancel: s.toCancel,
      qtyChanges,
      summary
    };
  });
}

/** Genera borradores editables a partir del plan por proveedor (Paso 8). */
export function generateDraftsFromPlan(
  plan: SupplierPlanItem[],
  projectId: string,
  revisionId: string
): EditableDraft[] {
  return plan.map((p, index) => {
    const sections: string[] = [];

    if (p.qtyChanges.length > 0) {
      const lines = p.qtyChanges
        .map(
          (c) =>
            `• ${c.line.description}: ${c.oldQty} → ${c.newQty} ${c.line.uom}`
        )
        .join("\n");
      sections.push(`A) Actualización de Cantidades:\n${lines}`);
    }
    if (p.toCancel.length > 0) {
      const lines = p.toCancel
        .map((l) => `• ${l.description}: ${l.oldQty ?? l.qty} ${l.uom} (cancelar)`)
        .join("\n");
      sections.push(`B) Cancelaciones:\n${lines}`);
    }
    if (p.toBuy.length > 0) {
      const lines = p.toBuy
        .map((l) => `• ${l.description}: ${l.qty} ${l.uom}`)
        .join("\n");
      sections.push(`C) Nuevos Pedidos:\n${lines}`);
    }

    const body =
      sections.length > 0
        ? `Estimado proveedor,\n\nPara el proyecto ${projectId}, revisión ${revisionId}:\n\n${sections.join("\n\n")}\n\nAtentamente,\nCompras Asia`
        : `Sin cambios para su ámbito en esta revisión.\n\nAtentamente,\nCompras Asia`;

    const subject = `[Proyecto Nexus] ${projectId} ${revisionId} — Resumen de cambios`;
    const draftId = `DR-${p.supplierId}-${revisionId}`;

    return {
      draftId,
      projectId,
      revisionId,
      supplierId: p.supplierId,
      supplierName: p.supplierName,
      to: p.to,
      subject,
      body,
      originalSubject: subject,
      originalBody: body,
      isEdited: false,
      status: "draft"
    };
  });
}

