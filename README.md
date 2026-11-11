# DAOM FyAF Web — Guía de Operación y Mantenimiento

Sitio web oficial del **Gimnasio de Fuerza y Acondicionamiento Físico (FyAF) del Club DAOM**.

---

## 1. Arquitectura del Sistema

- **Frontend / SSR:** Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- **Fuente de Verdad Operativa:** Planilla Google Sheets `DAOM_FyAF_Fuente_Oficial` (ID: `1a0uzrxAhvXyOn0wjDxwnTWU1EC9BWT3Xr2Q3GFkDvP4`).
- **Adaptador de Datos:** Consumo mediante endpoints directos `gviz/tq` (sin costos ni dependencias de service accounts de pago).
- **Caché y Resiliencia:** 5 minutos de revalidación (`revalidate: 300`) con tolerancia a fallas. Si Google Sheets está temporalmente inaccesible o en preparación, se sirve la última caché válida o el dataset oficial institucional verificado.
- **Panel Multimedia:** Interfaz administrativa protegida en `/admin` para gestionar imágenes, encuadres (zoom, punto focal X/Y) y textos alternativos accesibles con sincronización en tiempo real con las ubicaciones de la landing.
- **Infraestructura:** Listo para despliegue en Render (Tier Free) con blueprint `render.yaml`.

---

## 2. Actualización de Datos desde Google Sheets

Cualquier cambio operativo realizado en la planilla oficial se refleja automáticamente en la web en un intervalo máximo de 5 minutos, sin necesidad de compilar ni realizar nuevos deploys.

### Pestañas Utilizadas:
1. `ACTIVIDADES`: Listado de disciplinas (`FYAF-CF`, `FYAF-OLY`, `FYAF-OPEN`). Solo se publican si `PUBLICAR = SI` y `ESTADO != INACTIVA`.
2. `HORARIOS`: Turnos y modalidades asociados a cada actividad.
3. `ARANCELES`: Precios oficiales, frecuencias y cuotas sociales asociadas.
4. `PROMOCIONES`: Bonificaciones (SportClub 100%, Inferiores gratis, combo OLY + CrossFit). Si expira la fecha o no hay promociones activas, la sección se oculta automáticamente.
5. `CONTACTOS`: Enlaces específicos a WhatsApp institucional y cuentas de Instagram (`@daom_gym`, `@daom.wl`).
6. `CONFIGURACION`: Dirección, mapas, teléfonos y metadatos generales.

---

## 3. Panel de Administración Multimedia (`/admin`)

- **Ruta de acceso:** `/admin`
- **Autenticación:** Requiere clave de acceso administrativa (`ADMIN_PANEL_KEY`).
- **Ubicaciones Reales Sincronizadas:**
  - `hero-cover`: Fotografía principal del Hero.
  - `activity-cf`: Banner de CrossFit / Functional Training.
  - `activity-oly`: Banner de Levantamiento Olímpico (OLY).
  - `activity-openbox`: Banner de Open Box (Gimnasio Libre).
  - `facility-1` a `facility-4`: Fotografías de las instalaciones y equipamiento real.

---

## 4. Despliegue en Render

1. Conectar el repositorio GitHub a Render.
2. Seleccionar **New + > Blueprint** o **Web Service**.
3. Render detectará automáticamente `render.yaml`:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Configurar variables de entorno si se desea personalizar el dominio:
   - `GOOGLE_SHEETS_ID`: ID de la planilla de Google Sheets.
   - `ADMIN_PANEL_KEY`: Clave maestra para el panel de `/admin`.
   - `NEXT_PUBLIC_SITE_URL`: URL canónica del sitio.

---

## 5. Procedimiento de Rollback y Recuperación

1. **Reversión de Código:** Mediante Git (`git revert` o rollback inmediato de deploy en el dashboard de Render al build anterior).
2. **Reversión Multimedia:** Los slots iniciales pueden restablecerse con un clic en el botón de restablecer a predeterminados en el panel o re-desplegando los assets incluidos en `/public/images`.
3. **Respaldo de Emergencia:** El sistema cuenta con fallback estático integrado en `src/lib/data-fallback.ts`, lo que garantiza que la página nunca quede en blanco o fuera de línea ante cortes de Google Drive.
