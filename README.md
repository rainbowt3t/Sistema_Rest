# Legacy_Pe - Sistema POS para Restaurante 🍽️🇵🇪

Un sistema de Punto de Venta (POS) premium y moderno desarrollado a la medida para **Legacy_Pe**, diseñado para agilizar la gestión de pedidos en salón, controlar el estado de las mesas en tiempo real y administrar la carta del restaurante de forma dinámica.

---

## ✨ Características Principales

*   ✨ **Diseño Rústico & Oro (Bistró Peruano):** Interfaz elegante y sobria rediseñada bajo una paleta oscura con acentos terracota y detalles en oro bistró, ofreciendo un estilo visual de alta cocina.
*   🇪🇸 **Localización al Español:** Formatos de fecha, moneda nacional (`S/`), alertas y estados operativos completamente en español.
*   🧾 **Simulación de Boleta de Venta e IGV (18%):** Generador de comprobantes fiscales formateados con los datos del restaurante e impuestos calculados según la tasa del IGV peruano.
*   🛡️ **Flujo de Trabajo Orientado a Roles:**
    *   **Mesero (Waiter):** Abre mesas registrando comensales, selecciona platos típicos y envía comandas directo a la base de datos sin requerir cobros.
    *   **Cajero (Cashier):** Visualiza mesas activas, carga el detalle de consumo de mesas ocupadas al instante, procesa el cobro con efectivo o banca digital y emite la boleta liberando la mesa.
    *   **Administrador (Admin):** Acceso completo al dashboard de analíticas, control de mesas y edición de la carta.
*   💻 **Optimización de Escala (100% Zoom):** Interfaz responsiva adaptada para todo tipo de pantallas y laptops sin cortes de botones ni solapamiento de elementos.

---

## 🏗️ Tecnología Utilizada

| Componente | Tecnología |
|---|---|
| **Frontend** | React.js, Redux Toolkit, React Query, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, Mongoose |
| **Base de Datos** | MongoDB Atlas |
| **Servidor Web** | Nginx (Proxy Inverso) |
| **Gestión de Procesos** | PM2 |

---

## 🛠️ Instalación y Configuración Local

### Requisitos Previos
*   Node.js (v18+)
*   MongoDB (Local o Atlas)

### Pasos
1.  **Clonar o descargar el proyecto**
2.  **Configurar el Backend:**
    *   Entra a la carpeta `pos-backend` e instala las dependencias: `npm install`
    *   Crea un archivo `.env` con las variables correspondientes (puerto, URL de MongoDB, JWT secret).
    *   Ejecuta el backend: `npm run dev`
3.  **Configurar el Frontend:**
    *   Entra a la carpeta `pos-frontend` e instala las dependencias: `npm install`
    *   Crea un archivo `.env` apuntando a tu backend (`VITE_BACKEND_URL=http://localhost:8000`).
    *   Inicia el frontend: `npm run dev`
