"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useDemo } from "@/context/demo-context";
import { getPurchasePlan, type SupplierPlanItem } from "@/lib/demo-engine";
import { CURRENT_REVISION_ID } from "@/lib/mock-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function PurchaseActionPlan() {
  const { selectedEmail } = useDemo();
  const revisionId = selectedEmail?.revisionId ?? CURRENT_REVISION_ID;
  const plans = useMemo(
    () => getPurchasePlan(revisionId),
    [revisionId]
  );

  if (plans.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        No hay datos de plan de compras para esta revisión.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Accordion type="multiple" className="w-full">
        {plans.map((plan, index) => {
          const nBuy = plan.toBuy.length;
          const nCancel = plan.toCancel.length;
          const nChanges = plan.qtyChanges.length;

          return (
            <AccordionItem key={index} value={`supplier-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-neutral-900">
                    {plan.supplierName}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span>Comprar {nBuy}</span>
                    <span>Cancelar {nCancel}</span>
                    <span>Cambios {nChanges}</span>
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <SupplierPlanContent plan={plan} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

function SupplierPlanContent({ plan }: { plan: SupplierPlanItem }) {
  const nBuy = plan.toBuy.length;
  const nCancel = plan.toCancel.length;
  const nChanges = plan.qtyChanges.length;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-3 text-sm text-neutral-700">
        {plan.summary}
      </div>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="w-full justify-start gap-0">
          <TabsTrigger
            value="buy"
            className={cn(
              "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800",
              nBuy === 0 && "opacity-60"
            )}
          >
            Comprar ({nBuy})
          </TabsTrigger>
          <TabsTrigger
            value="cancel"
            className={cn(
              "data-[state=active]:bg-red-100 data-[state=active]:text-red-800",
              nCancel === 0 && "opacity-60"
            )}
          >
            Cancelar ({nCancel})
          </TabsTrigger>
          <TabsTrigger
            value="changes"
            className={cn(
              "data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800",
              nChanges === 0 && "opacity-60"
            )}
          >
            Cambios ({nChanges})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="mt-3">
          <ul className="space-y-2">
            {plan.toBuy.length === 0 ? (
              <li className="text-sm text-neutral-500">Ningún ítem nuevo.</li>
            ) : (
              plan.toBuy.map((line) => (
                <li
                  key={line.lineId}
                  className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
                >
                  <span className="text-neutral-900">{line.description}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-neutral-600">
                      {line.qty} {line.uom}
                    </span>
                    <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-800">
                      Nuevo
                    </span>
                  </span>
                </li>
              ))
            )}
          </ul>
        </TabsContent>

        <TabsContent value="cancel" className="mt-3">
          <ul className="space-y-2">
            {plan.toCancel.length === 0 ? (
              <li className="text-sm text-neutral-500">Nada a cancelar.</li>
            ) : (
              plan.toCancel.map((line) => (
                <li
                  key={line.lineId}
                  className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
                >
                  <span className="line-through">{line.description}</span>
                  <span className="line-through">
                    {line.oldQty ?? line.qty} {line.uom}
                  </span>
                </li>
              ))
            )}
          </ul>
        </TabsContent>

        <TabsContent value="changes" className="mt-3">
          <ul className="space-y-2">
            {plan.qtyChanges.length === 0 ? (
              <li className="text-sm text-neutral-500">Sin cambios de cantidad.</li>
            ) : (
              plan.qtyChanges.map(({ line, oldQty, newQty, delta }) => (
                <li
                  key={line.lineId}
                  className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
                >
                  <span className="text-neutral-900">{line.description}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-neutral-500">
                      {oldQty} → {newQty} {line.uom}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-xs font-medium",
                        delta >= 0
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {delta >= 0 ? "+" : ""}{delta}
                    </span>
                  </span>
                </li>
              ))
            )}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
