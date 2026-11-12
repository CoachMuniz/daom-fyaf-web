import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/utils';

interface NavbarProps {
  whatsappNumber: string;
}

export function Navbar({ whatsappNumber }: NavbarProps) {
  const waUrl = buildWhatsAppLink(
    whatsappNumber,
    'Hola! Quiero información para empezar a entrenar en el Gimnasio FyAF del Club DAOM.'
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-dark/95 backdrop-blur supports-[backdrop-filter]:bg-brand-dark/80">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Bloque Izquierdo:
            1. Logo del gimnasio
            2. 'Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM'
            3. Logo del club
        */}
        <div className="flex items-center gap-3">
          <Link href="#inicio" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg p-1">
            {/* 1. Logo propio del Gimnasio FyAF */}
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-brand-border bg-brand-surface flex items-center justify-center shrink-0">
              <Image
                src="/logos/logo-fyaf.png"
                alt="Logo Gimnasio de Fuerza y Acondicionamiento Físico"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </div>

            {/* 2. 'Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM' */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-brand-text group-hover:text-brand-primary transition-colors leading-tight line-clamp-1 sm:line-clamp-none max-w-[210px] sm:max-w-none">
                Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM
              </span>
              <span className="text-[11px] font-medium text-brand-muted">
                Flores • CABA
              </span>
            </div>

            {/* 3. Escudo institucional del Club DAOM */}
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-brand-border/60 bg-brand-surface flex items-center justify-center shrink-0 ml-1">
              <Image
                src="/logos/club-daom.png"
                alt="Escudo Club DAOM"
                width={30}
                height={30}
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Bloque Central / Derecho:
            4. 'Actividades'
            5. 'Promociones'
            6. 'Instalaciones'
            7. 'Ubicación'
        */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-brand-muted" aria-label="Navegación principal">
          <a href="#actividades" className="hover:text-brand-text transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary rounded px-2 py-1">
            Actividades
          </a>
          <a href="#promociones" className="hover:text-brand-text transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary rounded px-2 py-1">
            Promociones
          </a>
          <a href="#instalaciones" className="hover:text-brand-text transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary rounded px-2 py-1">
            Instalaciones
          </a>
          <a href="#ubicacion" className="hover:text-brand-text transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary rounded px-2 py-1">
            Ubicación
          </a>
        </nav>

        {/* Bloque Extremo Derecho:
            8. Logo de Familia SportClub
            9. 'Quiero empezar' (CTA WhatsApp)
        */}
        <div className="flex items-center gap-3">
          {/* 8. Logo de Familia SportClub */}
          <div className="hidden md:flex items-center pr-1">
            <div className="relative h-7 w-24 bg-white rounded-md px-1.5 py-0.5 shadow-sm flex items-center justify-center border border-brand-border/60">
              <Image
                src="/logos/familia-sportclub.png"
                alt="Familia SportClub"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
          </div>

          {/* 9. Botón 'Quiero empezar' */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-brand-dark"
            aria-label="Contactar por WhatsApp para empezar a entrenar"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Quiero empezar</span>
          </a>
        </div>
      </div>
    </header>
  );
}
