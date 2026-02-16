"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Sidebar que narra el ciclo de vida del dato según el PRD:
 * Entrada (Recepción) → Núcleo (BOM Master) → Salida (Compras).
 * El menú fluye de arriba a abajo como un embudo de procesamiento.
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 border-r border-neutral-200 pr-4">
      <nav
        className="flex flex-col gap-6 text-sm text-neutral-600"
        aria-label="Navegación principal — flujo de datos"
      >
        {/* GRUPO 1: SOLICITUDES INTERNAS (La Entrada)
            Recibimos excels/emails de stakeholders; si fallan validación → incidencias. */}
        <SidebarGroup
          label="Recepción"
          title="Donde llegan y se validan las solicitudes con BOMs adjuntos; lo fallido deriva a Incidencias."
        >
          <NavLink href="/app/inbox" pathname={pathname}>
            Bandeja de entrada
          </NavLink>
          <NavLink href="/app/incidents" pathname={pathname}>
            Incidencias
          </NavLink>
        </SidebarGroup>

        {/* GRUPO 2: DATOS NORMALIZADOS (El Proceso / Núcleo)
            La 'Verdad': histórico de revisiones ya validadas y limpias. Base de consulta. */}
        <SidebarGroup
          label="BOM Master"
          title="Biblioteca de revisiones BOM ya validadas y normalizadas; es la base de datos de consulta."
        >
          <NavLink href="/app/library" pathname={pathname}>
            Biblioteca
          </NavLink>
        </SidebarGroup>

        {/* GRUPO 3: GESTIÓN DE PROVEEDORES (La Salida)
            Emails generados para proveedores externos, pendientes de aprobación humana. */}
        <SidebarGroup
          label="Compras"
          title="Borradores de email para proveedores, generados por el sistema y pendientes de envío."
        >
          <NavLink href="/app/drafts" pathname={pathname}>
            Borradores
          </NavLink>
        </SidebarGroup>
      </nav>
    </aside>
  );
}

function SidebarGroup({
  label,
  title,
  children,
}: {
  label: string;
  /** Tooltip/descripción del grupo para desarrolladores y accesibilidad */
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1" role="group" aria-label={label}>
      <p
        className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500"
        title={title}
      >
        {label}
      </p>
      <ul className="space-y-0.5 list-none">{children}</ul>
    </div>
  );
}

function NavLink({
  href,
  pathname,
  children,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
}) {
  const isActive = pathname === href;
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center rounded-sm px-2 py-1.5 text-xs transition-colors",
          isActive
            ? "bg-neutral-100 font-medium text-neutral-900"
            : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
        )}
      >
        {children}
      </Link>
    </li>
  );
}
