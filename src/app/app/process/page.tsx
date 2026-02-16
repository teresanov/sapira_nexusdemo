"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { DemoProvider, useDemo } from "@/context/demo-context";
import { mockEmails } from "@/lib/mock-data";
import { SimulationStage } from "@/app/demo/simulation-stage";
import { StepIndicator } from "@/app/demo/step-indicator";
import { cn } from "@/lib/utils";

function SyncEmailFromUrl({ emailId }: { emailId: string | null }) {
  const { setSelectedEmail, setNextEnabled } = useDemo();

  useEffect(() => {
    if (!emailId) return;
    const email = mockEmails.find((e) => e.id === emailId);
    if (email) {
      setSelectedEmail(email);
      setNextEnabled(true);
    }
  }, [emailId, setSelectedEmail, setNextEnabled]);

  return null;
}

function ProcessFlowContent() {
  const router = useRouter();
  const {
    currentStep,
    nextStep,
    prevStep,
    isNextEnabled,
    mockSendCompleted,
    hasBlockingError,
    setCurrentStep,
    resetRunner
  } = useDemo();

  const isLastStep = currentStep === 9;
  const canAdvance = isLastStep ? mockSendCompleted : !hasBlockingError;
  const buttonLabel = isLastStep
    ? mockSendCompleted
      ? "Finalizar y volver a Bandeja"
      : "Enviando…"
    : "Continuar";

  const handleBack = () => {
    if (currentStep > 1) {
      prevStep();
    } else {
      router.push("/app/inbox");
    }
  };

  const handleContinue = () => {
    if (!isLastStep && !hasBlockingError) {
      nextStep();
    } else if (isLastStep && mockSendCompleted) {
      resetRunner();
      setCurrentStep(1);
      router.push("/app/inbox");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-4">
        <StepIndicator />
      </div>

      <div className="min-h-[320px] rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <SimulationStage />
      </div>

      <footer className="flex justify-between gap-3 border-t border-neutral-200 pt-4">
        <button
          type="button"
          onClick={handleBack}
          className={cn(
            "rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700",
            "hover:bg-neutral-50 transition-colors"
          )}
        >
          Atrás
        </button>
        <button
          type="button"
          disabled={!canAdvance}
          onClick={handleContinue}
          className={cn(
            "rounded-md border px-5 py-2.5 text-sm font-medium transition-colors",
            !canAdvance
              ? "cursor-not-allowed border-neutral-300 bg-neutral-100 text-neutral-400"
              : "cursor-pointer border-neutral-400 bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
          )}
        >
          {buttonLabel}
        </button>
      </footer>
    </div>
  );
}

export default function ProcessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailId = searchParams.get("emailId");

  useEffect(() => {
    if (!emailId) {
      router.replace("/app/inbox");
    }
  }, [emailId, router]);

  if (!emailId) {
    return (
      <section className="space-y-4">
        <p className="text-sm text-neutral-600">Redirigiendo a la bandeja…</p>
      </section>
    );
  }

  return (
    <DemoProvider>
      <SyncEmailFromUrl emailId={emailId} />
      <section className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">
            Procesar email
          </h1>
          <p className="text-sm text-neutral-600">
            Revisa el email, valida el adjunto, consulta el plan de compras y redacta o envía los borradores a proveedores.
          </p>
        </div>
        <ProcessFlowContent />
      </section>
    </DemoProvider>
  );
}
