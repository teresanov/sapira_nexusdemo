import {
  type BomLine,
  type BomRevisionSummary,
  type Client,
  type EditableDraft,
  type Incident,
  type MockEmail,
  type Project
} from "./models";

// Core IDs used across the demo (single-project flow)
export const PROJECT_ID = "PRJ-2007";
export const BASE_REVISION_ID = "Rev86";
export const CURRENT_REVISION_ID = "Rev87";

// Product mode: multiple clients and projects
export const mockClients: Client[] = [
  { id: "CLI-001", name: "Asia Motors" },
  { id: "CLI-002", name: "EuroTech Industries" },
  { id: "CLI-003", name: "Global Supply Co." }
];

/** Map supplierId → email for draft generation */
export const SUPPLIER_EMAILS: Record<string, string> = {
  "S-DELTA": "orders.apac@deltathermal.com",
  "S-OMEGA": "procurement@omegapower.com",
  "S-KAPPA": "sales.apac@kappa-enclosures.com",
  "S-SIGMA": "orders@sigmapackaging-asia.com"
};

export const mockEmails: MockEmail[] = [
  // PRJ-2007 (demo project)
  {
    id: "email-1",
    sender: "alex.chen@internal-nexus.com",
    subject: "PRJ-2007 · Rev87 — Updated BOM for Asia build",
    receivedAt: "2024-11-12T09:14:00Z",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    attachments: ["PRJ-2007_Rev87_BOM.xlsx"],
    validationStatus: "valid"
  },
  {
    id: "email-2",
    sender: "laura.kim@internal-nexus.com",
    subject: "PRJ-2007 · Rev86 — Initial BOM for Asia build",
    receivedAt: "2024-11-05T08:37:00Z",
    projectId: PROJECT_ID,
    revisionId: BASE_REVISION_ID,
    attachments: ["PRJ-2007_Rev86_BOM.xlsx"],
    validationStatus: "valid"
  },
  {
    id: "email-3",
    sender: "maria.lee@internal-nexus.com",
    subject: "PRJ-2007 · Rev87 — BOM update (v2, quantity check)",
    receivedAt: "2024-11-14T10:02:00Z",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    attachments: ["PRJ-2007_Rev87_BOM_v2.xlsx"],
    validationStatus: "valid"
  },
  // PRJ-2008
  {
    id: "email-4",
    sender: "james.wong@internal-nexus.com",
    subject: "PRJ-2008 · Rev02 — Battery pack BOM Phase 2",
    receivedAt: "2024-11-18T11:00:00Z",
    projectId: "PRJ-2008",
    revisionId: "Rev02",
    attachments: ["PRJ-2008_Rev02_BOM.xlsx"],
    validationStatus: "valid"
  },
  {
    id: "email-5",
    sender: "sarah.park@internal-nexus.com",
    subject: "PRJ-2008 · Rev01 — Initial battery pack BOM",
    receivedAt: "2024-11-10T09:30:00Z",
    projectId: "PRJ-2008",
    revisionId: "Rev01",
    attachments: ["PRJ-2008_Rev01_BOM.xlsx"],
    validationStatus: "valid"
  },
  // PRJ-2009
  {
    id: "email-6",
    sender: "david.mueller@internal-nexus.com",
    subject: "PRJ-2009 · Rev11 — Display assembly EU variant",
    receivedAt: "2024-11-20T14:15:00Z",
    projectId: "PRJ-2009",
    revisionId: "Rev11",
    attachments: ["PRJ-2009_Rev11_BOM.xlsx"],
    validationStatus: "valid"
  },
  {
    id: "email-7",
    sender: "david.mueller@internal-nexus.com",
    subject: "PRJ-2009 · Rev10 — Display assembly baseline",
    receivedAt: "2024-11-15T10:00:00Z",
    projectId: "PRJ-2009",
    revisionId: "Rev10",
    attachments: ["PRJ-2009_Rev10_BOM.xlsx"],
    validationStatus: "valid"
  }
];

export const mockRevisions: BomRevisionSummary[] = [
  // PRJ-2007 — EV power module (varias revisiones)
  {
    projectId: PROJECT_ID,
    revisionId: "Rev85",
    sourceEmailId: "email-archive-207-1",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    diffSummary: { added: 0, removed: 0, qtyChanged: 0 }
  },
  {
    projectId: PROJECT_ID,
    revisionId: BASE_REVISION_ID,
    sourceEmailId: "email-2",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    previousRevisionId: "Rev85",
    diffSummary: { added: 5, removed: 0, qtyChanged: 1 }
  },
  {
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    sourceEmailId: "email-1",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    previousRevisionId: BASE_REVISION_ID,
    diffSummary: { added: 3, removed: 2, qtyChanged: 2 }
  },
  {
    projectId: PROJECT_ID,
    revisionId: "Rev88",
    sourceEmailId: "email-3",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    previousRevisionId: CURRENT_REVISION_ID,
    diffSummary: { added: 1, removed: 0, qtyChanged: 4 }
  },
  // PRJ-2008 — Battery pack
  {
    projectId: "PRJ-2008",
    revisionId: "Rev01",
    sourceEmailId: "email-5",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    diffSummary: { added: 0, removed: 0, qtyChanged: 0 }
  },
  {
    projectId: "PRJ-2008",
    revisionId: "Rev02",
    sourceEmailId: "email-4",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    previousRevisionId: "Rev01",
    diffSummary: { added: 2, removed: 0, qtyChanged: 1 }
  },
  {
    projectId: "PRJ-2008",
    revisionId: "Rev03",
    sourceEmailId: "email-archive-208-1",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    previousRevisionId: "Rev02",
    diffSummary: { added: 4, removed: 1, qtyChanged: 2 }
  },
  // PRJ-2009 — Display assembly
  {
    projectId: "PRJ-2009",
    revisionId: "Rev10",
    sourceEmailId: "email-7",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    diffSummary: { added: 0, removed: 0, qtyChanged: 0 }
  },
  {
    projectId: "PRJ-2009",
    revisionId: "Rev11",
    sourceEmailId: "email-6",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    previousRevisionId: "Rev10",
    diffSummary: { added: 1, removed: 0, qtyChanged: 2 }
  },
  {
    projectId: "PRJ-2009",
    revisionId: "Rev12",
    sourceEmailId: "email-archive-209-1",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    previousRevisionId: "Rev11",
    diffSummary: { added: 0, removed: 0, qtyChanged: 3 }
  },
  // PRJ-2010 — Chassis assembly (nuevo proyecto)
  {
    projectId: "PRJ-2010",
    revisionId: "Rev01",
    sourceEmailId: "email-archive-210-1",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    diffSummary: { added: 0, removed: 0, qtyChanged: 0 }
  },
  {
    projectId: "PRJ-2010",
    revisionId: "Rev02",
    sourceEmailId: "email-archive-210-2",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    previousRevisionId: "Rev01",
    diffSummary: { added: 8, removed: 0, qtyChanged: 2 }
  },
  {
    projectId: "PRJ-2010",
    revisionId: "Rev03",
    sourceEmailId: "email-archive-210-3",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    previousRevisionId: "Rev02",
    diffSummary: { added: 2, removed: 1, qtyChanged: 5 }
  },
  // PRJ-2011 — Cooling system (nuevo proyecto)
  {
    projectId: "PRJ-2011",
    revisionId: "Rev01",
    sourceEmailId: "email-archive-211-1",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    diffSummary: { added: 0, removed: 0, qtyChanged: 0 }
  },
  {
    projectId: "PRJ-2011",
    revisionId: "Rev02",
    sourceEmailId: "email-archive-211-2",
    validationStatus: "valid",
    normalizedStatus: "normalized",
    previousRevisionId: "Rev01",
    diffSummary: { added: 6, removed: 2, qtyChanged: 1 }
  }
];

export const mockProjects: Project[] = [
  {
    id: PROJECT_ID,
    name: "EV power module — Asia localization",
    status: "active",
    clientId: "CLI-001",
    revisions: mockRevisions.filter((r) => r.projectId === PROJECT_ID)
  },
  {
    id: "PRJ-2008",
    name: "Battery pack BOM — Phase 2",
    status: "active",
    clientId: "CLI-001",
    revisions: mockRevisions.filter((r) => r.projectId === "PRJ-2008")
  },
  {
    id: "PRJ-2009",
    name: "Display assembly — EU variant",
    status: "active",
    clientId: "CLI-002",
    revisions: mockRevisions.filter((r) => r.projectId === "PRJ-2009")
  },
  {
    id: "PRJ-2010",
    name: "Chassis assembly — Asia build",
    status: "active",
    clientId: "CLI-001",
    revisions: mockRevisions.filter((r) => r.projectId === "PRJ-2010")
  },
  {
    id: "PRJ-2011",
    name: "Cooling system BOM",
    status: "active",
    clientId: "CLI-003",
    revisions: mockRevisions.filter((r) => r.projectId === "PRJ-2011")
  }
];

export const mockBomLines: BomLine[] = [
  // Baseline Rev86 — supplier S-DELTA
  {
    lineId: "L-1001",
    projectId: PROJECT_ID,
    revisionId: BASE_REVISION_ID,
    sapCode: "SAP-900100",
    description: "Aluminum heat sink, 120mm",
    uom: "pcs",
    qty: 400,
    categoryId: "MECH",
    supplierId: "S-DELTA",
    supplierName: "Delta Thermal Components",
    diffFlag: "unchanged"
  },
  {
    lineId: "L-1002",
    projectId: PROJECT_ID,
    revisionId: BASE_REVISION_ID,
    sapCode: "SAP-910210",
    description: "M4 stainless screw, 12mm",
    uom: "pcs",
    qty: 1600,
    categoryId: "FASTENERS",
    supplierId: "S-DELTA",
    supplierName: "Delta Thermal Components",
    diffFlag: "unchanged"
  },
  // Baseline Rev86 — supplier S-OMEGA
  {
    lineId: "L-2001",
    projectId: PROJECT_ID,
    revisionId: BASE_REVISION_ID,
    sapCode: "SAP-300501",
    description: "Power MOSFET 80V 120A",
    uom: "pcs",
    qty: 800,
    categoryId: "POWER_SEMIS",
    supplierId: "S-OMEGA",
    supplierName: "Omega Power Devices",
    diffFlag: "unchanged"
  },
  {
    lineId: "L-2002",
    projectId: PROJECT_ID,
    revisionId: BASE_REVISION_ID,
    sapCode: "SAP-300520",
    description: "Gate driver IC, 3-phase",
    uom: "pcs",
    qty: 400,
    categoryId: "IC",
    supplierId: "S-OMEGA",
    supplierName: "Omega Power Devices",
    diffFlag: "unchanged"
  },
  // Baseline Rev86 — supplier S-KAPPA (to be removed later)
  {
    lineId: "L-3001",
    projectId: PROJECT_ID,
    revisionId: BASE_REVISION_ID,
    sapCode: "SAP-700110",
    description: "Plastic enclosure, grey, IP54",
    uom: "pcs",
    qty: 400,
    categoryId: "ENCLOSURE",
    supplierId: "S-KAPPA",
    supplierName: "Kappa Enclosures",
    diffFlag: "unchanged"
  },
  {
    lineId: "L-3002",
    projectId: PROJECT_ID,
    revisionId: BASE_REVISION_ID,
    sapCode: "SAP-720010",
    description: "Label kit, bilingual (EN/CN)",
    uom: "sets",
    qty: 400,
    categoryId: "PACKAGING",
    supplierId: "S-KAPPA",
    supplierName: "Kappa Enclosures",
    diffFlag: "unchanged"
  },

  // Current Rev87 — updated quantities and new/removed items
  // S-DELTA: quantity change on screws, unchanged heat sink
  {
    lineId: "L-1001",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    sapCode: "SAP-900100",
    description: "Aluminum heat sink, 120mm",
    uom: "pcs",
    qty: 400,
    oldQty: 400,
    categoryId: "MECH",
    supplierId: "S-DELTA",
    supplierName: "Delta Thermal Components",
    diffFlag: "unchanged"
  },
  {
    lineId: "L-1002",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    sapCode: "SAP-910210",
    description: "M4 stainless screw, 12mm",
    uom: "pcs",
    qty: 2000,
    oldQty: 1600,
    categoryId: "FASTENERS",
    supplierId: "S-DELTA",
    supplierName: "Delta Thermal Components",
    diffFlag: "qty_changed"
  },
  // S-OMEGA: one removed, one added, one qty change
  {
    lineId: "L-2001",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    sapCode: "SAP-300501",
    description: "Power MOSFET 80V 120A",
    uom: "pcs",
    qty: 900,
    oldQty: 800,
    categoryId: "POWER_SEMIS",
    supplierId: "S-OMEGA",
    supplierName: "Omega Power Devices",
    diffFlag: "qty_changed"
  },
  {
    lineId: "L-2003",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    sapCode: "SAP-300530",
    description: "NTC temperature sensor, ring lug",
    uom: "pcs",
    qty: 400,
    categoryId: "SENSORS",
    supplierId: "S-OMEGA",
    supplierName: "Omega Power Devices",
    diffFlag: "added"
  },
  // S-KAPPA: both lines removed in Rev87
  {
    lineId: "L-3001",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    sapCode: "SAP-700110",
    description: "Plastic enclosure, grey, IP54",
    uom: "pcs",
    qty: 0,
    oldQty: 400,
    categoryId: "ENCLOSURE",
    supplierId: "S-KAPPA",
    supplierName: "Kappa Enclosures",
    diffFlag: "removed"
  },
  {
    lineId: "L-3002",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    sapCode: "SAP-720010",
    description: "Label kit, bilingual (EN/CN)",
    uom: "sets",
    qty: 0,
    oldQty: 400,
    categoryId: "PACKAGING",
    supplierId: "S-KAPPA",
    supplierName: "Kappa Enclosures",
    diffFlag: "removed"
  },
  // New supplier S-SIGMA: added items only
  {
    lineId: "L-4001",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    sapCode: "SAP-500801",
    description: "Corrugated export carton, reinforced corners",
    uom: "pcs",
    qty: 400,
    categoryId: "PACKAGING",
    supplierId: "S-SIGMA",
    supplierName: "Sigma Packaging Asia",
    diffFlag: "added"
  },
  {
    lineId: "L-4002",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    sapCode: "SAP-500820",
    description: "Pallet, fumigated, 1100x1100",
    uom: "pcs",
    qty: 50,
    categoryId: "PACKAGING",
    supplierId: "S-SIGMA",
    supplierName: "Sigma Packaging Asia",
    diffFlag: "added"
  }
];

export const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    type: "mismatch_revision",
    severity: "non_blocking",
    status: "resolved",
    recommendedFix:
      "Confirm that supplier acknowledgements reference PRJ-2007 Rev87, not older revisions."
  },
  {
    id: "INC-002",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    type: "metadata_missing",
    severity: "non_blocking",
    status: "open",
    recommendedFix:
      "Fill in missing SAP code for new sensor line before releasing PO."
  },
  {
    id: "INC-003",
    projectId: "PRJ-2008",
    revisionId: "Rev02",
    type: "invalid_format",
    severity: "non_blocking",
    status: "waiting_reply",
    recommendedFix: "Request supplier to re-export BOM in agreed template."
  },
  {
    id: "INC-004",
    projectId: "PRJ-2009",
    revisionId: "Rev11",
    type: "missing_attachment",
    severity: "blocking",
    status: "open",
    recommendedFix: "Request BOM attachment from procurement before releasing Rev11."
  }
];

export const mockDrafts: EditableDraft[] = [
  {
    draftId: "DR-DELTA",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    supplierId: "S-DELTA",
    supplierName: "Delta Thermal Components",
    to: "orders.apac@deltathermal.com",
    subject: "[Proyecto Nexus] Qty update for hardware — PRJ-2007 Rev87",
    body:
      "Dear Delta team,\n\n" +
      "Please find below the updated quantity requirements for PRJ-2007, revision Rev87.\n\n" +
      "Quantity updates:\n" +
      "• M4 stainless screw, 12mm: from 1,600 pcs to 2,000 pcs.\n\n" +
      "No cancellations or new items are required for your scope in this revision.\n\n" +
      "Best regards,\nAsia Procurement",
    originalSubject:
      "[Proyecto Nexus] Qty update for hardware — PRJ-2007 Rev87",
    originalBody:
      "Dear Delta team,\n\n" +
      "Please find below the updated quantity requirements for PRJ-2007, revision Rev87.\n\n" +
      "Quantity updates:\n" +
      "• M4 stainless screw, 12mm: from 1,600 pcs to 2,000 pcs.\n\n" +
      "No cancellations or new items are required for your scope in this revision.\n\n" +
      "Best regards,\nAsia Procurement",
    isEdited: false,
    status: "draft"
  },
  {
    draftId: "DR-KAPPA",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    supplierId: "S-KAPPA",
    supplierName: "Kappa Enclosures",
    to: "sales.apac@kappa-enclosures.com",
    subject: "[Proyecto Nexus] Cancellation of enclosure & label kit — PRJ-2007 Rev87",
    body:
      "Dear Kappa team,\n\n" +
      "For project PRJ-2007, revision Rev87, both the enclosure and label kit have been removed from the BOM.\n\n" +
      "Cancellations:\n" +
      "• Plastic enclosure, grey, IP54: cancel remaining 400 pcs.\n" +
      "• Label kit, bilingual (EN/CN): cancel remaining 400 sets.\n\n" +
      "Please confirm cancellation of open orders and update your records accordingly.\n\n" +
      "Best regards,\nAsia Procurement",
    originalSubject:
      "[Proyecto Nexus] Cancellation of enclosure & label kit — PRJ-2007 Rev87",
    originalBody:
      "Dear Kappa team,\n\n" +
      "For project PRJ-2007, revision Rev87, both the enclosure and label kit have been removed from the BOM.\n\n" +
      "Cancellations:\n" +
      "• Plastic enclosure, grey, IP54: cancel remaining 400 pcs.\n" +
      "• Label kit, bilingual (EN/CN): cancel remaining 400 sets.\n\n" +
      "Please confirm cancellation of open orders and update your records accordingly.\n\n" +
      "Best regards,\nAsia Procurement",
    isEdited: false,
    status: "ready"
  },
  {
    draftId: "DR-OMEGA",
    projectId: PROJECT_ID,
    revisionId: CURRENT_REVISION_ID,
    supplierId: "S-OMEGA",
    supplierName: "Omega Power Devices",
    to: "procurement@omegapower.com",
    subject: "[Proyecto Nexus] New items and qty changes — PRJ-2007 Rev87",
    body:
      "Dear Omega team,\n\n" +
      "For project PRJ-2007, revision Rev87:\n\n" +
      "New items: NTC temperature sensor, ring lug — 400 pcs.\n" +
      "Quantity updates: Power MOSFET 80V 120A — 800 to 900 pcs.\n\n" +
      "Best regards,\nAsia Procurement",
    originalSubject:
      "[Proyecto Nexus] New items and qty changes — PRJ-2007 Rev87",
    originalBody:
      "Dear Omega team,\n\n" +
      "For project PRJ-2007, revision Rev87:\n\n" +
      "New items: NTC temperature sensor, ring lug — 400 pcs.\n" +
      "Quantity updates: Power MOSFET 80V 120A — 800 to 900 pcs.\n\n" +
      "Best regards,\nAsia Procurement",
    isEdited: false,
    status: "sent"
  },
  // PRJ-2008
  {
    draftId: "DR-2008-01",
    projectId: "PRJ-2008",
    revisionId: "Rev02",
    supplierId: "S-DELTA",
    supplierName: "Delta Thermal Components",
    to: "orders.apac@deltathermal.com",
    subject: "[PRJ-2008] Rev02 — Battery pack thermal components",
    body: "Dear Delta team,\n\nPlease find Rev02 BOM for PRJ-2008 battery pack.\n\nBest regards,\nProcurement",
    originalSubject: "[PRJ-2008] Rev02 — Battery pack thermal components",
    originalBody: "Dear Delta team,\n\nPlease find Rev02 BOM for PRJ-2008 battery pack.\n\nBest regards,\nProcurement",
    isEdited: false,
    status: "ready"
  },
  // PRJ-2009
  {
    draftId: "DR-2009-01",
    projectId: "PRJ-2009",
    revisionId: "Rev11",
    supplierId: "S-OMEGA",
    supplierName: "Omega Power Devices",
    to: "procurement@omegapower.com",
    subject: "[PRJ-2009] Rev11 — Display driver ICs EU",
    body: "Dear Omega team,\n\nRev11 for PRJ-2009 display assembly. Quantity updates as per attached.\n\nBest regards,\nProcurement",
    originalSubject: "[PRJ-2009] Rev11 — Display driver ICs EU",
    originalBody: "Dear Omega team,\n\nRev11 for PRJ-2009 display assembly. Quantity updates as per attached.\n\nBest regards,\nProcurement",
    isEdited: false,
    status: "draft"
  }
];

