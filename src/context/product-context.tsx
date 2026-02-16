"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode
} from "react";
import type {
  BomRevisionSummary,
  Client,
  EditableDraft,
  Incident,
  MockEmail,
  Project
} from "@/lib/models";
import {
  mockClients,
  mockDrafts,
  mockEmails,
  mockIncidents,
  mockProjects,
  mockRevisions
} from "@/lib/mock-data";

export type ProductDrawerType = "inbox" | "library" | "drafts" | "incidents" | null;

export type ProductDrawerItem =
  | { type: "email"; data: MockEmail }
  | { type: "library"; data: BomRevisionSummary | Project }
  | { type: "draft"; data: EditableDraft }
  | { type: "incident"; data: Incident }
  | null;

export interface ProductFilter {
  clientId: string | null;
  projectId: string | null;
  revisionId: string | null;
}

interface ProductContextValue {
  // Data (mocks loaded on mount)
  clients: Client[];
  projects: Project[];
  drafts: EditableDraft[];
  updateDraft: (draftId: string, updates: { subject?: string; body?: string }) => void;
  sendDraft: (draftId: string) => void;
  incidents: Incident[];
  emails: MockEmail[];
  revisions: BomRevisionSummary[];

  // Filter for Library, Drafts, Incidents
  filter: ProductFilter;
  /** Set filter: pass null to clear, or projectId + optional revisionId (null = all revisions). Optional clientId to filter by client. */
  setFilter: (projectId: string | null, revisionId?: string | null, clientId?: string | null) => void;
  clearFilter: () => void;

  // Drawer state (shared across routes)
  drawerOpen: boolean;
  drawerType: ProductDrawerType;
  drawerItem: ProductDrawerItem;
  openDrawer: (type: ProductDrawerType, item: ProductDrawerItem) => void;
  closeDrawer: () => void;
}

const ProductContext = createContext<ProductContextValue | null>(null);

const initialFilter: ProductFilter = {
  clientId: null,
  projectId: null,
  revisionId: null
};

const initialDrafts: EditableDraft[] = mockDrafts.map((d) => ({ ...d }));

export function ProductProvider({ children }: { children: ReactNode }) {
  const [filter, setFilterState] = useState<ProductFilter>(initialFilter);
  const [drafts, setDrafts] = useState<EditableDraft[]>(initialDrafts);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<ProductDrawerType>(null);
  const [drawerItem, setDrawerItem] = useState<ProductDrawerItem>(null);

  const updateDraft = useCallback(
    (draftId: string, updates: { subject?: string; body?: string }) => {
      setDrafts((prev) =>
        prev.map((d) =>
          d.draftId === draftId
            ? {
                ...d,
                ...(updates.subject !== undefined && { subject: updates.subject }),
                ...(updates.body !== undefined && { body: updates.body }),
                isEdited: true
              }
            : d
        )
      );
    },
    []
  );

  const sendDraft = useCallback((draftId: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.draftId === draftId ? { ...d, status: "sent" as const } : d))
    );
  }, []);

  const setFilter = useCallback(
    (projectId: string | null, revisionId?: string | null, clientId?: string | null) => {
      if (projectId === null) {
        setFilterState(initialFilter);
        return;
      }
      const project = mockProjects.find((p) => p.id === projectId);
      setFilterState({
        clientId: clientId ?? project?.clientId ?? null,
        projectId,
        revisionId: revisionId ?? null
      });
    },
    []
  );

  const clearFilter = useCallback(() => {
    setFilterState(initialFilter);
  }, []);

  const openDrawer = useCallback(
    (type: ProductDrawerType, item: ProductDrawerItem) => {
      setDrawerType(type);
      setDrawerItem(item);
      setDrawerOpen(true);
    },
    []
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setDrawerType(null);
    setDrawerItem(null);
  }, []);

  const value: ProductContextValue = {
    clients: mockClients,
    projects: mockProjects,
    drafts,
    updateDraft,
    sendDraft,
    incidents: mockIncidents,
    emails: mockEmails,
    revisions: mockRevisions,
    filter,
    setFilter,
    clearFilter,
    drawerOpen,
    drawerType,
    drawerItem,
    openDrawer,
    closeDrawer
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProduct() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProduct must be used within ProductProvider");
  }
  return ctx;
}
