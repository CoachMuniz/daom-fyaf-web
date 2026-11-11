import React from 'react';
import { MapPin, Navigation, Bus, Clock, ExternalLink } from 'lucide-react';
import { FyAfConfiguracion } from '@/types/fyaf';

interface LocationSectionProps {
  config: FyAfConfiguracion;
}

export function LocationSection({ config }: LocationSectionProps) {
  const address = config.sede_direccion || 'Av. Varela 1802, Flores, CABA (esquina Av. Castañares)';
  const mapsUrl = config.google_maps_url || 'https://maps.google.com/?q=-34.6472889,-58.4489749';

  return (
    <section id="ubicacion" className="py-20 bg-brand-surface border-b border-brand-border">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-primary text-xs font-bold uppercase tracking-wider">
            Sede Central
          </span>
          <h2 className="text-3xl font-extrabold text-brand-text sm:text-4xl mt-2">
            Dónde Estamos y Cómo Llegar
          </h2>
          <p className="mt-4 text-base text-brand-muted">
            Ubicados dentro del predio polideportivo del Club DAOM en el barrio de Flores, Ciudad de Buenos Aires.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Tarjeta de información útil de acceso */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-brand-border bg-brand-dark p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-brand-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Dirección Oficial
                  </h3>
                  <p className="text-base text-slate-300 mt-1 font-medium">
                    {address}
                  </p>
                  <p className="text-xs text-brand-muted mt-1">
                    Ingreso directo por la portería deportiva del Club DAOM.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-brand-border/60 space-y-4">
                <div className="flex items-start gap-3">
                  <Bus className="h-5 w-5 text-brand-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Líneas de Colectivo cercanas
                    </h4>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Líneas 7, 26, 42, 44, 50, 101, 132 (paradas a pocas cuadras de Av. Varela y Castañares).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-brand-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Horario General del Predio
                    </h4>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Lunes a Viernes de 08:00 a 22:00 hs • Sábados de 09:00 a 19:00 hs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-accent px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-accentHover transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Cómo llegar en Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>
              </div>
            </div>
          </div>

          {/* Mapa embebido de Google Maps */}
          <div className="lg:col-span-7 h-[420px] rounded-2xl overflow-hidden border border-brand-border shadow-md">
            <iframe
              title="Ubicación Gimnasio FyAF Club DAOM"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.823438992163!2d-58.4515549!3d-34.6472889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccbd54605170d%3A0xe510cbb2fe1dfa52!2sClub%20DAOM!5e0!3m2!1ses-419!2sar!4v1715421000000!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter invert-[0.9] hue-rotate-[180deg] contrast-[0.88]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
