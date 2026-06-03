# 🚀 Prueba Técnica: QA Automation Engineer

¡Hola! Bienvenido/a a la prueba técnica. Hemos preparado un entorno simulado de un "Carrito de Compras" que cuenta con varios problemas intencionales. Tu misión es analizar la aplicación, detectar las fallas, documentarlas profesionalmente y asegurar su calidad mediante automatización.

No buscamos la "perfección", sino entender tu proceso mental, tu capacidad analítica y cómo te desenvuelves enfrentando código legado.

---

## 🎯 1. Objetivo de la Prueba y Habilidades a Evaluar

Esta prueba está diseñada para evaluar un enfoque integral de Calidad (QA), abarcando desde el entendimiento del negocio hasta la ejecución técnica. Se evaluarán las siguientes competencias:

- **Análisis de Bugs y Casos de Uso:** Capacidad para leer los requerimientos (SRS), diseñar casos de prueba (incluyendo casos de esquina y valores límite) y detectar desviaciones lógicas o de seguridad.
- **Reportes y Documentación:** Claridad, precisión y profesionalismo al documentar hallazgos. Un buen reporte debe ser reproducible por cualquier desarrollador.
- **Automatización de Pruebas (Unitarias e Integrales):** Habilidad para escribir scripts robustos y mantenibles. Esperamos ver pruebas de API/Unitarias para el Backend y pruebas End-to-End (E2E) o de Integración para el Frontend. (Puedes usar las herramientas de tu preferencia: Cypress, Playwright, Jest, etc.).
- **Comprensión Técnica:** Tu habilidad para leer, interpretar e interactuar con el código base (React + Node.js) para entender por qué ocurre un fallo.

---

## 🛠️ 2. Cómo Ejecutar la Aplicación

La aplicación está completamente dockerizada para que no tengas que instalar dependencias locales.

### Iniciar el entorno en modo "Watch" (Desarrollo)

Para correr la aplicación y permitir que los cambios en el código se reflejen en tiempo real (Hot Reloading), abre tu terminal en la raíz del proyecto y ejecuta:

```bash
docker compose watch
```

### Accesos

- **Interfaz de Usuario (Frontend):** `http://localhost:5173`
- **API del Servidor (Backend):** `http://localhost:3000/api/checkout`

La interfaz incluye un "Sandbox" dinámico que te permitirá agregar productos, modificar cantidades y vaciar el carrito manualmente para facilitar tu exploración inicial (Exploratory Testing).

---

## 📦 3. Entregables Esperados (Cómo resolver la prueba)

Para considerar la prueba completada, deberás entregar lo siguiente (puede ser en un repositorio de GitHub, un archivo ZIP o un documento Markdown adjunto):

1. **Test Plan / Casos de Prueba:** Una lista breve pero estructurada de los escenarios que decidiste probar basándote en los requerimientos.
2. **Bug Report (Matriz de Errores):** Un documento o tabla detallando los bugs encontrados. Debe incluir pasos para reproducir, resultado esperado, resultado actual y nivel de severidad.
3. **Código de Automatización:** Los scripts de prueba que creaste para validar la aplicación y atrapar los bugs reportados de forma automatizada. Se evaluará la limpieza del código y las aserciones (assertions) utilizadas.

---

## ⭐ 4. Puntos Extra: Corrección de Bugs (Shift-Left Testing)

Como QA, tu trabajo principal es detectar y prevenir errores. Sin embargo, en un equipo ágil, **el código no es territorio exclusivo de los desarrolladores**.

Si bien **no es un requisito obligatorio** para pasar la prueba, se considerará un gran plus (y demostrará un perfil técnico avanzado) si te animas a abrir el código fuente, identificar la línea exacta que causa el problema y **proponer o aplicar la corrección (Bug Fix)**. Corregir los errores demuestra una alta capacidad de análisis de causa raíz y te posiciona como un ingeniero de calidad capaz de aportar soluciones directas al equipo de desarrollo.

¡Mucho éxito y diviértete rompiendo la aplicación!
