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
    <footer id="contacto" className="bg-brand-dark border-t border-brand-navy/80 py-16 text-brand-textLight">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Columna 1: Identidad */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-brand-navy bg-brand-petroleum flex items-center justify-center shrink-0">
                <Image
                  src="/logos/logo-fyaf.png"
                  alt="Logo Gimnasio de Fuerza y Acondicionamiento Físico"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-brand-navy/60 bg-brand-petroleum flex items-center justify-center shrink-0">
                <Image
                  src="/logos/club-daom.png"
                  alt="Escudo Club DAOM"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight block leading-snug">
                Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM
              </span>
              <span className="text-xs text-brand-textLight/70 block mt-0.5">
                Club DAOM • Flores, CABA
              </span>
            </div>
            
            {/* Logo y pertenencia a Familia SportClub */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-textLight/70 block mb-1.5">
                Somos Familia SportClub
              </span>
              <div className="relative h-9 w-32 bg-white rounded-lg p-1.5 shadow-sm border border-brand-navy/60">
                <Image
                  src="/logos/familia-sportclub.png"
                  alt="Familia SportClub Oficial"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>

            <p className="text-xs text-brand-textLight/80 leading-relaxed">
              Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM. Levantamiento Olímpico (OLY), CrossFit, Functional Training y Open Box.
            </p>
            <div className="text-xs text-brand-textLight/70">
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
                <a href="#inicio" className="hover:text-brand-electric transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#actividades" className="hover:text-brand-electric transition-colors">
                  Actividades y Horarios
                </a>
              </li>
              <li>
                <a href="#promociones" className="hover:text-brand-electric transition-colors">
                  Promociones y Convenios
                </a>
              </li>
              <li>
                <a href="#instalaciones" className="hover:text-brand-electric transition-colors">
                  Nuestras Instalaciones
                </a>
              </li>
              <li>
                <a href="#ubicacion" className="hover:text-brand-electric transition-colors">
                  Dónde Estamos
                </a>
              </li>
              <li>
                <a
                  href={config.google_maps_url || 'https://maps.google.com/?q=-34.6472889,-58.4489749'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-electric transition-colors inline-flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" />
                  <span>Google Maps</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contactos Oficiales */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contactos Oficiales
            </h4>
            <div className="space-y-3 text-xs">
              {contactos.length > 0 ? (
                contactos.map((c) => (
                  <div key={c.id_contacto} className="border-b border-brand-navy/60 pb-2 last:border-0">
                    <p className="font-semibold text-white">{c.area}</p>
                    {c.nombre_publico && (
                      <p className="text-[11px] text-brand-electric">
                        {c.nombre_publico}
                      </p>
                    )}
                    {c.canal === 'WhatsApp' ? (
                      <a
                        href={buildWhatsAppLink(c.destino, `Hola, quiero consultar con ${c.area}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-textLight hover:text-white transition-colors inline-flex items-center gap-1 mt-0.5"
                      >
                        <MessageCircle className="h-3 w-3 text-brand-sportRed" />
                        <span>{c.destino}</span>
                      </a>
                    ) : (
                      <p className="text-brand-textLight/70">{c.destino}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-brand-textLight/70">
                  Contactate a través de nuestro WhatsApp oficial.
                </p>
              )}
            </div>
          </div>

          {/* Columna 4: Redes y Accesos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Canales y Administración
            </h4>
            <div className="space-y-3">
              <a
                href={generalWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-sportRed px-4 py-3 text-xs font-bold text-white shadow hover:bg-brand-sportRed/90 transition-all focus:outline-none focus:ring-2 focus:ring-brand-sportRed"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Escribinos por WhatsApp</span>
              </a>

              <div className="space-y-1.5 pt-2">
                <a
                  href={config.instagram_oly || 'https://www.instagram.com/daom.wl/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-brand-textLight hover:text-white transition-colors p-2 rounded-lg bg-brand-petroleum border border-brand-navy"
                >
                  <InstagramIcon className="h-4 w-4 text-pink-400 shrink-0" />
                  <div>
                    <span className="block font-medium">Halterofilia DAOM</span>
                    <span className="text-[10px] text-brand-textLight/60">@daom.wl</span>
                  </div>
                </a>

                <a
                  href={config.instagram_cf || 'https://www.instagram.com/daom.cf/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-brand-textLight hover:text-white transition-colors p-2 rounded-lg bg-brand-petroleum border border-brand-navy"
                >
                  <InstagramIcon className="h-4 w-4 text-pink-400 shrink-0" />
                  <div>
                    <span className="block font-medium">CrossFit DAOM</span>
                    <span className="text-[10px] text-brand-textLight/60">@daom.cf</span>
                  </div>
                </a>
              </div>

              <div className="pt-4 border-t border-brand-navy/60">
                <Link
                  href="/admin"
                  className="text-[11px] text-brand-textLight/50 hover:text-brand-electric transition-colors"
                >
                  Acceso Administrativo
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior de derechos y autoría */}
        <div className="border-t border-brand-navy/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-textLight/60">
          <p>
            &copy; {new Date().getFullYear()} Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM. Todos los derechos reservados.
          </p>
          <p className="text-[11px] text-brand-textLight/50">
            Av. Varela 1802 • Flores, CABA • Club DAOM
          </p>
        </div>
      </div>
    </footer>
  );
}
