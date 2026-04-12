export type ChallengeDifficulty = "starter" | "intermediate" | "advanced";
export type ChallengeMode = "manual" | "automation" | "hybrid";

export type ChallengeItem = {
  id: string;
  title: string;
  module: "login" | "dashboard" | "transfers" | "transactions" | "profile" | "integration";
  difficulty: ChallengeDifficulty;
  mode: ChallengeMode;
  objective: string;
  bugTargets: string[];
  steps: string[];
  playwrightIdea: string;
  assertionHint: string;
};

export const challengesCatalog: ChallengeItem[] = [
  {
    id: "CH-001",
    title: "Errores de login consistentes",
    module: "login",
    difficulty: "starter",
    mode: "manual",
    objective: "Validar consistencia de mensajes de error según causa real.",
    bugTargets: ["BB-001"],
    steps: [
      "Probar email inválido y password corta.",
      "Probar credenciales con formato válido pero password incorrecta.",
      "Comparar copy, tono y semántica del mensaje."
    ],
    playwrightIdea: "Automatizar dos flujos de login inválido y capturar texto de alerta.",
    assertionHint: "Los mensajes deberían ser coherentes para escenarios equivalentes."
  },
  {
    id: "CH-002",
    title: "Doble submit de transferencias",
    module: "transfers",
    difficulty: "intermediate",
    mode: "hybrid",
    objective: "Detectar si una misma intención de pago impacta más de una vez.",
    bugTargets: ["BB-003"],
    steps: [
      "Enviar transferencia con doble click rápido.",
      "Revisar saldo de origen y destino.",
      "Confirmar cantidad de movimientos generados."
    ],
    playwrightIdea: "Disparar `Promise.all([click, click])` sobre botón de transferir.",
    assertionHint: "Una intención del usuario debería generar una sola transacción efectiva."
  },
  {
    id: "CH-003",
    title: "Saldo cruzado entre vistas",
    module: "integration",
    difficulty: "starter",
    mode: "manual",
    objective: "Comparar consistencia de saldo entre dashboard y otras pantallas.",
    bugTargets: ["BB-004"],
    steps: [
      "Tomar saldo total en dashboard.",
      "Realizar una transferencia.",
      "Contrastar contra suma de cuentas y recargas de pantalla."
    ],
    playwrightIdea: "Leer saldo total y luego sumar saldos de cards para comparar.",
    assertionHint: "La fuente de verdad del saldo debería coincidir en todas las vistas."
  },
  {
    id: "CH-004",
    title: "Orden temporal de movimientos",
    module: "transactions",
    difficulty: "intermediate",
    mode: "automation",
    objective: "Verificar que la tabla respete orden cronológico esperado.",
    bugTargets: ["BB-005"],
    steps: [
      "Aplicar filtro de dirección.",
      "Capturar primeros 5 timestamps.",
      "Comprobar orden descendente reciente->antiguo."
    ],
    playwrightIdea: "Extraer columnas de fecha y validar sort con comparador Date.",
    assertionHint: "No debería invertirse el orden por usuario ni por filtro."
  },
  {
    id: "CH-005",
    title: "Filtro defectuoso por dirección",
    module: "transactions",
    difficulty: "advanced",
    mode: "hybrid",
    objective: "Detectar resultados incorrectos al combinar dirección + búsqueda.",
    bugTargets: ["BB-006"],
    steps: [
      "Filtrar por entrantes.",
      "Agregar término de búsqueda corto.",
      "Validar si aparecen filas que no cumplen dirección."
    ],
    playwrightIdea: "Iterar filas y chequear semántica de cada movimiento mostrado.",
    assertionHint: "Toda fila listada debe cumplir simultáneamente todos los filtros activos."
  },
  {
    id: "CH-006",
    title: "Formato de fecha consistente",
    module: "transactions",
    difficulty: "starter",
    mode: "manual",
    objective: "Detectar variaciones de formato y localización de fecha.",
    bugTargets: ["BB-007"],
    steps: [
      "Recorrer tabla de movimientos.",
      "Anotar patrones de formato distintos.",
      "Confirmar impacto en legibilidad y orden."
    ],
    playwrightIdea: "Regex por formato esperado para cada fila de fecha.",
    assertionHint: "Un mismo contexto de UI debería mantener un formato homogéneo."
  },
  {
    id: "CH-007",
    title: "Edge cases de perfil",
    module: "profile",
    difficulty: "intermediate",
    mode: "manual",
    objective: "Validar diferencias entre reglas de frontend y backend.",
    bugTargets: ["BB-008"],
    steps: [
      "Ingresar nombre casi vacío o teléfono excesivo.",
      "Observar bloqueo visual del botón.",
      "Intentar persistir y revisar respuesta."
    ],
    playwrightIdea: "Enviar payload directo vía API para contraste con UI.",
    assertionHint: "Las reglas deberían alinearse entre cliente y servidor."
  },
  {
    id: "CH-008",
    title: "Botón visualmente deshabilitado",
    module: "transfers",
    difficulty: "advanced",
    mode: "automation",
    objective: "Comprobar si un botón parece disabled pero sigue accionable.",
    bugTargets: ["BB-009"],
    steps: [
      "Elegir monto alto cercano al umbral.",
      "Observar estilo de botón.",
      "Forzar click y confirmar si ejecuta acción."
    ],
    playwrightIdea: "Intentar click con `force: true` y validar side-effects.",
    assertionHint: "Estado visual y comportamiento funcional deben estar sincronizados."
  },
  {
    id: "CH-009",
    title: "Regresión lateral post-transfer",
    module: "integration",
    difficulty: "advanced",
    mode: "hybrid",
    objective: "Detectar efectos colaterales en módulos no tocados por la acción principal.",
    bugTargets: ["BB-003", "BB-004", "BB-005"],
    steps: [
      "Realizar una transferencia límite.",
      "Ir a dashboard y movimientos sin recargar sesión.",
      "Comparar datos y coherencia cruzada."
    ],
    playwrightIdea: "Ejecutar flujo E2E completo y capturar snapshots de valores clave.",
    assertionHint: "Un cambio en un módulo no debería romper consistencia global."
  },
  {
    id: "CH-010",
    title: "Contratos API para errores",
    module: "integration",
    difficulty: "intermediate",
    mode: "automation",
    objective: "Validar uniformidad del contrato de errores entre endpoints.",
    bugTargets: ["BB-002"],
    steps: [
      "Provocar errores en login, profile y transfers.",
      "Comparar status code + payload.",
      "Revisar nomenclatura de campos."
    ],
    playwrightIdea: "Consumir endpoints con `request` fixture y comparar shape.",
    assertionHint: "La API debería devolver estructura consistente para errores comparables."
  }
];
