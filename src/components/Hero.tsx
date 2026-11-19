import React from 'react';
import Image from 'next/image';
import { Play, ArrowDown, MapPin, Dumbbell, Award, Users, CheckCircle } from 'lucide-react';
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
    <section id="inicio" className="relative overflow-hidden bg-[#020D20] text-white border-b border-[#0d325a]/60">
      {/* Luces y geometrías diagonales sutiles inspiradas en el boceto */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00B8F5]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#082A50]/40 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(0, 184, 245, 0.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-12 md:py-16 lg:py-20 sm:px-6">
        
        {/* =======================================================
            COMPOSICIÓN MOBILE (Visible en < lg)
            Orden estricto según especificación:
            1. (Header en Navbar)
            2. Imagen deportiva protagonista
            3. Ubicación
            4. Título principal
            5. Descripción
            6. Beneficios
            7. Botones de acción (ancho completo)
           ======================================================= */}
        <div className="flex flex-col lg:hidden space-y-6">
          {/* 2. Imagen deportiva protagonista mobile */}
          <div className="relative w-full h-56 sm:h-72 overflow-hidden rounded-2xl border border-[#0d325a] shadow-2xl bg-[#04172D]">
            <Image
              src="/images/mobile-hero-barbell.webp"
              alt="Atleta con barra y disco olímpico Eleiko en Gimnasio FyAF"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center filter contrast-[1.12]"
            />
            {/* Degradado integrado azul noche */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020D20] via-transparent to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020D20]/60 via-transparent to-transparent" />
          </div>

          {/* 3. Badge de Ubicación */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0d325a] bg-[#04172D]/90 px-3.5 py-1.5 text-xs font-medium text-[#C5D3E3] backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-[#00B8F5]" />
              <span>Club DAOM • Av. Varela 1802, Flores, CABA</span>
            </div>
          </div>

          {/* 4. Título principal */}
          <h1 className="text-fluid-h1 font-black uppercase tracking-tight text-white leading-tight">
            Gimnasio de<br />
            Fuerza y<br />
            Acondicionamiento<br />
            Físico
          </h1>

          {/* 5. Descripción */}
          <p className="text-sm sm:text-base text-[#C5D3E3] leading-relaxed">
            Espacio oficial de entrenamiento en el Club DAOM: <strong className="text-white font-semibold">OLY</strong>, <strong className="text-white font-semibold">CrossFit / Functional Training</strong> y <strong className="text-white font-semibold">Open Box</strong>.
          </p>

          {/* 6. Beneficios con íconos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#C5D3E3]">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#082A50] flex items-center justify-center text-[#00B8F5] shrink-0">
                <Dumbbell className="h-4 w-4" />
              </div>
              <span className="font-medium">Sin máquinas inútiles</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#082A50] flex items-center justify-center text-[#00B8F5] shrink-0">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="font-medium">Tarimas de madera y barras olímpicas</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#082A50] flex items-center justify-center text-[#00B8F5] shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <span className="font-medium">Clases guiadas por entrenadores</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#082A50] flex items-center justify-center text-[#00B8F5] shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <span className="font-medium">Bonificado para socios SportClub</span>
            </div>
          </div>

          {/* 7. Botones de acción mobile (ancho completo) */}
          <div className="flex flex-col gap-3 pt-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#F12D43] px-6 py-3.5 text-base font-bold text-white shadow-lg hover:bg-[#D91F34] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#F12D43] min-h-[48px]"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Quiero empezar</span>
            </a>

            <a
              href="#actividades"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#0d325a] bg-[#04172D] px-6 py-3.5 text-sm font-semibold text-[#C5D3E3] hover:text-white hover:bg-[#082A50] transition-all focus:outline-none focus:ring-2 focus:ring-[#00B8F5] min-h-[48px]"
            >
              <span>Ver actividades y horarios</span>
              <ArrowDown className="h-4 w-4 text-[#00B8F5]" />
            </a>
          </div>
        </div>

        {/* =======================================================
            COMPOSICIÓN DESKTOP (Visible en >= lg)
            Distribución Asimétrica según boceto:
            - Izquierda: Textos, badge, beneficios y CTAs
            - Derecha: Fotografía deportiva protagonista con iluminación cinematográfica
           ======================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          
          {/* Columna Izquierda */}
          <div className="lg:col-span-7 space-y-6">
            {/* Ubicación */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0d325a] bg-[#04172D]/90 px-3.5 py-1.5 text-xs font-semibold text-[#C5D3E3] backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-[#00B8F5]" />
              <span>Club DAOM • Av. Varela 1802, Flores, CABA</span>
            </div>

            {/* Título principal H1 */}
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-black uppercase tracking-tight text-white leading-[1.08]">
              Gimnasio de<br />
              Fuerza y<br />
              Acondicionamiento<br />
              Físico
            </h1>

            {/* Descripción */}
            <p className="text-base xl:text-lg text-[#C5D3E3] max-w-xl leading-relaxed">
              Espacio oficial de entrenamiento en el Club DAOM: <strong className="text-white font-semibold">OLY</strong>, <strong className="text-white font-semibold">CrossFit / Functional Training</strong> y <strong className="text-white font-semibold">Open Box</strong>.
            </p>

            {/* Beneficios en 4 columnas compactas con íconos circulares */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-[#0d325a]/60">
              <div className="flex flex-col items-start gap-2">
                <div className="h-9 w-9 rounded-full bg-[#082A50] border border-[#00B8F5]/30 flex items-center justify-center text-[#00B8F5]">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-[#C5D3E3] leading-snug">
                  Sin máquinas inútiles
                </span>
              </div>

              <div className="flex flex-col items-start gap-2">
                <div className="h-9 w-9 rounded-full bg-[#082A50] border border-[#00B8F5]/30 flex items-center justify-center text-[#00B8F5]">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-[#C5D3E3] leading-snug">
                  Tarimas de madera y barras olímpicas
                </span>
              </div>

              <div className="flex flex-col items-start gap-2">
                <div className="h-9 w-9 rounded-full bg-[#082A50] border border-[#00B8F5]/30 flex items-center justify-center text-[#00B8F5]">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-[#C5D3E3] leading-snug">
                  Clases guiadas por entrenadores
                </span>
              </div>

              <div className="flex flex-col items-start gap-2">
                <div className="h-9 w-9 rounded-full bg-[#082A50] border border-[#00B8F5]/30 flex items-center justify-center text-[#00B8F5]">
                  <Award className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-[#C5D3E3] leading-snug">
                  Bonificado para socios SportClub
                </span>
              </div>
            </div>

            {/* CTAs Desktop */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#F12D43] px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-[#D91F34] hover:shadow-[#F12D43]/20 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#F12D43] min-h-[48px]"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Quiero empezar</span>
              </a>

              <a
                href="#actividades"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0d325a] bg-[#04172D] px-6 py-4 text-sm font-semibold text-[#C5D3E3] hover:text-white hover:bg-[#082A50] hover:border-[#00B8F5]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#00B8F5] min-h-[48px]"
              >
                <span>Ver actividades y horarios</span>
                <ArrowDown className="h-4 w-4 text-[#00B8F5]" />
              </a>
            </div>
          </div>

          {/* Columna Derecha: Imagen cinematográfica del atleta con disco Eleiko */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden border border-[#0d325a] shadow-2xl bg-[#04172D]">
              <Image
                src="/images/hero-athlete.webp"
                alt="Atleta levantando barra olímpica en tarima técnica de DAOM"
                fill
                priority
                sizes="40vw"
                className="object-cover object-center filter contrast-[1.1] brightness-[0.95]"
              />
              {/* Iluminación azul lateral y degradado integrado al fondo */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020D20] via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020D20]/70 via-transparent to-[#00B8F5]/10" />
            </div>

            {/* Acento geométrico diagonal decorativo detrás de la foto */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-[#00B8F5]/30 rounded-br-3xl pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}
