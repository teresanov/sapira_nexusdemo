// Textos de los 9 pasos según PRD sección 7.2 (en español)

export const DEMO_STEPS = [
  {
    step: 1,
    title: "Leer email desde la bandeja",
    description:
      "Se muestra el correo seleccionado con su remitente, asunto y adjuntos (Excel/CSV) para procesar la revisión del BOM."
  },
  {
    step: 2,
    title: "Extraer metadatos (proyecto, revisión, fecha)",
    description:
      "El sistema identifica el Project ID (ej. PRJ-2007) y el Revision ID (ej. Rev07), además de la fecha de recepción."
  },
  {
    step: 3,
    title: "Validar adjunto",
    description:
      "Se comprueba que el archivo adjunto sea válido y esté en el formato esperado. Si hay incidencias, se registran."
  },
  {
    step: 4,
    title: "Normalizar BOM al esquema canónico",
    description:
      "El archivo se convierte en una tabla canónica de líneas BOM (código, descripción, UOM, cantidad, categoría, proveedor)."
  },
  {
    step: 5,
    title: "Detectar revisión anterior (lineage)",
    description:
      "Se determina si es la primera revisión (baseline) o se compara contra la revisión anterior para calcular cambios."
  },
  {
    step: 6,
    title: "Plan de acción de compras por proveedor",
    description:
      "Se construye el plan de compras agrupado por proveedor: qué comprar (añadidos), qué cancelar (eliminados) y qué cantidades han cambiado."
  },
  {
    step: 7,
    title: "Calcular delta (añadidos, eliminados, cambios de cantidad)",
    description:
      "Se calcula la diferencia entre revisiones: líneas nuevas, líneas dadas de baja y líneas con cantidad modificada (antigua → nueva)."
  },
  {
    step: 8,
    title: "Generar borradores consolidados por proveedor",
    description:
      "Se generan borradores de email por proveedor (actualizaciones de cantidad, cancelaciones, nuevos ítems) para revisar y editar antes de enviar."
  },
  {
    step: 9,
    title: "Envío simulado",
    description:
      "Se simula el envío de los correos. Los borradores pasan a estado «enviado» y se muestra la línea temporal del proceso."
  }
] as const;

export function getStepInfo(step: number) {
  return DEMO_STEPS.find((s) => s.step === step) ?? DEMO_STEPS[0];
}
