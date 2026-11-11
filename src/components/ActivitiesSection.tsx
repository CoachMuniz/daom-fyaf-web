import React from 'react';
import Image from 'next/image';
import { Clock, Tag, MessageCircle, CheckCircle, Info } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import {
  FyAfActividad,
  FyAfHorario,
  FyAfArancel,
  FyAfPromocion,
  FyAfContacto,
  FyAfMediaSlot,
  FyAfConfiguracion,
} from '@/types/fyaf';
import { formatCurrency, buildWhatsAppLink } from '@/lib/utils';

interface ActivitiesSectionProps {
  actividades: FyAfActividad[];
  horarios: FyAfHorario[];
  aranceles: FyAfArancel[];
  promociones: FyAfPromocion[];
  contactos: FyAfContacto[];
  mediaSlots: Record<string, FyAfMediaSlot>;
  config: FyAfConfiguracion;
  defaultWhatsapp: string;
}

export function ActivitiesSection({
  actividades,
  horarios,
  aranceles,
  promociones,
  contactos,
  mediaSlots,
  config,
  defaultWhatsapp,
}: ActivitiesSectionProps) {
  // Función para asociar slot multimedia dinámicamente por ID de actividad
  const getImageForActivity = (act: FyAfActividad): FyAfMediaSlot | undefined => {
    const dynamicKey = `activity-${act.id_actividad.toLowerCase()}`;
    if (mediaSlots[dynamicKey]) return mediaSlots[dynamicKey];

    if (act.id_actividad === 'FYAF-CF') return mediaSlots['activity-cf'];
    if (act.id_actividad === 'FYAF-OLY') return mediaSlots['activity-oly'];
    if (act.id_actividad === 'FYAF-OPEN') return mediaSlots['activity-openbox'];

    return mediaSlots['hero-cover'];
  };

  // Función para asociar WhatsApp y su mensaje específico con el responsable real de cada actividad
  const getWhatsAppForActivity = (actividad: FyAfActividad): string => {
    let phone = defaultWhatsapp;

    if (actividad.id_actividad === 'FYAF-CF') {
      // CrossFit: Brenda Vacotti
      const c = contactos.find(
        (c) =>
          c.id_contacto === 'CONT-FYAF-01' ||
          c.area.toLowerCase().includes('crossfit') ||
          c.nombre_publico?.toLowerCase().includes('brenda')
      );
      if (c && c.destino) phone = c.destino;
      else phone = '+5491146734466';
    } else if (actividad.id_actividad === 'FYAF-OLY') {
      // OLY: Emelyn Oce / Dirección Técnica OLY
      const c = contactos.find(
        (c) =>
          c.id_contacto === 'CONT-OLY-01' ||
          c.area.toLowerCase().includes('oly') ||
          c.area.toLowerCase().includes('levantamiento') ||
          c.nombre_publico?.toLowerCase().includes('emelyn')
      );
      if (c && c.destino) phone = c.destino;
      else phone = '+5491164691525';
    } else if (actividad.id_actividad === 'FYAF-OPEN') {
      // Open Box: Matías Muñiz / Coordinación Box
      const c = contactos.find(
        (c) =>
          c.id_contacto === 'CONT-OB-01' ||
          c.area.toLowerCase().includes('open') ||
          c.nombre_publico?.toLowerCase().includes('matias')
      );
      if (c && c.destino) phone = c.destino;
      else phone = '+5491130393030';
    }

    const msg = `Hola, quiero información para empezar ${actividad.nombre} en el Club DAOM.`;
    return buildWhatsAppLink(phone, msg);
  };

  // Función para asociar Instagram específico desde la pestaña REDES_SOCIALES de Google Sheets
  const getInstagramForActivity = (actividad: FyAfActividad): { url: string; handle: string } => {
    if (actividad.id_actividad === 'FYAF-OLY') {
      return {
        url: config.instagram_oly || 'https://www.instagram.com/daom.wl/',
        handle: '@daom.wl',
      };
    }
    return {
      url: config.instagram_cf || 'https://www.instagram.com/daom.cf/',
      handle: '@daom.cf',
    };
  };

  return (
    <section id="actividades" className="py-20 bg-brand-dark border-b border-brand-border">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-primary text-xs font-bold uppercase tracking-wider">
            Propuesta Deportiva Oficial
          </span>
          <h2 className="text-3xl font-extrabold text-brand-text sm:text-4xl mt-2">
            Actividades y Disciplinas
          </h2>
          <p className="mt-4 text-base text-brand-muted">
            Toda la información operativa sincronizada directamente desde la planilla oficial: turnos, modalidades, aranceles y contactos directos.
          </p>
        </div>

        <div className="space-y-12">
          {actividades.map((act) => {
            const media = getImageForActivity(act);
            const actHorarios = horarios.filter((h) => h.id_actividad === act.id_actividad);
            const actAranceles = aranceles.filter((a) => a.id_actividad === act.id_actividad);
            const actPromos = promociones.filter(
              (p) => p.id_actividad === act.id_actividad || p.id_actividad === 'todas'
            );
            const waLink = getWhatsAppForActivity(act);
            const igInfo = getInstagramForActivity(act);

            return (
              <div
                key={act.id_actividad}
                className="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-md transition-all hover:border-slate-600"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Imagen de la actividad */}
                  <div className="relative min-h-[280px] lg:min-h-full lg:col-span-5 bg-brand-surfaceAlt">
                    {media ? (
                      <div className="relative w-full h-full min-h-[280px]">
                        <Image
                          src={media.url}
                          alt={media.alt || act.nombre}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          style={{
                            objectFit: 'cover',
                            objectPosition: `${media.focalPoint?.x ?? 50}% ${media.focalPoint?.y ?? 50}%`,
                            transform: `scale(${media.zoom ?? 1})`,
                          }}
                          className="filter brightness-[0.85] transition-all"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-brand-muted">
                        Fotografía oficial
                      </div>
                    )}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-block rounded-md bg-brand-dark/90 backdrop-blur px-3 py-1 text-xs font-bold text-brand-primary border border-brand-border">
                        {act.tipo || 'Clases guiadas'}
                      </span>
                    </div>
                  </div>

                  {/* Información detallada */}
                  <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Cabecera */}
                      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-brand-border pb-4">
                        <h3 className="text-2xl font-bold text-brand-text">
                          {act.nombre}
                        </h3>
                        {act.direccion_tecnica && (
                          <span className="text-xs font-semibold text-brand-gold">
                            Dirigido por: {act.direccion_tecnica}
                          </span>
                        )}
                      </div>

                      {/* Descripción breve */}
                      <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                        {act.descripcion}
                      </p>

                      {/* Días y Horarios */}
                      <div className="mt-6 rounded-xl bg-brand-surfaceAlt/60 border border-brand-border/60 p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                          <Clock className="h-4 w-4 text-brand-primary" />
                          <span>Días y Horarios de Funcionamiento:</span>
                        </div>
                        {actHorarios.length > 0 ? (
                          <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
                            {actHorarios.map((h) => (
                              <div
                                key={h.id_horario}
                                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border/30 pb-1.5 last:border-0 last:pb-0 text-xs sm:text-sm text-slate-300"
                              >
                                <span className="font-semibold text-white capitalize">{h.dia_semana}</span>
                                <span className="text-brand-muted font-medium">
                                  {h.hora_inicio} a {h.hora_fin} hs
                                  {h.observaciones && !h.observaciones.toLowerCase().includes('confirmar') && (
                                    <span className="block sm:inline sm:ml-2 text-[11px] text-brand-dim">
                                      ({h.observaciones})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-brand-muted">
                            Consultar horarios disponibles por WhatsApp.
                          </p>
                        )}
                      </div>

                      {/* Aranceles y Precios Oficiales */}
                      <div className="mt-6 rounded-xl bg-brand-surfaceAlt/60 border border-brand-border/60 p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                          <Tag className="h-4 w-4 text-brand-primary" />
                          <span>Aranceles Oficiales y Cuota Social:</span>
                        </div>
                        {actAranceles.length > 0 ? (
                          <div className="space-y-4">
                            {actAranceles.map((a) => (
                              <div
                                key={a.id_arancel}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/30 pb-3 last:border-0 last:pb-0"
                              >
                                <div>
                                  <div className="text-sm font-semibold text-white">
                                    {a.nombre_plan}
                                  </div>
                                  <div className="text-xs text-brand-dim mt-0.5">
                                    Frecuencia: {a.frecuencia}
                                  </div>
                                  {a.observaciones && (
                                    <div className="text-[11px] text-brand-muted mt-0.5">
                                      {a.observaciones}
                                    </div>
                                  )}
                                </div>
                                <div className="text-left sm:text-right">
                                  {a.total && a.total > 0 ? (
                                    <div>
                                      <div className="flex items-baseline gap-1.5 sm:justify-end">
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-gold">
                                          Aproximadamente
                                        </span>
                                        <span className="text-xl font-bold text-white">
                                          {formatCurrency(a.total, a.moneda)}
                                        </span>
                                      </div>
                                      {a.cuota_social && a.cuota_social > 0 && a.precio > 0 && (
                                        <div className="text-[11px] text-brand-muted mt-0.5">
                                          ({formatCurrency(a.precio)} actividad + {formatCurrency(a.cuota_social)} cuota adherente aprox.)
                                        </div>
                                      )}
                                      {a.precio === 0 && a.cuota_social && (
                                        <div className="text-[11px] text-brand-muted mt-0.5">
                                          (Incluye Open Box + cuota adherente aprox.)
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-xs font-semibold text-brand-gold">
                                      Consultar valor
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Disclaimer oficial de variaciones de cuota social */}
                            <div className="mt-3 pt-3 border-t border-brand-border/40 text-[11px] text-brand-dim flex items-start gap-1.5 leading-relaxed bg-brand-dark/40 p-2.5 rounded-lg">
                              <Info className="h-3.5 w-3.5 text-brand-gold shrink-0 mt-0.5" />
                              <span>
                                <strong>Aviso importante:</strong> Los importes totales son aproximados. El valor mensual incluye la cuota social adherente, la cual puede presentar mínimas variaciones arancelarias periódicas que son de exclusiva responsabilidad y administración del Club DAOM.
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-brand-muted">
                            Aranceles en actualización con la administración del club.
                          </p>
                        )}
                      </div>

                      {/* Promociones vigentes asociadas */}
                      {actPromos.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {actPromos.map((p) => (
                            <div
                              key={p.id_promocion}
                              className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-200"
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-emerald-300">{p.nombre}: </span>
                                <span>{p.descripcion}</span>
                                {p.condiciones && (
                                  <span className="block text-[11px] text-emerald-400/80 mt-0.5">
                                    Condición: {p.condiciones}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Botones de acción: WhatsApp e Instagram */}
                    <div className="mt-8 pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-4">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow hover:bg-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Consultar por {act.nombre}</span>
                      </a>

                      <a
                        href={igInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-brand-surfaceAlt px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:border-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <InstagramIcon className="h-4 w-4 text-pink-400" />
                        <span>Ver {igInfo.handle}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
