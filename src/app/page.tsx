import React from 'react';
import { getFyAfData } from '@/lib/sheets';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ActivitiesSection } from '@/components/ActivitiesSection';
import { PromotionsSection } from '@/components/PromotionsSection';
import { FacilitiesSection } from '@/components/FacilitiesSection';
import { LocationSection } from '@/components/LocationSection';
import { Footer } from '@/components/Footer';

// Revalidar los datos periódicamente (cada 300 segundos / 5 minutos)
export const revalidate = 300;

export default async function HomePage() {
  const data = await getFyAfData();
  const heroSlot = data.mediaSlots['hero-cover'];
  const defaultWhatsapp = data.configuracion.whatsapp_default || '+5491146734406';

  return (
    <div className="flex min-h-screen flex-col bg-brand-dark selection:bg-brand-primary selection:text-white">
      {/* 1. Barra de Navegación Sticky */}
      <Navbar whatsappNumber={defaultWhatsapp} />

      <main className="flex-1">
        {/* 2. Hero / Portada Principal */}
        <Hero mediaSlot={heroSlot} whatsappNumber={defaultWhatsapp} />

        {/* 3. Sección de Actividades y Horarios (CrossFit, OLY, Open Box) */}
        <ActivitiesSection
          actividades={data.actividades}
          horarios={data.horarios}
          aranceles={data.aranceles}
          promociones={data.promociones}
          contactos={data.contactos}
          mediaSlots={data.mediaSlots}
          defaultWhatsapp={defaultWhatsapp}
        />

        {/* 4. Sección de Promociones y Bonificaciones (se oculta si no hay registros válidos) */}
        <PromotionsSection promociones={data.promociones} />

        {/* 5. Sección de Instalaciones Reales */}
        <FacilitiesSection mediaSlots={data.mediaSlots} />

        {/* 6. Sección de Ubicación y Mapa */}
        <LocationSection config={data.configuracion} />
      </main>

      {/* 7. Footer Institucional */}
      <Footer contactos={data.contactos} config={data.configuracion} />
    </div>
  );
}
