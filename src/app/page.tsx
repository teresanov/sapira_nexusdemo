import Link from "next/link";
import { ArrowRightCircle, LayoutGrid } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-5xl w-full">
        <header className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-3">
            Demo Sales Engineer
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-black">
            Proyecto Nexus
          </h1>
          <p className="mt-3 text-sm md:text-base text-neutral-600">
            Compras Asia: Gestión de revisiones BOM
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <OnboardingCard
            href="/demo/inbox"
            title="Asistente Guiado"
            description="Simulación paso a paso del proceso de compras."
            icon={<ArrowRightCircle className="w-6 h-6" />}
          />
          <OnboardingCard
            href="/app"
            title="Explorar Producto"
            description="Navegación libre con datos de prueba."
            icon={<LayoutGrid className="w-6 h-6" />}
          />
        </section>
      </div>
    </main>
  );
}

interface OnboardingCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function OnboardingCard({
  href,
  title,
  description,
  icon
}: OnboardingCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between rounded-sm border border-neutral-200 bg-white px-6 py-6 md:px-8 md:py-8 shadow-sm transition hover:border-neutral-400 hover:shadow-md"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-50 text-neutral-900">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-black">
          {title}
        </h2>
      </div>
      <p className="text-sm text-neutral-600 mb-4">
        {description}
      </p>
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>Entrar</span>
        <span className="translate-x-0 transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

