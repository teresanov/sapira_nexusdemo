"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { EditableDraft, MockEmail } from "@/lib/models";
import { generateDraftsFromPlan, getPurchasePlan } from "@/lib/demo-engine";
import { PROJECT_ID } from "@/lib/mock-data";

export interface DemoState {
  currentStep: number;
  selectedEmail: MockEmail | null;
  isNextEnabled: boolean;
  drafts: EditableDraft[];
  mockSendCompleted: boolean;
  hasBlockingError: boolean;
}

interface DemoContextValue extends DemoState {
  setCurrentStep: (step: number) => void;
  setSelectedEmail: (email: MockEmail | null) => void;
  setNextEnabled: (enabled: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetRunner: () => void;
  updateDraft: (id: string, newSubject: string, newBody: string) => void;
  ensureDraftsForStep8: () => void;
  setMockSendCompleted: (completed: boolean) => void;
  setHasBlockingError: (blocking: boolean) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

const initialState: DemoState = {
  currentStep: 1,
  selectedEmail: null,
  isNextEnabled: false,
  drafts: [],
  mockSendCompleted: false,
  hasBlockingError: false
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(initialState.currentStep);
  const [selectedEmail, setSelectedEmail] = useState<MockEmail | null>(
    initialState.selectedEmail
  );
  const [isNextEnabled, setNextEnabled] = useState(initialState.isNextEnabled);
  const [drafts, setDrafts] = useState<EditableDraft[]>(initialState.drafts);
  const [mockSendCompleted, setMockSendCompleted] = useState(
    initialState.mockSendCompleted
  );
  const [hasBlockingError, setHasBlockingError] = useState(
    initialState.hasBlockingError
  );

  const nextStep = () => {
    setCurrentStep((s) => (s < 9 ? s + 1 : s));
  };

  const prevStep = () => {
    setCurrentStep((s) => (s > 1 ? s - 1 : s));
  };

  const resetRunner = () => {
    setCurrentStep(1);
    setDrafts([]);
    setMockSendCompleted(false);
    setHasBlockingError(false);
  };

  const updateDraft = useCallback(
    (id: string, newSubject: string, newBody: string) => {
      setDrafts((prev) =>
        prev.map((d) =>
          d.draftId === id
            ? { ...d, subject: newSubject, body: newBody, isEdited: true }
            : d
        )
      );
    },
    []
  );

  const ensureDraftsForStep8 = useCallback(() => {
    setDrafts((prev) => {
      if (prev.length > 0) return prev;
      const revisionId = selectedEmail?.revisionId ?? "Rev87";
      const plan = getPurchasePlan(revisionId);
      return generateDraftsFromPlan(plan, PROJECT_ID, revisionId);
    });
  }, [selectedEmail?.revisionId]);

  const value = useMemo<DemoContextValue>(
    () => ({
      currentStep,
      selectedEmail,
      isNextEnabled,
      drafts,
      mockSendCompleted,
      hasBlockingError,
      setCurrentStep,
      setSelectedEmail,
      setNextEnabled,
      nextStep,
      prevStep,
      resetRunner,
      updateDraft,
      ensureDraftsForStep8,
      setMockSendCompleted,
      setHasBlockingError
    }),
    [
      currentStep,
      selectedEmail,
      isNextEnabled,
      drafts,
      updateDraft,
      ensureDraftsForStep8,
      mockSendCompleted,
      hasBlockingError
    ]
  );

  return (
    <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within DemoProvider");
  }
  return ctx;
}
