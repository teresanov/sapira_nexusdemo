"use client";

import { Loader2 } from "lucide-react";
import { DraftsReview } from "@/components/demo/drafts-review";
import { MockSendTimeline } from "@/components/demo/mock-send-timeline";
import { PurchaseActionPlan } from "@/components/demo/purchase-action-plan";
import { Step1ReadEmail } from "@/components/demo/step-1-read-email";
import { Step2ParseMetadata } from "@/components/demo/step-2-parse-metadata";
import { Step3ValidateAttachment } from "@/components/demo/step-3-validate-attachment";
import { Step4NormalizeBom } from "@/components/demo/step-4-normalize-bom";
import { Step5Lineage } from "@/components/demo/step-5-lineage";
import { Step7DeltaSummary } from "@/components/demo/step-7-delta-summary";
import { useDemo } from "@/context/demo-context";

export function SimulationStage() {
  const { currentStep } = useDemo();

  switch (currentStep) {
    case 1:
      return <Step1ReadEmail />;
    case 2:
      return <Step2ParseMetadata />;
    case 3:
      return <Step3ValidateAttachment />;
    case 4:
      return <Step4NormalizeBom />;
    case 5:
      return <Step5Lineage />;
    case 6:
      return <PurchaseActionPlan />;
    case 7:
      return <Step7DeltaSummary />;
    case 8:
      return <DraftsReview />;
    case 9:
      return <MockSendTimeline />;
    default:
      return <StepPlaceholder step={currentStep} />;
  }
}

function StepPlaceholder({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
      <Loader2 className="mb-4 h-10 w-10 animate-spin text-neutral-400" />
      <p className="text-sm font-medium text-neutral-700">
        Simulando paso {step}…
      </p>
      <div className="mt-3 h-1 w-32 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full animate-pulse rounded-full bg-neutral-300"
          style={{ width: "60%" }}
        />
      </div>
    </div>
  );
}


