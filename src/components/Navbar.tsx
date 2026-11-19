'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Menu, X } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/utils';

interface NavbarProps {
  whatsappNumber: string;
}

export function Navbar({ whatsappNumber }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const waUrl = buildWhatsAppLink(
    whatsappNumber,
    'Hola! Quiero información para empezar a entrenar en el Gimnasio FyAF del Club DAOM.'
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#0d325a]/60 bg-[#020D20]/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Bloque Izquierdo:
            1. Logo del gimnasio
            2. 'Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM'
            3. Logo del club
        */}
        <div className="flex items-center gap-3">
          <Link href="#inicio" className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#00B8F5] rounded-lg p-1">
            {/* 1. Logo propio del Gimnasio FyAF */}
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-full border border-[#0d325a] bg-[#04172D] flex items-center justify-center shrink-0 shadow-sm">
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
              <span className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-[#00B8F5] transition-colors leading-tight line-clamp-1 sm:line-clamp-none max-w-[170px] sm:max-w-[280px]">
                Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#C5D3E3]">
                Flores • CABA
              </span>
            </div>

            {/* 3. Escudo institucional del Club DAOM */}
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-full border border-[#0d325a] bg-[#04172D] flex items-center justify-center shrink-0 ml-1 shadow-sm">
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

        {/* Bloque Central Desktop:
            4. 'Actividades'
            5. 'Promociones'
            6. 'Instalaciones'
            7. 'Ubicación'
        */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#C5D3E3]" aria-label="Navegación principal">
          <a href="#actividades" className="hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#00B8F5] rounded px-2 py-1">
            Actividades
          </a>
          <a href="#promociones" className="hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#00B8F5] rounded px-2 py-1">
            Promociones
          </a>
          <a href="#instalaciones" className="hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#00B8F5] rounded px-2 py-1">
            Instalaciones
          </a>
          <a href="#ubicacion" className="hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#00B8F5] rounded px-2 py-1">
            Ubicación
          </a>
        </nav>

        {/* Bloque Extremo Derecho Desktop:
            8. Logo de Familia SportClub
            9. Botón 'Quiero empezar'
        */}
        <div className="hidden sm:flex items-center gap-3">
          {/* 8. Logo de Familia SportClub */}
          <div className="flex items-center pr-1">
            <div className="relative h-7 w-24 bg-white rounded-md px-1.5 py-0.5 shadow-sm flex items-center justify-center border border-[#0d325a]/60">
              <Image
                src="/logos/familia-sportclub.png"
                alt="Familia SportClub"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
          </div>

          {/* 9. Botón 'Quiero empezar' en Verde Esmeralda oficial de conversión */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#020D20] min-h-[44px]"
            aria-label="Contactar por WhatsApp para empezar a entrenar"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Quiero empezar</span>
          </a>
        </div>

        {/* Botón Menú Hamburguesa en Mobile */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-lg text-[#C5D3E3] hover:text-white hover:bg-[#04172D] focus:outline-none focus:ring-2 focus:ring-[#00B8F5] min-h-[44px] min-w-[44px]"
            aria-expanded={mobileMenuOpen}
            aria-label="Alternar menú de navegación"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú desplegable Mobile */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#0d325a] bg-[#020D20]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 font-medium text-sm text-[#C5D3E3]">
            <a
              href="#actividades"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#04172D] hover:text-white transition-colors min-h-[44px] flex items-center"
            >
              Actividades y Horarios
            </a>
            <a
              href="#promociones"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#04172D] hover:text-white transition-colors min-h-[44px] flex items-center"
            >
              Promociones y Convenios
            </a>
            <a
              href="#instalaciones"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#04172D] hover:text-white transition-colors min-h-[44px] flex items-center"
            >
              Instalaciones Reales
            </a>
            <a
              href="#ubicacion"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#04172D] hover:text-white transition-colors min-h-[44px] flex items-center"
            >
              Ubicación y Sede
            </a>
          </div>

          <div className="pt-3 border-t border-[#0d325a]/60 flex items-center justify-between gap-3">
            <div className="relative h-7 w-24 bg-white rounded-md px-1.5 py-0.5 shadow-sm flex items-center justify-center border border-[#0d325a]/60">
              <Image
                src="/logos/familia-sportclub.png"
                alt="Familia SportClub"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-colors min-h-[44px]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Quiero empezar</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
