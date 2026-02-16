"use client";

import { useDemo } from "@/context/demo-context";
import { getStepInfo } from "./demo-steps";

export function StepIndicator() {
  const { currentStep } = useDemo();
  const info = getStepInfo(currentStep);

  return (
    <div className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        Paso {currentStep} de 9
      </p>
      <h2 className="text-lg font-semibold text-neutral-900">{info.title}</h2>
      <p className="text-sm leading-relaxed text-neutral-600">
        {info.description}
      </p>
    </div>
  );
}
