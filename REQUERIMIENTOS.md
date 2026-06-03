# 📄 Software Requirements Specification (SRS)

## Módulo: Checkout y Carrito de Compras

---

### 1. Introducción

**1.1 Propósito**
Este documento define los requerimientos funcionales, reglas de negocio y restricciones de seguridad para el módulo de cálculo de totales del carrito de compras. El sistema debe procesar dinámicamente los productos, aplicar reglas financieras de descuentos y envíos, y mantener la integridad de los datos entre el cliente (Frontend) y el servidor (Backend).

---

### 2. Requerimientos Funcionales (FR - Functional Requirements)

Definen las funciones específicas que el sistema debe ser capaz de realizar.

| ID        | Requerimiento                        | Descripción                                                                                                                                                                                                             |
| :-------- | :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR-01** | **Estructura de Datos del Producto** | Todo producto en el carrito debe contener los atributos obligatorios: `name` (cadena de texto), `price` (numérico), `onSale` (booleano) y `quantity` (entero positivo).                                                 |
| **FR-02** | **Cálculo de Subtotal**              | El sistema debe calcular el subtotal base sumando el resultado individual de cada producto, definido por el precio multiplicado por la cantidad solicitada.                                                             |
| **FR-03** | **Control y Validación de Stock**    | El sistema debe validar que la cantidad solicitada (`quantity`) no exceda el stock disponible en inventario. Esta validación es de cumplimiento estricto en el Backend, independientemente de los bloqueos de interfaz. |
| **FR-04** | **Procesamiento de Cupones**         | El sistema debe aceptar la entrada de códigos promocionales y recalcular los totales en base a la regla de negocio asociada al cupón activo.                                                                            |

---

### 3. Reglas de Negocio (BR - Business Rules)

Restricciones y lógicas comerciales que el código debe respetar estrictamente para el cálculo de costos.

| ID        | Requerimiento                          | Descripción                                                                                                                                                                                                                                                    |
| :-------- | :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BR-01** | **Exclusión de Ofertas en Descuentos** | El cupón `"DESCUENTO10"` otorga un 10% de reducción sobre el costo. Sin embargo, este porcentaje **solo debe aplicarse a la sumatoria de productos regulares**. Los productos marcados con la propiedad `onSale: true` quedan excluidos de este cálculo.       |
| **BR-02** | **Tope Máximo Promocional**            | El beneficio otorgado por el cupón `"DESCUENTO10"` tiene un límite absoluto. El sistema no podrá descontar más de **$15.00** por transacción, independientemente del subtotal elegible.                                                                        |
| **BR-03** | **Umbral de Envío Gratuito**           | El costo de envío se determina evaluando el **Total Neto** (Subtotal - Descuento). Si el Total neto es estrictamente mayor a **50.00** el envío es gratuito. Si el Total Neto es menor o igual a **50.00**, se debe aplicar un cargo fijo de envío de **5.00** |

---

### 4. Requerimientos No Funcionales y Seguridad (NFR/SEC)

Restricciones de arquitectura, precisión de datos y protección contra vulnerabilidades.

| ID         | Requerimiento                 | Descripción                                                                                                                                                                                                            |
| :--------- | :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NFR-01** | **Precisión Financiera**      | Todos los valores monetarios de salida (Subtotal, Descuento, Envío y Total final) deben estar formateados estrictamente a un máximo de **2 decimales** para mitigar errores de coma flotante.                          |
| **SEC-01** | **Prevención de Estado Nulo** | El sistema no debe procesar transacciones sin productos. Tanto el Frontend como el Backend deben validar y bloquear las peticiones si el arreglo del carrito está vacío, no existe o contiene una estructura corrupta. |
| **SEC-02** | **Sanitización de Entradas**  | El Backend debe rechazar cualquier carga útil (payload) donde la propiedad `quantity` contenga valores cero, números negativos o números fraccionales/flotantes.                                                       |
