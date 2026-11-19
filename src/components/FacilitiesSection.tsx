import React from 'react';
import Image from 'next/image';
import { FyAfMediaSlot } from '@/types/fyaf';

interface FacilitiesSectionProps {
  mediaSlots: Record<string, FyAfMediaSlot>;
}

export function FacilitiesSection({ mediaSlots }: FacilitiesSectionProps) {
  const facilitySlots = [
    mediaSlots['facility-1'],
    mediaSlots['facility-2'],
    mediaSlots['facility-3'],
    mediaSlots['facility-4'],
  ].filter(Boolean);

  return (
    <section id="instalaciones" className="py-20 bg-brand-dark border-b border-brand-navy/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-1 w-6 bg-brand-electric rounded-full inline-block" />
            <span className="text-brand-electric text-xs font-bold uppercase tracking-widest">
              Infraestructura y Equipamiento
            </span>
            <span className="h-1 w-6 bg-brand-electric rounded-full inline-block" />
          </div>
          <h2 className="text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl mt-1">
            NUESTRAS INSTALACIONES
          </h2>
          <p className="mt-3 text-base text-brand-textLight">
            Fotografías reales del gimnasio en el predio del Club DAOM. Un espacio profesional pensado por y para el entrenamiento de fuerza deportiva.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilitySlots.map((slot) => (
            <div
              key={slot.id}
              className="group overflow-hidden rounded-2xl border border-brand-navy bg-brand-petroleum shadow-sm transition-all duration-300 hover:border-brand-electric/50 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-dark">
                <Image
                  src={slot.url}
                  alt={slot.alt || slot.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-petroleum/90 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-white leading-snug">
                  {slot.name.replace('Instalaciones: ', '')}
                </h3>
                <p className="text-xs text-brand-textLight/80 mt-1">
                  {slot.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
