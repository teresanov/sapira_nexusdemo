import type { Metadata } from "next";
import { DemoProvider } from "@/context/demo-context";
import { DemoLayoutClient } from "./demo-layout-client";

export const metadata: Metadata = {
  title: "Proyecto Nexus — Demo guiada"
};

export default function DemoLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DemoProvider>
      <DemoLayoutClient>{children}</DemoLayoutClient>
    </DemoProvider>
  );
}
