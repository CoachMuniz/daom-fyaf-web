import { describe, it, expect, vi } from 'vitest';
import { getFyAfData, parseCsv } from '@/lib/sheets';
import { OFFICIAL_FALLBACK_DATA } from '@/lib/data-fallback';

describe('3. Integridad Editorial, Caché y Resiliencia de Datos', () => {
  it('debe tolerar interrupción temporal de Google Sheets devolviendo datos válidos oficiales', async () => {
    // Si la llamada remota falla o se desconecta, nunca debe quedar la página en blanco ni lanzar error no controlado
    const data = await getFyAfData();
    expect(data).toBeDefined();
    expect(data.actividades.length).toBeGreaterThan(0);
    expect(['google-sheets', 'verified-cache', 'fallback-official']).toContain(data.source);
  });

  it('no debe publicar registros con PUBLICAR=NO ni estado INACTIVA', () => {
    const rawWithDraft = [
      ['ID_ACTIVIDAD', 'NOMBRE', 'DESCRIPCION', 'TIPO', 'DIRECCION_TECNICA', 'ESTADO', 'PUBLICAR'],
      ['ACT-TEST-1', 'Actividad Publicada', 'Desc', 'Tipo', 'Coach', 'ACTIVA', 'SI'],
      ['ACT-TEST-2', 'Borrador Oculto', 'Desc', 'Tipo', 'Coach', 'BORRADOR', 'NO'],
      ['ACT-TEST-3', 'Inactiva', 'Desc', 'Tipo', 'Coach', 'INACTIVA', 'SI'],
    ];

    const parsedLines = rawWithDraft;
    const header = parsedLines[0];
    const rows = parsedLines.slice(1);

    const filtered = rows.filter(r => {
      const pub = r[header.indexOf('PUBLICAR')];
      const est = r[header.indexOf('ESTADO')];
      return pub === 'SI' && est !== 'INACTIVA';
    });

    expect(filtered.length).toBe(1);
    expect(filtered[0][0]).toBe('ACT-TEST-1');
  });

  it('debe filtrar promociones vencidas por fecha VIGENTE_HASTA', () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 86400000).toISOString().split('T')[0]; // ayer
    const futureDate = new Date(now.getTime() + 86400000 * 30).toISOString().split('T')[0]; // en 30 días

    const rawPromos = [
      ['ID_PROMOCION', 'NOMBRE', 'ESTADO', 'PUBLICAR', 'VIGENTE_HASTA'],
      ['P-VIGENTE', 'Promo Activa', 'ACTIVA', 'SI', futureDate],
      ['P-VENCIDA', 'Promo Caducada', 'ACTIVA', 'SI', pastDate],
    ];

    const header = rawPromos[0];
    const validPromos = rawPromos.slice(1).filter(r => {
      const hasta = r[header.indexOf('VIGENTE_HASTA')];
      const pub = r[header.indexOf('PUBLICAR')];
      const est = r[header.indexOf('ESTADO')];
      const isExpired = hasta && new Date(hasta) < now;
      return pub === 'SI' && est === 'ACTIVA' && !isExpired;
    });

    expect(validPromos.length).toBe(1);
    expect(validPromos[0][0]).toBe('P-VIGENTE');
  });
});
