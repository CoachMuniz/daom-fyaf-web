'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Clock,
  Tag,
  MessageCircle,
  CheckCircle,
  Info,
  ChevronRight,
  Dumbbell,
  Activity as ActivityIcon,
  Layers,
  Flame,
} from 'lucide-react';
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
  const [selectedActivityId, setSelectedActivityId] = useState<string>('FYAF-OLY');

  // 3 Actividades oficiales del gimnasio: OLY, CROSSFIT / FUNCTIONAL y OPEN BOX
  const visualCards = [
    {
      id: 'FYAF-OLY',
      title: 'OLY',
      shortTitle: 'OLY',
      image: '/images/card-oly.webp',
      icon: Dumbbell,
      tag: 'Halterofilia federada',
    },
    {
      id: 'FYAF-CF',
      title: 'CROSSFIT / FUNCTIONAL',
      shortTitle: 'CROSSFIT / FUNCTIONAL',
      image: '/images/card-crossfit.webp',
      icon: Flame,
      tag: 'WODs y entrenamiento funcional',
    },
    {
      id: 'FYAF-OPEN',
      title: 'OPEN BOX',
      shortTitle: 'OPEN BOX',
      image: '/images/card-openbox.webp',
      icon: Layers,
      tag: 'Entrenamiento libre',
    },
  ];

  // Función para asociar slot multimedia dinámicamente por ID de actividad
  const getImageForActivity = (act: FyAfActividad): { url: string; alt?: string; focalPoint?: { x: number; y: number }; zoom?: number } => {
    if (act.id_actividad === 'FYAF-OLY') {
      return { url: '/images/card-oly.webp', alt: 'OLY - Levantamiento Olímpico DAOM' };
    }
    if (act.id_actividad === 'FYAF-CF') {
      return { url: '/images/card-crossfit.webp', alt: 'CrossFit y Functional Training DAOM' };
    }
    if (act.id_actividad === 'FYAF-OPEN') {
      return { url: '/images/card-openbox.webp', alt: 'Open Box DAOM' };
    }

    const dynamicKey = `activity-${act.id_actividad.toLowerCase()}`;
    if (mediaSlots[dynamicKey]) return mediaSlots[dynamicKey];

    return { url: mediaSlots['hero-cover']?.url || '/images/hero-athlete.webp', alt: act.nombre };
  };

  // Función para asociar WhatsApp y su mensaje específico con el responsable real de cada actividad
  const getWhatsAppForActivity = (actividad: FyAfActividad): string => {
    let phone = defaultWhatsapp;

    if (actividad.id_actividad === 'FYAF-CF') {
      const c = contactos.find(
        (c) =>
          c.id_contacto === 'CONT-FYAF-01' ||
          c.area.toLowerCase().includes('crossfit') ||
          c.nombre_publico?.toLowerCase().includes('brenda')
      );
      if (c && c.destino) phone = c.destino;
      else phone = '+5491146734466';
    } else if (actividad.id_actividad === 'FYAF-OLY') {
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

  // Función para asociar Instagram específico
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

  const handleCardClick = (id: string, linkedId?: string) => {
    const targetId = linkedId || id;
    setSelectedActivityId(targetId);
    const element = document.getElementById(`detalle-${targetId.toLowerCase()}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="actividades" className="py-20 bg-brand-dark border-b border-brand-navy/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Cabecera de la sección inspirada en el boceto */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-brand-electric rounded-full inline-block" />
            <span className="text-brand-electric text-xs font-bold uppercase tracking-widest">
              Disciplinas y Entrenamiento
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-white">
            NUESTRAS ACTIVIDADES
          </h2>
        </div>

        {/* Grilla de 3 Tarjetas Visuales con degradados azul profundo e íconos celestes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-20">
          {visualCards.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedActivityId === card.id;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card.id)}
                className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 h-64 sm:h-72 flex flex-col justify-end p-5 ${
                  isSelected
                    ? 'border-brand-electric shadow-[0_0_25px_rgba(0,184,245,0.25)] ring-1 ring-brand-electric'
                    : 'border-brand-navy/80 hover:border-brand-electric/50 hover:shadow-lg'
                }`}
              >
                {/* Imagen de fondo con recorte optimizado */}
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Degradado cinematográfico azul noche hacia transparente */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020D20] via-[#04172D]/75 to-transparent pointer-events-none" />

                {/* Contenido sobre la tarjeta */}
                <div className="relative z-10 w-full flex items-end justify-between gap-3">
                  <div className="space-y-2">
                    <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-brand-electric/15 border border-brand-electric/40 text-brand-electric backdrop-blur-sm group-hover:bg-brand-electric group-hover:text-brand-dark transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {card.shortTitle}
                    </h3>
                  </div>

                  {/* Botón circular de navegación > */}
                  <div className="h-8 w-8 rounded-full border border-white/20 bg-brand-petroleum/80 flex items-center justify-center text-white/80 group-hover:bg-brand-electric group-hover:text-brand-dark group-hover:border-brand-electric transition-all shrink-0">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detalle Operativo de las Actividades (Horarios, Aranceles y Contacto) */}
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
                id={`detalle-${act.id_actividad.toLowerCase()}`}
                key={act.id_actividad}
                className="scroll-mt-28 overflow-hidden rounded-2xl border border-brand-navy/80 bg-brand-petroleum shadow-md transition-all hover:border-brand-electric/40"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Imagen de la actividad con focal point y degradado */}
                  <div className="relative min-h-[260px] lg:min-h-full lg:col-span-5 bg-brand-dark">
                    {media ? (
                      <div className="relative w-full h-full min-h-[260px]">
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
                          className="filter brightness-[0.9]"
                        />
                        {/* Overlay degradado integrado a la paleta */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-petroleum via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-brand-petroleum" />
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-brand-textLight">
                        Fotografía oficial
                      </div>
                    )}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-block rounded-md bg-brand-dark/90 backdrop-blur px-3 py-1 text-xs font-bold text-brand-electric border border-brand-navy">
                        {act.tipo || 'Clases guiadas'}
                      </span>
                    </div>
                  </div>

                  {/* Información detallada: Días, Horarios y Aranceles */}
                  <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Cabecera */}
                      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-brand-navy/80 pb-4">
                        <h3 className="text-2xl font-bold text-white">
                          {act.nombre}
                        </h3>
                        {act.direccion_tecnica && (
                          <span className="text-xs font-semibold text-brand-electric">
                            Dirigido por: {act.direccion_tecnica}
                          </span>
                        )}
                      </div>

                      {/* Descripción breve */}
                      <p className="mt-4 text-sm sm:text-base text-brand-textLight leading-relaxed">
                        {act.descripcion}
                      </p>

                      {/* Días y Horarios */}
                      <div className="mt-6 rounded-xl bg-brand-dark/70 border border-brand-navy/60 p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                          <Clock className="h-4 w-4 text-brand-electric" />
                          <span>Días y Horarios de Funcionamiento:</span>
                        </div>
                        {actHorarios.length > 0 ? (
                          <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
                            {actHorarios.map((h) => (
                              <div
                                key={h.id_horario}
                                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-navy/40 pb-1.5 last:border-0 last:pb-0 text-xs sm:text-sm text-brand-textLight"
                              >
                                <span className="font-semibold text-white capitalize">{h.dia_semana}</span>
                                <span className="text-brand-textLight/80 font-medium">
                                  {h.hora_inicio} a {h.hora_fin} hs
                                  {h.observaciones && !h.observaciones.toLowerCase().includes('confirmar') && (
                                    <span className="block sm:inline sm:ml-2 text-[11px] text-brand-electric/80">
                                      ({h.observaciones})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-brand-textLight">
                            Consultar horarios disponibles por WhatsApp.
                          </p>
                        )}
                      </div>

                      {/* Aranceles y Precios Oficiales */}
                      <div className="mt-6 rounded-xl bg-brand-dark/70 border border-brand-navy/60 p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                          <Tag className="h-4 w-4 text-brand-electric" />
                          <span>Aranceles Oficiales y Cuota Social:</span>
                        </div>
                        {actAranceles.length > 0 ? (
                          <div className="space-y-4">
                            {actAranceles.map((a) => (
                              <div
                                key={a.id_arancel}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-navy/40 pb-3 last:border-0 last:pb-0"
                              >
                                <div>
                                  <div className="text-sm font-semibold text-white">
                                    {a.nombre_plan}
                                  </div>
                                  <div className="text-xs text-brand-textLight/70 mt-0.5">
                                    Frecuencia: {a.frecuencia}
                                  </div>
                                  {a.observaciones && (
                                    <div className="text-[11px] text-brand-textLight/80 mt-0.5">
                                      {a.observaciones}
                                    </div>
                                  )}
                                </div>
                                <div className="text-left sm:text-right">
                                  {a.total && a.total > 0 ? (
                                    <div>
                                      <div className="flex items-baseline gap-1.5 sm:justify-end">
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-electric">
                                          Aproximadamente
                                        </span>
                                        <span className="text-xl font-bold text-white">
                                          {formatCurrency(a.total, a.moneda)}
                                        </span>
                                      </div>
                                      {a.cuota_social && a.cuota_social > 0 ? (
                                        <div className="text-[11px] text-brand-textLight/70 mt-0.5">
                                          {act.id_actividad === 'FYAF-OPEN'
                                            ? `incluye ${formatCurrency(a.cuota_social)} de cuota social adherente`
                                            : `incluye OpenBox y ${formatCurrency(a.cuota_social)} de cuota social adherente`}
                                        </div>
                                      ) : null}
                                    </div>
                                  ) : (
                                    <span className="text-xs font-semibold text-brand-electric">
                                      Consultar valor
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Disclaimer oficial de variaciones de cuota social */}
                            <div className="mt-3 pt-3 border-t border-brand-navy/50 text-[11px] text-brand-textLight/80 flex items-start gap-1.5 leading-relaxed bg-brand-navy/30 p-2.5 rounded-lg">
                              <Info className="h-3.5 w-3.5 text-brand-electric shrink-0 mt-0.5" />
                              <span>
                                <strong>Aviso importante:</strong> Los importes totales son aproximados. El valor mensual incluye la cuota social adherente, la cual puede presentar mínimas variaciones arancelarias periódicas que son de exclusiva responsabilidad y administración del Club DAOM.
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-brand-textLight">
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
                              className="flex items-start gap-2.5 rounded-lg border border-brand-electric/30 bg-brand-navy/40 p-3 text-xs text-brand-textLight"
                            >
                              <CheckCircle className="h-4 w-4 text-brand-electric shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-white">{p.nombre}: </span>
                                <span>{p.descripcion}</span>
                                {p.condiciones && (
                                  <span className="block text-[11px] text-brand-textLight/70 mt-0.5">
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
                    <div className="mt-8 pt-4 border-t border-brand-navy/80 flex flex-wrap items-center justify-between gap-4">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-sportRed px-5 py-3 text-xs sm:text-sm font-bold text-white shadow hover:bg-brand-sportRed/90 transition-all focus:outline-none focus:ring-2 focus:ring-brand-sportRed"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Consultar por {act.nombre}</span>
                      </a>

                      <a
                        href={igInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-brand-navy bg-brand-dark px-4 py-2.5 text-xs sm:text-sm font-medium text-brand-textLight hover:text-white hover:border-brand-electric transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy"
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
