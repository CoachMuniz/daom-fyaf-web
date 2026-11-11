/**
 * DAOM_FyAF_Fuente_Oficial — Definición del Contrato de Datos Oficial
 * Compatible con fyaf-schema de Jerkson 3.0 y la fuente de verdad en Google Sheets.
 */

export interface FyAfActividad {
  id_actividad: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  direccion_tecnica: string;
  estado: 'ACTIVA' | 'SUSPENDIDA' | 'PROXIMAMENTE' | 'INACTIVA';
  publicar: 'SI' | 'NO';
  url_informacion?: string;
  observaciones?: string;
}

export interface FyAfHorario {
  id_horario: string;
  id_actividad: string;
  dia_semana: 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo' | string;
  hora_inicio: string; // HH:mm
  hora_fin: string;    // HH:mm
  modalidad: string;
  sede: string;
  cupo?: number;
  estado: 'ACTIVO' | 'SUSPENDIDO' | 'INACTIVO' | 'ACTIVA';
  vigente_desde: string;
  vigente_hasta?: string;
  observaciones?: string;
}

export interface FyAfArancel {
  id_arancel: string;
  id_actividad: string;
  nombre_plan: string;
  frecuencia: string;
  precio: number;
  moneda: 'ARS' | 'USD';
  cuota_social?: number;
  total?: number;
  vigente_desde: string;
  vigente_hasta?: string;
  estado: 'VIGENTE' | 'APROBADO' | 'HISTORICO' | 'BORRADOR' | 'PENDIENTE';
  observaciones?: string;
}

export interface FyAfPromocion {
  id_promocion: string;
  id_actividad: string;
  nombre: string;
  descripcion: string;
  tipo_beneficio: string;
  valor_beneficio: string;
  condiciones: string;
  vigente_desde: string;
  vigente_hasta?: string;
  estado: 'ACTIVA' | 'VENCIDA' | 'BORRADOR';
  publicar: 'SI' | 'NO';
}

export interface FyAfContacto {
  id_contacto: string;
  area: string;
  nombre_publico: string;
  funcion: string;
  canal: 'WhatsApp' | 'Instagram' | 'Email' | 'Presencial' | string;
  destino: string;
  horario_atencion: string;
  permite_derivacion: 'SI' | 'NO';
  estado: 'ACTIVO' | 'INACTIVO';
  observaciones?: string;
}

export interface FyAfConfiguracion {
  [clave: string]: string;
}

export interface FyAfMediaSlot {
  id: string;              // e.g. 'hero-cover', 'cf-banner', 'oly-banner', 'openbox-banner', 'facility-1', etc.
  name: string;            // Nombre descriptivo
  section: string;         // 'portada' | 'actividades' | 'instalaciones' | 'general'
  url: string;             // URL de la imagen o video
  type: 'image' | 'video';
  aspectRatio?: string;    // '16/9', '1/1', '4/3', etc.
  focalPoint?: { x: number; y: number }; // 0 to 100 %
  zoom?: number;           // 1 to 3
  videoCoverUrl?: string;  // Fotograma de portada para videos
  alt: string;             // Texto alternativo accesible
  isPublished: boolean;
}

export interface FyAfFullData {
  actividades: FyAfActividad[];
  horarios: FyAfHorario[];
  aranceles: FyAfArancel[];
  promociones: FyAfPromocion[];
  contactos: FyAfContacto[];
  configuracion: FyAfConfiguracion;
  mediaSlots: Record<string, FyAfMediaSlot>;
  source: 'google-sheets' | 'verified-cache' | 'fallback-official';
  lastUpdated: string;
}
