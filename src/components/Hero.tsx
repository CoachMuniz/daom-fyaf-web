import React from 'react';
import Image from 'next/image';
import { ArrowDown, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { FyAfMediaSlot } from '@/types/fyaf';
import { buildWhatsAppLink } from '@/lib/utils';

interface HeroProps {
  mediaSlot: FyAfMediaSlot;
  whatsappNumber: string;
}

export function Hero({ mediaSlot, whatsappNumber }: HeroProps) {
  const waUrl = buildWhatsAppLink(
    whatsappNumber,
    'Hola! Quiero información para empezar en el Gimnasio FyAF del Club DAOM.'
  );

  return (
    <section id="inicio" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-brand-border">
      {/* Fondo con imagen optimizada y oscurecimiento para legibilidad AA */}
      <div className="absolute inset-0 z-0">
        <Image
          src={mediaSlot.url}
          alt={mediaSlot.alt || 'Gimnasio de Fuerza y Acondicionamiento Físico Club DAOM'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.38] contrast-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        {/* Badge de ubicación e institución */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-border/80 bg-brand-surface/80 px-3.5 py-1.5 text-xs font-semibold text-brand-text backdrop-blur-md mb-6">
          <MapPin className="h-3.5 w-3.5 text-brand-primary" />
          <span>Club DAOM • Av. Varela 1802, Flores, CABA</span>
        </div>

        {/* Título principal H1 */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl uppercase leading-tight drop-shadow-sm">
          Gimnasio de Fuerza y Acondicionamiento Físico
        </h1>

        {/* Subtítulo enfocado en la misión clara */}
        <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Espacio oficial de entrenamiento en el Club DAOM: <strong className="text-white font-semibold">CrossFit</strong>, <strong className="text-white font-semibold">Functional Training</strong>, <strong className="text-white font-semibold">Levantamiento Olímpico (OLY)</strong> y <strong className="text-white font-semibold">Open Box</strong>.
        </p>

        {/* Características directas sin clichés */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-brand-muted">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Sin máquinas inútiles
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Tarimas de madera y barras olímpicas
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Clases guiadas por entrenadores
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Bonificado para socios SportClub
          </span>
        </div>

        {/* Botones de acción principales */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-brand-primaryHover transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-dark"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Quiero empezar</span>
          </a>

          <a
            href="#actividades"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-brand-surface/70 backdrop-blur px-8 py-4 text-base font-semibold text-brand-text hover:bg-brand-surfaceAlt hover:border-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <span>Ver actividades y horarios</span>
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
