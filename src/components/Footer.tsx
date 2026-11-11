import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, MapPin } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { FyAfContacto, FyAfConfiguracion } from '@/types/fyaf';
import { buildWhatsAppLink } from '@/lib/utils';

interface FooterProps {
  contactos: FyAfContacto[];
  config: FyAfConfiguracion;
}

export function Footer({ contactos, config }: FooterProps) {
  const whatsappNumber = config.whatsapp_default || '+5491146734406';
  const generalWaUrl = buildWhatsAppLink(
    whatsappNumber,
    'Hola! Quiero información general para empezar en el Gimnasio FyAF del Club DAOM.'
  );

  return (
    <footer id="contacto" className="bg-brand-dark border-t border-brand-border py-16 text-brand-muted">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Columna 1: Identidad */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-border bg-brand-surface flex items-center justify-center">
                <Image
                  src="/logos/club-daom.png"
                  alt="Escudo Club DAOM"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                FyAF — Club DAOM
              </span>
            </div>
            
            {/* Logo y pertenencia a Familia SportClub */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Somos Familia SportClub
              </span>
              <div className="relative h-9 w-32 bg-white rounded-lg p-1.5 shadow-sm border border-brand-border/60">
                <Image
                  src="/logos/familia-sportclub.png"
                  alt="Familia SportClub Oficial"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed">
              Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM. Halterofilia, CrossFit, funcional y entrenamiento libre.
            </p>
            <div className="text-xs text-slate-400">
              <p>{config.sede_direccion || 'Av. Varela 1802, Flores, CABA'}</p>
              <p className="mt-1">Buenos Aires, Argentina</p>
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#actividades" className="hover:text-white transition-colors">
                  Actividades y Horarios
                </a>
              </li>
              <li>
                <a href="#promociones" className="hover:text-white transition-colors">
                  Promociones y Convenios
                </a>
              </li>
              <li>
                <a href="#instalaciones" className="hover:text-white transition-colors">
                  Instalaciones Reales
                </a>
              </li>
              <li>
                <a href="#ubicacion" className="hover:text-white transition-colors">
                  Cómo Llegar
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Redes Sociales Oficiales */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Redes Sociales
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={config.instagram_cf || 'https://www.instagram.com/daom.cf/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <InstagramIcon className="h-4 w-4 text-pink-400" />
                  <span>@daom.cf (CrossFit / General)</span>
                </a>
              </li>
              <li>
                <a
                  href={config.instagram_oly || 'https://www.instagram.com/daom.wl/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <InstagramIcon className="h-4 w-4 text-pink-400" />
                  <span>@daom.wl (Levantamiento Olímpico)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Canal de Contacto */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Atención Directa
            </h4>
            <p className="text-xs text-brand-muted mb-4 leading-relaxed">
              Coordiná tu visita o hacé tu consulta directamente con nuestro equipo.
            </p>
            <a
              href={generalWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chatear por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Barra inferior de derechos y acceso técnico */}
        <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Club DAOM — Gimnasio FyAF. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-brand-dim">
            <span>Fuente oficial: DAOM_FyAF_Fuente_Oficial</span>
            <span>•</span>
            <Link href="/admin" className="hover:text-brand-muted transition-colors">
              Panel Multimedia
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
