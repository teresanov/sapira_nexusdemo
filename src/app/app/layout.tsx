import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { Toaster } from "sonner";
import { ProductProvider } from "@/context/product-context";
import { ProductLayoutClient } from "./product-layout-client";
import { AppSidebar } from "./app-sidebar";

export const metadata: Metadata = {
  title: "Proyecto Nexus — Producto"
};

export default function AppShellLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProductProvider>
      <Toaster richColors position="bottom-right" />
      <div className="min-h-screen bg-white text-neutral-900">
        <header className="border-b border-neutral-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex flex-col items-start gap-0">
              <span className="text-sm font-semibold tracking-[0.18em] text-neutral-500">
                PROYECTO
              </span>
              <span className="text-base font-semibold tracking-[0.2em] text-neutral-900">
                NEXUS
              </span>
              <span className="text-xs text-neutral-500">
                Compras Asia: Gestión de revisiones BOM
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                aria-label="Volver al inicio"
              >
                <Home className="h-4 w-4" />
                Inicio
              </Link>
              <span
                className="rounded-full border border-neutral-400 bg-neutral-100 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-neutral-800"
                aria-label="Modo Producto"
              >
                Modo Producto
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
          <AppSidebar />

          <ProductLayoutClient>{children}</ProductLayoutClient>
        </div>
      </div>
    </ProductProvider>
  );
}
