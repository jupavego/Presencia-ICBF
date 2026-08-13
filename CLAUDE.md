# Instrucciones del proyecto

## Servidores de desarrollo — regla absoluta

**Nunca iniciar, detener o reiniciar ningún servidor de desarrollo (`npm
run dev`, Vite, o cualquier otro) sin confirmación explícita del usuario
en el chat**, incluyendo:

- Elegir un puerto alterno para "resolver" un conflicto de puerto — un
  puerto ocupado es información (algo más está corriendo ahí), no un
  obstáculo a rodear. Detente y pregunta.
- Reiniciar un servidor ya corriendo, aunque sea para que tome cambios
  recientes (ej. tras `npm install`).
- Levantar un segundo servidor "solo para probar algo rápido" mientras
  ya hay uno corriendo.

El usuario administra el ciclo de vida de sus propios servidores. Si
necesitas verificar algo en el navegador y no hay servidor corriendo (o
el puerto esperado está ocupado por otra cosa), pregunta cómo proceder en
vez de decidir por tu cuenta — aunque parezca la solución obvia.

**Motivo:** una decisión autónoma de abrir un segundo servidor en un
puerto alterno, en vez de preguntar al toparse con un conflicto de
puerto, generó confusión sobre qué versión de la app se estaba viendo y
varias vueltas de investigación innecesarias para reconciliarlo.

## Estructura de carpetas: worktree vs. checkout principal

Este repositorio puede tener **más de un árbol de trabajo (git worktree)
activo al mismo tiempo**, cada uno en su propia carpeta y rama:

- Checkout principal: `DEF` (rama `main`), con el código de la app en
  `DEF\app`
- Cada worktree adicional: `DEF\.claude\worktrees\<nombre>` (rama
  `claude/<nombre>`), con el código de la app en
  `DEF\.claude\worktrees\<nombre>\app`

Para confirmar la lista real de worktrees activos y su rama: `git
worktree list` (con `-c safe.directory=<ruta>` si hace falta).

Son carpetas físicamente distintas. Un servidor arrancado desde una no
refleja los cambios de la otra, y trabajo sin commitear en una **no es
visible** en la otra hasta que se copie o se commitee y se mezcle. Si algo
parece faltar o no coincide entre lo que se ve en el navegador y lo que
se esperaría, antes de asumir un error verificar:

1. ¿Desde qué carpeta está corriendo el servidor? (`Get-CimInstance
   Win32_Process` o equivalente, sobre el PID que ocupa el puerto)
2. ¿Hay cambios sin commitear en el checkout principal que no están en
   este worktree? (`git -c safe.directory=<ruta> status --short` en cada
   carpeta)

Explicar el hallazgo al usuario antes de mover o sobrescribir cualquier
archivo entre las dos carpetas.
