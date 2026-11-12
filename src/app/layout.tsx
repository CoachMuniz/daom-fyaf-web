import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gimnasio.daom.club'),
  title: 'Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM | CrossFit, OLY, Funcional y Open Box en Flores',
  description:
    'Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM en Flores, CABA. Clases guiadas de CrossFit, Functional Training, Halterofilia / Levantamiento Olímpico (OLY) y Open Box. Av. Varela 1802.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logos/logo-fyaf.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/logos/logo-fyaf.png',
  },
  keywords: [
    'Gimnasio Club DAOM',
    'Gimnasio en Flores',
    'CrossFit Flores',
    'Entrenamiento funcional Flores',
    'Levantamiento olímpico CABA',
    'Halterofilia Flores',
    'Open Box Flores',
    'DAOM Weightlifting',
    'FyAF Club DAOM',
  ],
  authors: [{ name: 'Club DAOM' }],
  creator: 'Club DAOM',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://gimnasio.daom.club',
    title: 'Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM | Flores, CABA',
    description:
      'Gimnasio oficial de Fuerza y Acondicionamiento Físico en el Club DAOM. Horarios, aranceles, instalaciones y actividades.',
    siteName: 'Gimnasio FyAF - Club DAOM',
    images: [
      {
        url: '/images/hero-gym.webp',
        width: 1200,
        height: 630,
        alt: 'Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gimnasio de Fuerza y Acondicionamiento Físico del Club DAOM',
    description: 'CrossFit, Levantamiento Olímpico, Funcional y Open Box en Flores, CABA.',
    images: ['/images/hero-gym.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} dark scroll-smooth`}>
      <head>
        {/* Schema.org Datos Estructurados JSON-LD para SEO Local */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ExerciseGym',
              name: 'Gimnasio de Fuerza y Acondicionamiento Físico (FyAF) - Club DAOM',
              image: 'https://gimnasio.daom.club/images/hero-gym.webp',
              url: 'https://gimnasio.daom.club',
              telephone: '+5491146734406',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Av. Varela 1802',
                addressLocality: 'Flores',
                addressRegion: 'Ciudad Autónoma de Buenos Aires',
                postalCode: 'C1406',
                addressCountry: 'AR',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: -34.6472889,
                longitude: -58.4489749,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '08:00',
                  closes: '21:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday'],
                  opens: '09:00',
                  closes: '18:00',
                },
              ],
              priceRange: '$$',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-brand-dark text-brand-text font-sans antialiased selection:bg-brand-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
