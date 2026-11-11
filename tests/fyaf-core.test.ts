import { describe, it, expect } from 'vitest';
import { parseCsv } from '@/lib/sheets';
import { OFFICIAL_FALLBACK_DATA } from '@/lib/data-fallback';
import { INITIAL_MEDIA_SLOTS } from '@/lib/media-registry';
import { buildWhatsAppLink, formatCurrency } from '@/lib/utils';

describe('1. Integración y Normalización de Datos FyAF', () => {
  it('debe parsear correctamente CSV respetando comillas y comas internas', () => {
    const csvContent = 'COL1,COL2,COL3\n"Valor, con comas",Simple,"Con ""comillas escapadas"""';
    const parsed = parseCsv(csvContent);
    expect(parsed.length).toBe(2);
    expect(parsed[1][0]).toBe('Valor, con comas');
    expect(parsed[1][1]).toBe('Simple');
    expect(parsed[1][2]).toBe('Con "comillas escapadas"');
  });

  it('el dataset oficial debe contener las 3 actividades principales con estado activo', () => {
    const acts = OFFICIAL_FALLBACK_DATA.actividades;
    expect(acts.length).toBeGreaterThanOrEqual(3);
    const ids = acts.map(a => a.id_actividad);
    expect(ids).toContain('FYAF-CF');
    expect(ids).toContain('FYAF-OLY');
    expect(ids).toContain('FYAF-OPEN');

    // Comprobar que todas están publicadas
    acts.forEach(a => {
      expect(a.publicar).toBe('SI');
      expect(a.estado).toBe('ACTIVA');
    });
  });

  it('los horarios deben asociarse correctamente con actividades válidas', () => {
    const actIds = new Set(OFFICIAL_FALLBACK_DATA.actividades.map(a => a.id_actividad));
    OFFICIAL_FALLBACK_DATA.horarios.forEach(h => {
      expect(actIds.has(h.id_actividad)).toBe(true);
      expect(h.hora_inicio).toBeDefined();
      expect(h.dia_semana).toBeDefined();
    });
  });

  it('los aranceles no deben mostrar montos engañosos y calcular cuotas correctamente', () => {
    OFFICIAL_FALLBACK_DATA.aranceles.forEach(aran => {
      if (aran.precio > 0 && aran.cuota_social) {
        expect(aran.total).toBe(aran.precio + aran.cuota_social);
      }
    });
  });

  it('debe generar enlaces de WhatsApp válidos y seguros', () => {
    const link = buildWhatsAppLink('+54 9 11 4673-4406', 'Hola, quiero empezar!');
    expect(link).toContain('https://wa.me/5491146734406');
    expect(link).toContain('text=Hola%2C%20quiero%20empezar!');
  });

  it('debe formatear monedas correctamente en ARS', () => {
    const formatted = formatCurrency(36200);
    expect(formatted).toContain('36.200');
  });
});

describe('2. Registro de Ubicaciones Multimedia Reales', () => {
  it('todas las ubicaciones multimedia deben tener IDs estables y correspondencia en la web', () => {
    const slots = Object.values(INITIAL_MEDIA_SLOTS);
    expect(slots.length).toBeGreaterThanOrEqual(5);

    const slotIds = Object.keys(INITIAL_MEDIA_SLOTS);
    expect(slotIds).toContain('hero-cover');
    expect(slotIds).toContain('activity-cf');
    expect(slotIds).toContain('activity-oly');
    expect(slotIds).toContain('activity-openbox');
    expect(slotIds).toContain('facility-1');

    slots.forEach(slot => {
      expect(slot.name).toBeTruthy();
      expect(slot.url).toBeTruthy();
      expect(slot.section).toBeTruthy();
      expect(slot.alt).toBeTruthy();
    });
  });
});
