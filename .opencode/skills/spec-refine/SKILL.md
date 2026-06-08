---
name: spec-refine
description: Refina especificaciones a partir de historias de usuario. Identifica suposiciones, las valida una por una con el usuario mediante preguntas con barra de progreso, y genera una especificación completa.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: specification
---

## Qué hace este skill

Recibe una historia de usuario, identifica todas las suposiciones no técnicas ni funcionales que hizo para completar los espacios en blanco, las presenta en un listado numerado, y luego refinementa iterativamente con el usuario mediante preguntas una a una con barra de progreso y opciones sugeridas.

## Flujo de trabajo

### Fase 1 — Análisis y listado de suposiciones

Cuando recibas una historia de usuario, haz lo siguiente:

1. Lee la historia de usuario con atención.
2. Identifica cada cosa que **asumiste** para llenar los espacios en blanco de la especificación. Solo incluye suposiciones **no técnicas y no funcionales** — es decir, decisiones de negocio, comportamiento esperado, reglas de dominio, flujos de usuario, priorización, etc. No incluyas suposiciones sobre tecnologías, frameworks, o implementación.
3. Presenta las suposiciones como un **listado numerado**, una por línea, en este formato:

```
## Suposiciones identificadas

1. [Suposición 1]
2. [Suposición 2]
3. [Suposición 3]
...
N. [Suposición N]

Indica los números de las suposiciones que no te gusten, o escribe "todas ok" si estás de acuerdo con todas.
```

4. Espera la respuesta del usuario. El usuario puede indicar números separados por comas (ej: "2, 5, 7") o "todas ok".

### Fase 2 — Refinamiento iterativo

Por cada suposición que el usuario rechazó:

1. Formula una **pregunta clara y específica** sobre esa suposición.
2. Presenta **4 opciones sugeridas** como posibles respuestas, más una quinta opción "Otra". Las opciones deben ser concretas, realistas y variadas.
3. Incluye una **barra de progreso** que muestre cuántas preguntas llevas y cuántas faltan, en este formato:

```
📋 Progreso: [███░░░░░░░] 3/10 preguntas

**Pregunta 3 de 10:**

¿Cómo debe comportarse el sistema cuando...?

1. Opción A — descripción breve
2. Opción B — descripción breve
3. Opción C — descripción breve
4. Opción D — descripción breve
5. Otra (especifica tu respuesta)
```

4. Espera la respuesta del usuario. Puede elegir un número (1-4) o "5" para escribir su propia respuesta.
5. Si elige "Otra", pregunta: "Escribe tu respuesta:" y espera.
6. Registra la nueva definición y avanza a la siguiente pregunta.
7. Repite hasta haber cubierto todas las suposiciones rechazadas.

### Fase 3 — generación de especificación

Una vez completadas todas las preguntas, muestra el mensaje:

```
✅ Todas las suposiciones han sido refinadas. Estoy listo para crear la especificación final.

¿Quieres que genere la especificación ahora? (sí/no)
```

Si el usuario responde "sí", genera una especificación completa y detallada con:

- **Título** del feature
- **Contexto** del problema
- **Historia de usuario** refinada
- **Criterios de aceptación** (en formato Given/When/Then cuando aplique)
- **Reglas de negocio** derivadas del refinamiento
- **Flujos principales y alternativos**
- **Notas adicionales**

La especificación debe estar escrita en **español**, ser clara, concisa y sin ambigüedades.

## Reglas importantes

- NUNCA escribas código durante este flujo. Solo especificaciones.
- Las suposiciones deben ser sobre **negocio y comportamiento**, no sobre tecnología.
- Si la historia de usuario ya está completa y no tiene espacios en blanco, dilo explícitamente: "La historia de usuario está completa. No encontré suposiciones para refinar."
- Las opciones sugeridas deben ser diversas y cubrir escenarios realistas.
- La barra de progreso SIEMPRE debe mostrarse en cada pregunta de la Fase 2.
- Mantén un tono profesional pero cercano.
- Toda la interacción debe ser en español.