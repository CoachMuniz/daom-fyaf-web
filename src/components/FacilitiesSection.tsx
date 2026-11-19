import React from 'react';
import { Layers, ShieldCheck, Dumbbell, Award } from 'lucide-react';

interface FacilitiesSectionProps {
  mediaSlots?: Record<string, unknown>;
}

export function FacilitiesSection({}: FacilitiesSectionProps) {
  const facilityCards = [
    {
      icon: Layers,
      title: 'Tarimas y Plataformas Olímpicas',
      description: 'Superficies de madera reglamentarias y piso de caucho de alta densidad para halterofilia y drop seguro de barras.',
    },
    {
      icon: ShieldCheck,
      title: 'Racks, Jaulas y Zona Funcional',
      description: 'Estructura robusta de caño para dominadas, anillas, sentadillas y trabajo gimnástico de CrossFit.',
    },
    {
      icon: Dumbbell,
      title: 'Discos Bumper y Barras Olímpicas',
      description: 'Barras calibradas oficiales masculinas y femeninas, discos bumper de competición y kettlebells de alto rendimiento.',
    },
    {
      icon: Award,
      title: 'Espacio de Fuerza Oficial Club DAOM',
      description: 'Entorno deportivo profesional libre de máquinas comerciales innecesarias, pensado por y para atletas.',
    },
  ];

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
            Equipamiento deportivo profesional dentro del predio del Club DAOM. Un espacio diseñado por y para el entrenamiento de fuerza real.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilityCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col justify-between rounded-2xl border border-brand-navy bg-brand-petroleum p-6 transition-all duration-300 hover:border-brand-electric/50 hover:shadow-[0_0_20px_rgba(0,184,245,0.15)]"
              >
                <div>
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-brand-electric/15 border border-brand-electric/30 text-brand-electric mb-5 group-hover:bg-brand-electric group-hover:text-brand-dark transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-brand-textLight/80 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
