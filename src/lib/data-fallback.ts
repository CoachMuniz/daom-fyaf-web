import { FyAfFullData } from '@/types/fyaf';
import { INITIAL_MEDIA_SLOTS } from './media-registry';

/**
 * Datos oficiales iniciales y de respaldo verificado para el Gimnasio FyAF - Club DAOM.
 * Extraídos directamente de:
 * 1. Planilla y templates oficiales DAOM_FyAF_Fuente_Oficial
 * 2. Taplink oficial histórico (https://taplink.cc/daom_gym)
 * 3. Documentación técnica de Jerkson 3.0 / DAOM Weightlifting
 */
export const OFFICIAL_FALLBACK_DATA: FyAfFullData = {
  actividades: [
    {
      id_actividad: 'FYAF-CF',
      nombre: 'CrossFit / Functional Training',
      descripcion: 'Una clase, dos enfoques. En cada turno se dan dos planificaciones simultáneas guiadas por el mismo coach: una de CrossFit de alta intensidad y otra de Functional Training adaptada a tus objetivos.',
      tipo: 'Clases grupales',
      direccion_tecnica: 'Gimnasio FyAF Club DAOM',
      estado: 'ACTIVA',
      publicar: 'SI',
      url_informacion: 'https://taplink.cc/daom_gym',
      observaciones: 'Actividad oficial de box en Gimnasio FyAF. ¡Importantes descuentos si combinás con OLY!'
    },
    {
      id_actividad: 'FYAF-OLY',
      nombre: 'OLY (Levantamiento Olímpico)',
      descripcion: 'Halterofilia y levantamiento olímpico de pesas con enfoque técnico y seguro (Snatch y Clean & Jerk). Ideal para crossfitters, deportistas de contacto/conjunto y aficionados.',
      tipo: 'Clases grupales técnicas (90 min)',
      direccion_tecnica: 'DAOM Weightlifting (Brenda Vacotti)',
      estado: 'ACTIVA',
      publicar: 'SI',
      url_informacion: 'https://www.daom-weightlifting.com',
      observaciones: 'Se entrena en el gimnasio FyAF con dirección técnica especializada de DAOM Weightlifting.'
    },
    {
      id_actividad: 'FYAF-OPEN',
      nombre: 'Open Box (Gimnasio Libre)',
      descripcion: 'Tu plan, tu ritmo, tu espacio. Entrená libremente con tu propia planificación sin interferencias ni máquinas inútiles. Podés traer a tu propio coach sin costo adicional.',
      tipo: 'Acceso libre a sala de fuerza y tarimas',
      direccion_tecnica: 'Gimnasio FyAF Club DAOM',
      estado: 'ACTIVA',
      publicar: 'SI',
      url_informacion: 'https://taplink.cc/daom_gym',
      observaciones: 'Plataformas, barras olímpicas, discos bumper, racks, kettlebells, multipoleas y zonas de peso libre.'
    }
  ],
  horarios: [
    // CrossFit / Functional
    {
      id_horario: 'HOR-CF-01',
      id_actividad: 'FYAF-CF',
      dia_semana: 'Lunes',
      hora_inicio: '19:00',
      hora_fin: '21:00',
      modalidad: 'Presencial (Turnos 19:00 y 20:00 hs)',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turnos 19:00 y 20:00'
    },
    {
      id_horario: 'HOR-CF-02',
      id_actividad: 'FYAF-CF',
      dia_semana: 'Martes',
      hora_inicio: '19:00',
      hora_fin: '20:00',
      modalidad: 'Presencial (Turno 19:00 hs)',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turno 19:00'
    },
    {
      id_horario: 'HOR-CF-03',
      id_actividad: 'FYAF-CF',
      dia_semana: 'Miercoles',
      hora_inicio: '19:00',
      hora_fin: '21:00',
      modalidad: 'Presencial (Turnos 19:00 y 20:00 hs)',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turnos 19:00 y 20:00'
    },
    {
      id_horario: 'HOR-CF-04',
      id_actividad: 'FYAF-CF',
      dia_semana: 'Jueves',
      hora_inicio: '19:00',
      hora_fin: '20:00',
      modalidad: 'Presencial (Turno 19:00 hs)',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turno 19:00'
    },
    {
      id_horario: 'HOR-CF-05',
      id_actividad: 'FYAF-CF',
      dia_semana: 'Viernes',
      hora_inicio: '19:00',
      hora_fin: '21:00',
      modalidad: 'Presencial (Turnos 19:00 y 20:00 hs)',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turnos 19:00 y 20:00'
    },
    {
      id_horario: 'HOR-CF-06',
      id_actividad: 'FYAF-CF',
      dia_semana: 'Sabado',
      hora_inicio: '11:00',
      hora_fin: '12:00',
      modalidad: 'Presencial (Turno 11:00 hs)',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turno especial matutino'
    },
    // OLY
    {
      id_horario: 'HOR-OLY-01',
      id_actividad: 'FYAF-OLY',
      dia_semana: 'Lunes',
      hora_inicio: '18:00',
      hora_fin: '19:30',
      modalidad: 'Presencial',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turno vespertino técnica OLY'
    },
    {
      id_horario: 'HOR-OLY-02',
      id_actividad: 'FYAF-OLY',
      dia_semana: 'Martes',
      hora_inicio: '08:00',
      hora_fin: '09:30',
      modalidad: 'Presencial',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turno matutino técnica OLY'
    },
    {
      id_horario: 'HOR-OLY-03',
      id_actividad: 'FYAF-OLY',
      dia_semana: 'Miercoles',
      hora_inicio: '08:00',
      hora_fin: '19:30',
      modalidad: 'Presencial (Turnos 08:00 y 18:00 hs)',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Doble turno'
    },
    {
      id_horario: 'HOR-OLY-04',
      id_actividad: 'FYAF-OLY',
      dia_semana: 'Jueves',
      hora_inicio: '08:00',
      hora_fin: '09:30',
      modalidad: 'Presencial',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turno matutino técnica OLY'
    },
    {
      id_horario: 'HOR-OLY-05',
      id_actividad: 'FYAF-OLY',
      dia_semana: 'Viernes',
      hora_inicio: '18:00',
      hora_fin: '19:30',
      modalidad: 'Presencial',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turno vespertino técnica OLY'
    },
    {
      id_horario: 'HOR-OLY-06',
      id_actividad: 'FYAF-OLY',
      dia_semana: 'Sabado',
      hora_inicio: '09:30',
      hora_fin: '11:00',
      modalidad: 'Presencial',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Turno matutino sábado OLY'
    },
    // Open Box
    {
      id_horario: 'HOR-OPEN-01',
      id_actividad: 'FYAF-OPEN',
      dia_semana: 'Lunes a Viernes',
      hora_inicio: '10:00',
      hora_fin: '21:00',
      modalidad: 'Presencial (10:00 a 12:30 y 16:00 a 21:00 hs)',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Franjas libres continuas'
    },
    {
      id_horario: 'HOR-OPEN-02',
      id_actividad: 'FYAF-OPEN',
      dia_semana: 'Sabado',
      hora_inicio: '09:30',
      hora_fin: '17:30',
      modalidad: 'Presencial (09:30 a 12:30 y 15:00 a 17:30 hs)',
      sede: 'Sede Club DAOM (Av. Varela 1802)',
      estado: 'ACTIVO',
      vigente_desde: '2026-01-01',
      observaciones: 'Franjas de fin de semana'
    }
  ],
  aranceles: [
    {
      id_arancel: 'ARAN-OLY-LIBRE',
      id_actividad: 'FYAF-OLY',
      nombre_plan: 'OLY Pase Libre Mensual',
      frecuencia: 'Pase libre mensual',
      precio: 36200,
      moneda: 'ARS',
      cuota_social: 30000,
      total: 66200,
      vigente_desde: '2026-01-01',
      estado: 'APROBADO',
      observaciones: 'Arancel OLY mensual ($36.200) + cuota social aprox ($30.000). Si ya sos socio DAOM o SportClub no abonás cuota social.'
    },
    {
      id_arancel: 'ARAN-OLY-CLASE',
      id_actividad: 'FYAF-OLY',
      nombre_plan: 'OLY Clase Suelta',
      frecuencia: 'Por clase',
      precio: 5000,
      moneda: 'ARS',
      total: 5000,
      vigente_desde: '2026-01-01',
      estado: 'APROBADO',
      observaciones: 'Clase individual para perfeccionamiento técnico.'
    },
    {
      id_arancel: 'ARAN-OPEN-LIBRE',
      id_actividad: 'FYAF-OPEN',
      nombre_plan: 'Open Box Pase Libre Mensual',
      frecuencia: 'Pase libre mensual',
      precio: 33800,
      moneda: 'ARS',
      cuota_social: 20000,
      total: 53800,
      vigente_desde: '2026-01-01',
      estado: 'APROBADO',
      observaciones: 'Pase mensual libre ($33.800) + cuota social aprox ($20.000). 100% bonificado para socios SportClub.'
    },
    {
      id_arancel: 'ARAN-CF-CONSULTA',
      id_actividad: 'FYAF-CF',
      nombre_plan: 'CrossFit / Functional Pase Mensual',
      frecuencia: 'Pase mensual / 2x / 3x semana',
      precio: 0,
      moneda: 'ARS',
      vigente_desde: '2026-01-01',
      estado: 'PENDIENTE',
      observaciones: 'Consultar aranceles exactos por WhatsApp según cantidad de días semanales y combinación con OLY.'
    }
  ],
  promociones: [
    {
      id_promocion: 'PROMO-SPORTCLUB',
      id_actividad: 'FYAF-OPEN',
      nombre: 'Socios SportClub 100% Bonificado',
      descripcion: 'Si estás adherido a SportClub podés acceder libremente al box escaneando el código QR en recepción sin costo extra.',
      tipo_beneficio: 'bonificacion_total',
      valor_beneficio: '100% Bonificado',
      condiciones: 'Presentar credencial activa / QR SportClub en recepción',
      vigente_desde: '2026-01-01',
      estado: 'ACTIVA',
      publicar: 'SI'
    },
    {
      id_promocion: 'PROMO-INFERIORES',
      id_actividad: 'FYAF-OLY',
      nombre: 'Gratuito para Inferiores del Club DAOM',
      descripcion: 'Acceso y entrenamiento de levantamiento olímpico gratuito para chicos y jóvenes de divisiones inferiores de todos los deportes de DAOM.',
      tipo_beneficio: 'bonificacion_total',
      valor_beneficio: '100% Bonificado',
      condiciones: 'Pertenecer al padrón de inferiores de rugby, hockey u otras disciplinas del Club DAOM',
      vigente_desde: '2026-01-01',
      estado: 'ACTIVA',
      publicar: 'SI'
    },
    {
      id_promocion: 'PROMO-COMBO-OLY-CF',
      id_actividad: 'FYAF-CF',
      nombre: 'Descuento Combinado OLY + CrossFit / Functional',
      descripcion: 'Importantes bonificaciones y tarifas especiales en arancel mensual al combinar clases de levantamiento olímpico con CrossFit / Functional.',
      tipo_beneficio: 'descuento_combinado',
      valor_beneficio: 'Descuento Especial',
      condiciones: 'Inscripción simultánea en ambas disciplinas',
      vigente_desde: '2026-01-01',
      estado: 'ACTIVA',
      publicar: 'SI'
    }
  ],
  contactos: [
    {
      id_contacto: 'CONT-FYAF-01',
      area: 'Gimnasio FyAF / CrossFit / Open Box',
      nombre_publico: 'Administración Gimnasio FyAF',
      funcion: 'Atención general de consultas, CrossFit, Functional y Open Box',
      canal: 'WhatsApp',
      destino: '+5491146734406',
      horario_atencion: 'Lunes a Viernes 08:00 a 20:00 hs',
      permite_derivacion: 'SI',
      estado: 'ACTIVO',
      observaciones: 'WhatsApp oficial de atención al socio y deportista'
    },
    {
      id_contacto: 'CONT-OPEN-01',
      area: 'Open Box',
      nombre_publico: 'Coordinación Open Box',
      funcion: 'Consultas directas de sala y disponibilidad para entrenadores externos',
      canal: 'WhatsApp',
      destino: '+5491130393030',
      horario_atencion: 'Lunes a Viernes 10:00 a 20:00 hs',
      permite_derivacion: 'SI',
      estado: 'ACTIVO',
      observaciones: 'Línea directa para planes libres y entrenadores'
    },
    {
      id_contacto: 'CONT-OLY-01',
      area: 'OLY / Levantamiento Olímpico',
      nombre_publico: 'Dirección Técnica OLY (DAOM Weightlifting)',
      funcion: 'Coordinación deportiva y técnica de Halterofilia',
      canal: 'WhatsApp',
      destino: '+5491146734406',
      horario_atencion: 'Lunes a Viernes 10:00 a 19:00 hs',
      permite_derivacion: 'SI',
      estado: 'ACTIVO',
      observaciones: 'Canal de coordinación técnica'
    },
    {
      id_contacto: 'CONT-IG-OLY',
      area: 'OLY / Levantamiento Olímpico',
      nombre_publico: '@daom.wl',
      funcion: 'Instagram Oficial de DAOM Weightlifting',
      canal: 'Instagram',
      destino: 'https://instagram.com/daom.wl/',
      horario_atencion: 'Red Social',
      permite_derivacion: 'SI',
      estado: 'ACTIVO',
      observaciones: 'Comunidad técnica de levantamiento'
    },
    {
      id_contacto: 'CONT-IG-FYAF',
      area: 'Gimnasio FyAF',
      nombre_publico: '@daom_gym',
      funcion: 'Instagram Oficial Gimnasio FyAF',
      canal: 'Instagram',
      destino: 'https://instagram.com/daom_gym/',
      horario_atencion: 'Red Social',
      permite_derivacion: 'SI',
      estado: 'ACTIVO',
      observaciones: 'Comunidad de CrossFit, Functional y Box'
    },
    {
      id_contacto: 'CONT-CLUB-SEDE',
      area: 'Secretaría Club DAOM',
      nombre_publico: 'Sede Social y Deportiva Club DAOM',
      funcion: 'Atención presencial y administración de socios',
      canal: 'Presencial',
      destino: 'Av. Varela 1802, esquina Castañares, Flores, CABA',
      horario_atencion: 'Lunes a Viernes 09:00 a 20:00 hs',
      permite_derivacion: 'NO',
      estado: 'ACTIVO',
      observaciones: 'Ingreso al gimnasio por el predio deportivo'
    }
  ],
  configuracion: {
    nombre_oficial: 'Gimnasio de Fuerza y Acondicionamiento Físico (FyAF) - Club DAOM',
    institucion: 'Club DAOM',
    sede_direccion: 'Av. Varela 1802, Flores, CABA (esquina Av. Castañares)',
    coordenadas_lat: '-34.6472889',
    coordenadas_lng: '-58.4489749',
    google_maps_url: 'https://maps.google.com/?q=-34.6472889,-58.4489749',
    url_taplink: 'https://taplink.cc/daom_gym',
    url_sitio_oficial: 'https://www.daom-weightlifting.com',
    zona_horaria: 'America/Argentina/Buenos_Aires',
    moneda_predeterminada: 'ARS',
    whatsapp_default: '+5491146734406',
    instagram_default: 'https://instagram.com/daom_gym/'
  },
  mediaSlots: INITIAL_MEDIA_SLOTS,
  source: 'fallback-official',
  lastUpdated: new Date().toISOString()
};
