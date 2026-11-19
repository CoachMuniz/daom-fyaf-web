import React from 'react';
import Image from 'next/image';
import { Tag, CheckCircle2 } from 'lucide-react';
import { FyAfPromocion } from '@/types/fyaf';

interface PromotionsSectionProps {
  promociones: FyAfPromocion[];
}

export function PromotionsSection({ promociones }: PromotionsSectionProps) {
  // Si no existen promociones publicables, ocultar la sección completamente
  if (!promociones || promociones.length === 0) {
    return null;
  }

  // Ordenar promociones:
  // 1. "Mes de prueba gratis Crossfit" (PROMO-CF-01)
  // 2. "Mes de prueba gratis OLY" (PROMO-OLY-01)
  // 3. "Familia Sport Club" a la derecha
  const sortedPromos = [...promociones].sort((a, b) => {
    const isSportA = a.id_promocion.toLowerCase().includes('sport') || a.nombre.toLowerCase().includes('sport');
    const isSportB = b.id_promocion.toLowerCase().includes('sport') || b.nombre.toLowerCase().includes('sport');
    if (isSportA && !isSportB) return 1;
    if (!isSportA && isSportB) return -1;
    return 0;
  });

  return (
    <section id="promociones" className="py-20 bg-brand-petroleum border-b border-brand-navy/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-1 w-6 bg-brand-electric rounded-full inline-block" />
            <span className="text-brand-electric text-xs font-bold uppercase tracking-widest">
              Beneficios Vigentes
            </span>
            <span className="h-1 w-6 bg-brand-electric rounded-full inline-block" />
          </div>
          <h2 className="text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl mt-1">
            Promociones y Convenios
          </h2>
          <p className="mt-3 text-base text-brand-textLight">
            Beneficios oficiales confirmados para socios del club, deportistas y convenios institucionales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPromos.map((p) => {
            const isSportClub = p.id_promocion.toLowerCase().includes('sport') || p.nombre.toLowerCase().includes('sport');

            return (
              <div
                key={p.id_promocion}
                className="flex flex-col justify-between rounded-2xl border border-brand-navy bg-brand-dark p-6 sm:p-7 transition-all duration-300 hover:border-brand-electric/50 hover:shadow-[0_0_20px_rgba(0,184,245,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-electric/15 border border-brand-electric/30 px-3 py-1 text-xs font-bold text-brand-electric">
                      <Tag className="h-3 w-3" />
                      {p.valor_beneficio || 'Promoción Oficial'}
                    </span>
                  </div>

                  {isSportClub ? (
                    <div className="mb-4">
                      <div className="relative h-12 w-48 bg-white rounded-lg px-3 py-1.5 shadow-sm flex items-center justify-start border border-brand-navy/40">
                        <Image
                          src="/logos/familia-sportclub.png"
                          alt="Familia SportClub"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                      {p.nombre}
                    </h3>
                  )}

                  <p className="text-sm text-brand-textLight leading-relaxed mb-4">
                    {p.descripcion}
                  </p>
                </div>

                {p.condiciones && (
                  <div className="pt-4 border-t border-brand-navy/60 text-xs text-brand-textLight/80 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-electric shrink-0 mt-0.5" />
                    <span>{p.condiciones}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
