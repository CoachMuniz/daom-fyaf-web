import React from 'react';
import Image from 'next/image';
import { Tag, CheckCircle2 } from 'lucide-react';
import { FyAfPromocion } from '@/types/fyaf';

interface PromotionsSectionProps {
  promociones: FyAfPromocion[];
}

export function PromotionsSection({ promociones }: PromotionsSectionProps) {
  // Requisito estricto: Si no existen promociones publicables, ocultar la sección completamente
  if (!promociones || promociones.length === 0) {
    return null;
  }

  // Ordenar promociones para que:
  // 1. "Mes de prueba gratis Crossfit" (PROMO-CF-01)
  // 2. "Mes de prueba gratis OLY" (PROMO-OLY-01)
  // 3. "Familia Sport Club" (Sport Club) a la derecha
  const sortedPromos = [...promociones].sort((a, b) => {
    const isSportA = a.id_promocion.toLowerCase().includes('sport') || a.nombre.toLowerCase().includes('sport');
    const isSportB = b.id_promocion.toLowerCase().includes('sport') || b.nombre.toLowerCase().includes('sport');
    if (isSportA && !isSportB) return 1;
    if (!isSportA && isSportB) return -1;
    return 0;
  });

  return (
    <section id="promociones" className="py-20 bg-brand-surface border-b border-brand-border">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Beneficios Vigentes
          </span>
          <h2 className="text-3xl font-extrabold text-brand-text sm:text-4xl mt-2">
            Promociones y Bonificaciones
          </h2>
          <p className="mt-3 text-base text-brand-muted">
            Beneficios oficiales confirmados para socios, deportistas y convenios institucionales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPromos.map((p) => {
            const isSportClub = p.id_promocion.toLowerCase().includes('sport') || p.nombre.toLowerCase().includes('sport');

            return (
              <div
                key={p.id_promocion}
                className="flex flex-col justify-between rounded-2xl border border-brand-border bg-brand-dark p-6 transition-all hover:border-emerald-500/50 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-400">
                      <Tag className="h-3 w-3" />
                      {p.valor_beneficio || 'Promoción'}
                    </span>
                  </div>

                  {isSportClub ? (
                    <div className="mb-4">
                      <div className="relative h-12 w-48 bg-white rounded-lg px-3 py-1.5 shadow-sm flex items-center justify-start border border-brand-border/60">
                        <Image
                          src="/logos/familia-sportclub.png"
                          alt="Familia SportClub"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-xl font-bold text-white mb-2">
                      {p.nombre}
                    </h3>
                  )}

                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {p.descripcion}
                  </p>
                </div>

                {p.condiciones && (
                  <div className="pt-4 border-t border-brand-border/60 text-xs text-brand-muted flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
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
