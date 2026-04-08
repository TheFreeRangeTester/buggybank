export type QaScope = "global" | "login" | "dashboard" | "transfers" | "transactions" | "profile";

export type QaHintPlacement = "banner" | "tooltip" | "observation";

export type QaHintSeverity = "low" | "medium" | "high";

export type QaHintDifficulty = "starter" | "intermediate" | "advanced";

export type QaEvent =
  | "login_view"
  | "login_submit"
  | "login_error"
  | "login_success"
  | "dashboard_view"
  | "transfer_submit"
  | "transfer_success"
  | "transfer_duplicate"
  | "transactions_view"
  | "transactions_filter_change"
  | "profile_view"
  | "profile_submit"
  | "profile_saved";

export type QaHintTrigger = {
  event?: QaEvent;
  minCount?: number;
};

export type QaHintItem = {
  id: string;
  scope: QaScope;
  placement: QaHintPlacement;
  severity: QaHintSeverity;
  difficulty: QaHintDifficulty;
  title: string;
  message: string;
  trigger?: QaHintTrigger;
};

export const qaHintsCatalog: QaHintItem[] = [
  {
    id: "login-errors-copy",
    scope: "login",
    placement: "banner",
    severity: "low",
    difficulty: "starter",
    title: "Consistencia de mensajes",
    message: "¿El mensaje de error se mantiene consistente entre validación y credenciales inválidas?"
  },
  {
    id: "login-network-vs-validation",
    scope: "login",
    placement: "observation",
    severity: "medium",
    difficulty: "intermediate",
    title: "Tipos de fallo",
    message: "Compará errores de red versus errores funcionales: ¿la experiencia diferencia ambos casos?",
    trigger: { event: "login_error", minCount: 1 }
  },
  {
    id: "dashboard-balance-sync",
    scope: "dashboard",
    placement: "banner",
    severity: "high",
    difficulty: "starter",
    title: "Saldo cruzado",
    message: "¿Este saldo coincide con el que ves en otras pantallas?"
  },
  {
    id: "dashboard-after-transfer",
    scope: "dashboard",
    placement: "observation",
    severity: "high",
    difficulty: "advanced",
    title: "Post-transfer",
    message: "Después de transferir, recargá vistas diferentes y contrastá resultados.",
    trigger: { event: "transfer_success", minCount: 1 }
  },
  {
    id: "transfer-double-action",
    scope: "transfers",
    placement: "banner",
    severity: "high",
    difficulty: "intermediate",
    title: "Acciones repetidas",
    message: "¿Qué pasaría si enviás esta acción dos veces muy rápido?",
    trigger: { event: "transfer_submit", minCount: 1 }
  },
  {
    id: "transfer-amount-limits",
    scope: "transfers",
    placement: "tooltip",
    severity: "medium",
    difficulty: "starter",
    title: "Límites",
    message: "Probá montos extremos y verificá comportamiento de validación visual y backend."
  },
  {
    id: "transfer-duplicate-observation",
    scope: "transfers",
    placement: "observation",
    severity: "high",
    difficulty: "advanced",
    title: "Doble impacto",
    message: "Revisá historial y saldo luego de un envío repetido para detectar impacto doble.",
    trigger: { event: "transfer_duplicate", minCount: 1 }
  },
  {
    id: "tx-order-recent-first",
    scope: "transactions",
    placement: "banner",
    severity: "medium",
    difficulty: "starter",
    title: "Orden temporal",
    message: "¿El orden de los movimientos siempre refleja lo más reciente?"
  },
  {
    id: "tx-filter-direction",
    scope: "transactions",
    placement: "tooltip",
    severity: "high",
    difficulty: "intermediate",
    title: "Filtro de dirección",
    message: "Al filtrar por entrantes/salientes, validá que cada fila corresponda al tipo esperado.",
    trigger: { event: "transactions_filter_change", minCount: 1 }
  },
  {
    id: "tx-filter-combinations",
    scope: "transactions",
    placement: "observation",
    severity: "medium",
    difficulty: "advanced",
    title: "Combinación de filtros",
    message: "Combiná búsqueda corta con tipo de movimiento para confirmar estabilidad del resultado.",
    trigger: { event: "transactions_filter_change", minCount: 2 }
  },
  {
    id: "profile-edge-cases",
    scope: "profile",
    placement: "banner",
    severity: "medium",
    difficulty: "starter",
    title: "Campos límite",
    message: "¿Qué pasa con valores vacíos, largos o con formato inesperado?"
  },
  {
    id: "profile-format-tooltip",
    scope: "profile",
    placement: "tooltip",
    severity: "low",
    difficulty: "starter",
    title: "Formato de datos",
    message: "Probá variaciones de longitud y formato para validar robustez del formulario."
  },
  {
    id: "profile-save-consistency",
    scope: "profile",
    placement: "observation",
    severity: "low",
    difficulty: "intermediate",
    title: "Persistencia",
    message: "Guardá y recargá: verificá que lo mostrado coincida con lo persistido.",
    trigger: { event: "profile_saved", minCount: 1 }
  },
  {
    id: "global-regression-mindset",
    scope: "global",
    placement: "observation",
    severity: "low",
    difficulty: "starter",
    title: "Mentalidad tester",
    message: "Cuando encuentres un comportamiento raro, repetilo en otro flujo para descartar regresiones laterales."
  }
];
