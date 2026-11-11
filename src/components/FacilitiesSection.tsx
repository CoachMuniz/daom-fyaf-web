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
    <section id="instalaciones" className="py-20 bg-brand-dark border-b border-brand-border">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-primary text-xs font-bold uppercase tracking-wider">
            Infraestructura Real
          </span>
          <h2 className="text-3xl font-extrabold text-brand-text sm:text-4xl mt-2">
            Nuestras Instalaciones
          </h2>
          <p className="mt-4 text-base text-brand-muted">
            Fotografías reales del gimnasio en el predio del Club DAOM. Un espacio pensado por y para el entrenamiento de fuerza deportiva.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilitySlots.map((slot) => (
            <div
              key={slot.id}
              className="group overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-sm transition-all hover:border-slate-500"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-surfaceAlt">
                <Image
                  src={slot.url}
                  alt={slot.alt || slot.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-white leading-snug">
                  {slot.name.replace('Instalaciones: ', '')}
                </h3>
                <p className="text-xs text-brand-muted mt-1">
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
