// Domain models for Proyecto Nexus demo (based on PRD)

export type ValidationStatus = "valid" | "invalid";

export interface MockEmail {
  id: string;
  sender: string;
  subject: string;
  receivedAt: string;
  projectId: string;
  revisionId: string;
  attachments: string[];
  validationStatus: ValidationStatus;
}

export type ProjectStatus = "active" | "blocked" | "complete";

export interface Client {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  clientId: string;
  revisions: BomRevisionSummary[];
}

export interface BomRevisionSummary {
  projectId: string;
  revisionId: string;
  sourceEmailId: string;
  validationStatus: ValidationStatus;
  normalizedStatus: "pending" | "normalized" | "failed";
  previousRevisionId?: string;
  diffSummary?: DiffSummary;
}

export interface DiffSummary {
  added: number;
  removed: number;
  qtyChanged: number;
}

export type DiffFlag = "added" | "removed" | "qty_changed" | "unchanged";

export interface BomLine {
  lineId: string;
  projectId: string;
  revisionId: string;
  sapCode?: string;
  description: string;
  uom: string;
  qty: number;
  oldQty?: number;
  categoryId: string;
  supplierId: string;
  supplierName: string;
  diffFlag: DiffFlag;
}

export type IncidentType =
  | "missing_attachment"
  | "metadata_missing"
  | "invalid_format"
  | "parse_error"
  | "mismatch_revision";

export type IncidentSeverity = "blocking" | "non_blocking";

export type IncidentStatus = "open" | "waiting_reply" | "resolved";

export interface Incident {
  id: string;
  projectId: string;
  revisionId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  recommendedFix: string;
}

export type DraftStatus = "draft" | "ready" | "sent";

export interface EditableDraft {
  draftId: string;
  projectId: string;
  revisionId: string;
  supplierId: string;
  supplierName: string;
  to: string;
  subject: string;
  body: string;
  originalSubject: string;
  originalBody: string;
  isEdited: boolean;
  status: DraftStatus;
}

export interface SupplierActionPlanCounts {
  toBuy: number;
  toCancel: number;
  qtyChanged: number;
}

export interface SupplierActionPlan {
  supplierId: string;
  supplierName: string;
  projectId: string;
  revisionId: string;
  toBuy: BomLine[];
  toCancel: BomLine[];
  qtyChanged: BomLine[];
  counts: SupplierActionPlanCounts;
  categoriesInvolved: string[];
}

