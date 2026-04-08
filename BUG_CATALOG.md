# BUG_CATALOG.md

Catálogo inicial de bugs intencionales para entrenamiento de testing manual y automation en BuggyBank.

## BUG-001
- ID: `BUG-001`
- título: Doble transferencia por reenvío rápido
- módulo: Transferencias
- severidad: Alta
- descripción: En ciertas condiciones, una transferencia se registra dos veces y duplica el impacto en saldo.
- precondiciones:
  - Usuario autenticado.
  - Bug flag `doubleSubmit` activo.
- pasos para reproducir:
  1. Ir a `/transfers`.
  2. Completar transferencia con monto entero alto (por ejemplo `500`) o forzar header `x-bb-submit-burst: 1` en automation.
  3. Enviar la transferencia.
  4. Revisar historial y saldos.
- comportamiento esperado: Una sola transacción y un solo ajuste de saldo.
- comportamiento actual: Se crean dos transacciones y saldo impactado dos veces.
- tipo de testing que más probablemente lo detecta: E2E automation, pruebas de concurrencia/idempotencia, testing exploratorio de estrés de UI.
- si el QA Mode da pistas, cuáles son:
  - `transfer-double-action`: “¿Qué pasaría si enviás esta acción dos veces muy rápido?”
  - `transfer-duplicate-observation` (desbloqueado tras duplicación): revisar historial/saldos.
- si el bug es de frontend, backend o integración: Backend + integración.

## BUG-002
- ID: `BUG-002`
- título: Orden cronológico incorrecto en historial para filtros específicos
- módulo: Historial de transacciones
- severidad: Media
- descripción: El historial puede devolverse en orden ascendente en lugar de descendente para ciertos usuarios/filtros.
- precondiciones:
  - Usuario `diego@buggybank.local` autenticado.
  - Bug flag `historyOrder` activo.
- pasos para reproducir:
  1. Ir a `/transactions` con Diego.
  2. Cambiar filtro de dirección a `incoming` o `outgoing`.
  3. Observar el orden temporal de filas.
- comportamiento esperado: Siempre mostrar primero los movimientos más recientes.
- comportamiento actual: Para combinaciones específicas, muestra primero los más antiguos.
- tipo de testing que más probablemente lo detecta: API testing con asserts de orden, UI automation de sorting, regresión funcional.
- si el QA Mode da pistas, cuáles son:
  - `tx-order-recent-first`: “¿El orden de los movimientos siempre refleja lo más reciente?”
- si el bug es de frontend, backend o integración: Backend.

## BUG-003
- ID: `BUG-003`
- título: Filtro “Entrantes” devuelve salientes con query corta
- módulo: Historial de transacciones
- severidad: Alta
- descripción: El filtro de dirección aplica lógica invertida en escenarios de búsqueda corta.
- precondiciones:
  - Bug flag `brokenFilter` activo.
- pasos para reproducir:
  1. Ir a `/transactions`.
  2. Seleccionar `Entrantes`.
  3. Escribir búsqueda corta (1–2 caracteres), por ejemplo `re`.
  4. Revisar tipo real de movimientos listados.
- comportamiento esperado: Solo movimientos entrantes.
- comportamiento actual: Puede devolver movimientos salientes.
- tipo de testing que más probablemente lo detecta: Pruebas combinatorias de filtros, automation data-driven, exploratory testing.
- si el QA Mode da pistas, cuáles son:
  - `tx-filter-direction`
  - `tx-filter-combinations`
- si el bug es de frontend, backend o integración: Backend + integración.

## BUG-004
- ID: `BUG-004`
- título: Dashboard muestra saldo cacheado desalineado del detalle
- módulo: Dashboard / Cuentas
- severidad: Alta
- descripción: El total del dashboard puede provenir de valor cacheado, mientras detalle usa saldo actualizado.
- precondiciones:
  - Bug flag `staleDashboardBalance` activo.
  - Haber realizado al menos una transferencia reciente.
- pasos para reproducir:
  1. Ejecutar transferencia en `/transfers`.
  2. Ir a `/dashboard`.
  3. Comparar total consolidado con suma de cuentas y otras vistas.
- comportamiento esperado: Total y detalle coherentes entre pantallas.
- comportamiento actual: Divergencia temporal o persistente entre total y detalle.
- tipo de testing que más probablemente lo detecta: Testing de consistencia cross-page, E2E de negocio, pruebas de regresión de saldos.
- si el QA Mode da pistas, cuáles son:
  - `dashboard-balance-sync`
  - `dashboard-after-transfer` (desbloqueado tras transferir)
- si el bug es de frontend, backend o integración: Backend + integración.

## BUG-005
- ID: `BUG-005`
- título: Validaciones backend laxas en transferencia
- módulo: Transferencias API
- severidad: Alta
- descripción: Con flag activo, backend acepta inputs que deberían rechazarse (monto inválido / combinaciones límite).
- precondiciones:
  - Bug flag `weakValidation` activo.
- pasos para reproducir:
  1. Enviar `POST /api/transfers` con payload inválido (por ejemplo, monto negativo o estructura incompleta según caso).
  2. Revisar respuesta y side effects.
- comportamiento esperado: `400` con error de validación consistente.
- comportamiento actual: En algunos casos procesa o responde de forma no estricta.
- tipo de testing que más probablemente lo detecta: API testing, contract testing, boundary testing.
- si el QA Mode da pistas, cuáles son:
  - `transfer-amount-limits` (tooltip)
- si el bug es de frontend, backend o integración: Backend.

## BUG-006
- ID: `BUG-006`
- título: Mensajes de error inconsistentes (idioma/semántica)
- módulo: Login, Transferencias, Perfil
- severidad: Media
- descripción: Para errores similares, los mensajes varían entre inglés/español o entre textos técnicos/funcionales.
- precondiciones:
  - Bug flag `inconsistentErrors` activo.
- pasos para reproducir:
  1. Forzar error en login (credencial inválida).
  2. Forzar error de cuentas inválidas en transfer.
  3. Forzar error de perfil inválido.
  4. Comparar textos devueltos.
- comportamiento esperado: Taxonomía uniforme de errores y copy consistente.
- comportamiento actual: Mensajes heterogéneos (`Auth failed`, `Account mismatch`, etc.).
- tipo de testing que más probablemente lo detecta: UI copy testing, API contract testing, pruebas de UX funcional.
- si el QA Mode da pistas, cuáles son:
  - `login-errors-copy`
  - `login-network-vs-validation`
- si el bug es de frontend, backend o integración: Integración (copy frontend + payload backend).

## BUG-007
- ID: `BUG-007`
- título: Bypass de edge case “misma cuenta origen/destino”
- módulo: Transferencias
- severidad: Media
- descripción: Con configuración de edge cases, se relaja regla de no transferir a la misma cuenta.
- precondiciones:
  - Bug flag `edgeCases` activo.
- pasos para reproducir:
  1. En `/transfers`, seleccionar misma cuenta en origen y destino.
  2. Enviar formulario.
- comportamiento esperado: Bloqueo con error claro.
- comportamiento actual: Puede no bloquear en backend según configuración.
- tipo de testing que más probablemente lo detecta: Edge-case testing, pruebas negativas de formularios/API.
- si el QA Mode da pistas, cuáles son:
  - `transfer-amount-limits`
  - `transfer-double-action` (indirecta sobre robustez del flujo)
- si el bug es de frontend, backend o integración: Backend + integración.

## BUG-008
- ID: `BUG-008`
- título: Botón visualmente “deshabilitado” pero operable
- módulo: UI Transferencias
- severidad: Media
- descripción: El botón puede verse deshabilitado por estilo, pero seguir permitiendo ejecución en cierta condición.
- precondiciones:
  - Bug flag `fakeDisabledButton` activo.
  - Monto alto (ej. `>= 900`).
- pasos para reproducir:
  1. Ir a `/transfers`.
  2. Ingresar monto alto.
  3. Observar apariencia del botón.
  4. Clickear botón y verificar si se procesa.
- comportamiento esperado: Si se muestra deshabilitado, no debe ejecutar acción.
- comportamiento actual: Puede ejecutar la transferencia pese a apariencia deshabilitada.
- tipo de testing que más probablemente lo detecta: UI behavior testing, accessibility/semantics testing, automation visual + funcional.
- si el QA Mode da pistas, cuáles son:
  - `transfer-double-action`
  - `transfer-amount-limits`
- si el bug es de frontend, backend o integración: Frontend + integración.

## BUG-009
- ID: `BUG-009`
- título: Búsqueda de historial sensible a mayúsculas/minúsculas
- módulo: Historial de transacciones
- severidad: Baja
- descripción: La búsqueda por nota usa comparación simple y puede omitir resultados esperados por casing.
- precondiciones:
  - Tener notas con variaciones de mayúsculas/minúsculas.
- pasos para reproducir:
  1. Ir a `/transactions`.
  2. Buscar por término con casing distinto al persistido.
  3. Comparar resultados con expectativa del usuario.
- comportamiento esperado: Búsqueda case-insensitive en texto libre.
- comportamiento actual: Búsqueda case-sensitive parcial.
- tipo de testing que más probablemente lo detecta: Functional exploratory testing, data-driven UI tests.
- si el QA Mode da pistas, cuáles son:
  - `tx-filter-combinations`
- si el bug es de frontend, backend o integración: Backend.

## BUG-010
- ID: `BUG-010`
- título: Hint progresivo dependiente de evento no siempre visible para flujo alternativo
- módulo: QA Mode
- severidad: Baja
- descripción: Algunos hints de observación se desbloquean solo por eventos concretos; si el usuario sigue un flujo alternativo, no aparecen aunque el riesgo exista.
- precondiciones:
  - QA Mode activo.
- pasos para reproducir:
  1. Navegar directo a pantalla sin ejecutar evento disparador.
  2. Abrir panel “Observaciones del sistema”.
  3. Verificar hints disponibles.
- comportamiento esperado: Cobertura pedagógica consistente para caminos alternativos.
- comportamiento actual: Parte de hints queda oculta hasta cumplir trigger específico.
- tipo de testing que más probablemente lo detecta: Exploratory testing orientado a UX didáctica, pruebas de estados del sistema.
- si el QA Mode da pistas, cuáles son:
  - Este bug afecta al propio mecanismo de pistas.
- si el bug es de frontend, backend o integración: Frontend (lógica de experiencia QA).
