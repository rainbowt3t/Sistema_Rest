# Legacy_Pe - Sistema POS para Restaurante 🍽️

Un sistema de Punto de Venta (POS) premium y moderno desarrollado a la medida para **Legacy_Pe**, diseñado para agilizar la gestión de pedidos en salón, controlar el estado de las mesas en tiempo real y administrar la carta del restaurante de forma dinámica.

---

## ✨ Características Principales

* 🔴 **Diseño Premium Rojo Opaco:** Interfaz elegante rediseñada bajo una paleta oscura con acentos rojo carmesí y un estilo visual premium.
* 🇪🇸 **Traducido al Español:** Localización completa de todas las vistas, alertas, formatos de fecha, moneda (`S/`) y estados operativos en español peruano.
* 🍔 **Carta Dinámica:** Gestión de platos y categorías en tiempo real leídos directamente desde la base de datos de MongoDB.
* 🪑 **Control CRUD de Mesas:** Módulo administrador integrado para listar, crear, editar capacidad de asientos y eliminar mesas del salón.
* 🛡️ **Seguridad por Roles:** Niveles de acceso restringidos para Administradores, Meseros y Cajeros con protección de rutas en el lado del cliente.
* 🧾 **Boletas de Venta:** Generador de boletas e impresión de comprobantes en español personalizadas con la marca **Legacy_Pe**.

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
* Node.js (v18+)
* MongoDB (Local o Atlas)

### Pasos
1. **Clonar o descargar el proyecto**
2. **Configurar el Backend:**
   * Entra a la carpeta `pos-backend` e instala las dependencias: `npm install`
   * Crea un archivo `.env` con las variables correspondientes (puerto, URL de MongoDB, JWT secret).
   * Ejecuta el backend en modo desarrollo: `npm run dev` (esto inicializará la base de datos y sembrará la carta peruana inicial si está vacía).
3. **Configurar el Frontend:**
   * Entra a la carpeta `pos-frontend` e instala las dependencias: `npm install`
   * Crea un archivo `.env` apuntando a tu backend (`VITE_BACKEND_URL=http://localhost:8000`).
   * Inicia el frontend en desarrollo: `npm run dev`

---

## 🌐 Despliegue en AWS EC2 (Servidor)

Para actualizar el servidor con los últimos cambios aplicados:

1. **Memoria Virtual (Swap) para Servidores Micro (AWS EC2):**
   *(Evita que el compilador sea interrumpido por falta de RAM)*
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

2. **Descargar y compilar cambios:**
   ```bash
   cd ~/Sistema_Rest
   git pull origin main
   cd pos-frontend
   npm run build
   ```

3. **Reiniciar los servicios:**
   ```bash
   cd ../pos-backend
   pm2 restart pos-backend
   ```
