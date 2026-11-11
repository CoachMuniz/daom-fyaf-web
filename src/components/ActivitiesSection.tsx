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
} from '@/types/fyaf';
import { formatCurrency, buildWhatsAppLink } from '@/lib/utils';

interface ActivitiesSectionProps {
  actividades: FyAfActividad[];
  horarios: FyAfHorario[];
  aranceles: FyAfArancel[];
  promociones: FyAfPromocion[];
  contactos: FyAfContacto[];
  mediaSlots: Record<string, FyAfMediaSlot>;
  defaultWhatsapp: string;
}

export function ActivitiesSection({
  actividades,
  horarios,
  aranceles,
  promociones,
  contactos,
  mediaSlots,
  defaultWhatsapp,
}: ActivitiesSectionProps) {
  // Función para asociar imagen por ID de actividad
  const getImageForActivity = (id: string): FyAfMediaSlot | undefined => {
    if (id.includes('CF')) return mediaSlots['activity-cf'];
    if (id.includes('OLY')) return mediaSlots['activity-oly'];
    if (id.includes('OPEN')) return mediaSlots['activity-openbox'];
    return undefined;
  };

  // Función para asociar WhatsApp y su mensaje específico
  const getWhatsAppForActivity = (actividad: FyAfActividad): string => {
    // Buscar si hay contacto específico
    const contact = contactos.find(
      (c) =>
        c.canal.toLowerCase().includes('whatsapp') &&
        (c.area.toLowerCase().includes(actividad.nombre.toLowerCase().split(' ')[0]) ||
          c.area.toLowerCase().includes(actividad.id_actividad.toLowerCase()))
    );

    const phone = contact ? contact.destino : defaultWhatsapp;
    const msg = `Hola, quiero información para empezar ${actividad.nombre} en el Club DAOM.`;
    return buildWhatsAppLink(phone, msg);
  };

  // Función para asociar Instagram específico
  const getInstagramForActivity = (actividad: FyAfActividad): string | undefined => {
    if (actividad.id_actividad.includes('OLY')) {
      return 'https://instagram.com/daom.wl/';
    }
    return 'https://instagram.com/daom_gym/';
  };

  return (
    <section id="actividades" className="py-20 bg-brand-dark border-b border-brand-border">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-primary text-xs font-bold uppercase tracking-wider">
            Propuesta Deportiva
          </span>
          <h2 className="text-3xl font-extrabold text-brand-text sm:text-4xl mt-2">
            Actividades y Disciplinas
          </h2>
          <p className="mt-4 text-base text-brand-muted">
            Toda la información operativa en un solo lugar: en qué consiste cada actividad, para quién está dirigida, sus horarios, planes y precios reales.
          </p>
        </div>

        <div className="space-y-12">
          {actividades.map((act) => {
            const media = getImageForActivity(act.id_actividad);
            const actHorarios = horarios.filter((h) => h.id_actividad === act.id_actividad);
            const actAranceles = aranceles.filter((a) => a.id_actividad === act.id_actividad);
            const actPromos = promociones.filter((p) => p.id_actividad === act.id_actividad);
            const waLink = getWhatsAppForActivity(act);
            const igLink = getInstagramForActivity(act);

            return (
              <div
                key={act.id_actividad}
                className="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-md transition-all hover:border-slate-600"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Imagen de la actividad */}
                  <div className="relative min-h-[260px] lg:min-h-full lg:col-span-5 bg-brand-surfaceAlt">
                    {media ? (
                      <Image
                        src={media.url}
                        alt={media.alt || act.nombre}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover object-center filter brightness-[0.85]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-brand-muted">
                        Fotografía institucional
                      </div>
                    )}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-block rounded-md bg-brand-dark/90 backdrop-blur px-3 py-1 text-xs font-bold text-brand-primary border border-brand-border">
                        {act.tipo || 'Clase guiada'}
                      </span>
                    </div>
                  </div>

                  {/* Información detallada */}
                  <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Cabecera de la actividad */}
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

                      {/* Descripción */}
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
                          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                            {actHorarios.map((h) => (
                              <li key={h.id_horario} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border/30 pb-1.5 last:border-0 last:pb-0">
                                <span className="font-medium text-white">{h.dia_semana}</span>
                                <span className="text-brand-muted sm:text-right">
                                  {h.modalidad || `${h.hora_inicio} a ${h.hora_fin} hs`}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs sm:text-sm text-brand-muted">
                            Consultar franjas y turnos disponibles por WhatsApp.
                          </p>
                        )}
                      </div>

                      {/* Aranceles y Precios */}
                      <div className="mt-6 rounded-xl bg-brand-surfaceAlt/60 border border-brand-border/60 p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                          <Tag className="h-4 w-4 text-brand-primary" />
                          <span>Planes y Aranceles Mensuales:</span>
                        </div>
                        {actAranceles.length > 0 ? (
                          <div className="space-y-3">
                            {actAranceles.map((a) => (
                              <div
                                key={a.id_arancel}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/30 pb-2 last:border-0 last:pb-0"
                              >
                                <div>
                                  <div className="text-sm font-semibold text-white">
                                    {a.nombre_plan}
                                  </div>
                                  {a.observaciones && (
                                    <div className="text-xs text-brand-muted mt-0.5">
                                      {a.observaciones}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right sm:self-center">
                                  {a.precio > 0 ? (
                                    <div>
                                      <span className="text-lg font-bold text-white">
                                        {formatCurrency(a.precio, a.moneda)}
                                      </span>
                                      {a.cuota_social && a.cuota_social > 0 && (
                                        <div className="text-[11px] text-brand-muted">
                                          + {formatCurrency(a.cuota_social, a.moneda)} cuota social aprox.
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-xs font-semibold text-brand-gold">
                                      Arancel a consultar
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-brand-muted">
                            Aranceles en actualización directa con la administración.
                          </p>
                        )}
                      </div>

                      {/* Promociones asociadas */}
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

                      {igLink && (
                        <a
                          href={igLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-brand-surfaceAlt px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:border-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                        >
                          <InstagramIcon className="h-4 w-4 text-pink-400" />
                          <span>Ver Instagram</span>
                        </a>
                      )}
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
