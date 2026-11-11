import { describe, it, expect } from 'vitest';
import { parseCsv, sanitizePhoneNumber, normalizeSheetData } from '@/lib/sheets';
import { INITIAL_MEDIA_SLOTS } from '@/lib/media-registry';
import { buildWhatsAppLink, formatCurrency } from '@/lib/utils';
import fs from 'fs';
import path from 'path';

describe('1. Integración y Normalización de Datos Reales de Google Sheets', () => {
  it('debe parsear correctamente CSV respetando comillas y saltos de línea internos', () => {
    const csvContent = 'COL1,COL2,COL3\n"Valor, con comas",Simple,"Con ""comillas escapadas"""';
    const parsed = parseCsv(csvContent);
    expect(parsed.length).toBe(2);
    expect(parsed[1][0]).toBe('Valor, con comas');
    expect(parsed[1][1]).toBe('Simple');
    expect(parsed[1][2]).toBe('Con "comillas escapadas"');
  });

  it('debe normalizar correctamente la planilla real procesando las 3 actividades de FyAF y omitiendo WL', () => {
    const dumpDir = path.join(process.cwd(), 'data', 'sheets_dump');
    const actCsv = fs.readFileSync(path.join(dumpDir, 'ACTIVIDADES.csv'), 'utf8');
    const horCsv = fs.readFileSync(path.join(dumpDir, 'HORARIOS.csv'), 'utf8');
    const aranCsv = fs.readFileSync(path.join(dumpDir, 'ARANCELES.csv'), 'utf8');
    const promoCsv = fs.readFileSync(path.join(dumpDir, 'PROMOCIONES.csv'), 'utf8');
    const contCsv = fs.readFileSync(path.join(dumpDir, 'CONTACTOS.csv'), 'utf8');
    const cfgCsv = fs.readFileSync(path.join(dumpDir, 'CONFIGURACION.csv'), 'utf8');
    const redCsv = fs.readFileSync(path.join(dumpDir, 'REDES_SOCIALES.csv'), 'utf8');

    const result = normalizeSheetData(
      parseCsv(actCsv),
      parseCsv(horCsv),
      parseCsv(aranCsv),
      parseCsv(promoCsv),
      parseCsv(contCsv),
      parseCsv(cfgCsv),
      parseCsv(redCsv)
    );

    expect(result).not.toBeNull();
    if (!result) return;

    // Verificar actividades publicadas: Solo CrossFit, Open Box y OLY (WL tiene PUBLICAR=NO)
    const actIds = result.actividades.map((a) => a.id_actividad);
    expect(actIds).toContain('FYAF-CF');
    expect(actIds).toContain('FYAF-OPEN');
    expect(actIds).toContain('FYAF-OLY');
    expect(actIds).not.toContain('WL');

    // Verificar horarios vinculados
    expect(result.horarios.length).toBeGreaterThanOrEqual(15);
    result.horarios.forEach((h) => {
      expect(['FYAF-CF', 'FYAF-OPEN', 'FYAF-OLY']).toContain(h.id_actividad);
    });

    // Verificar aranceles reales
    const olyAran = result.aranceles.find((a) => a.id_arancel === 'ARAN-OLY-LIBRE');
    expect(olyAran).toBeDefined();
    expect(olyAran?.total).toBe(66700);

    const openAran = result.aranceles.find((a) => a.id_arancel === 'ARAN-OPEN-LIBRE');
    expect(openAran).toBeDefined();
    expect(openAran?.total).toBe(66700);

    const cfAran = result.aranceles.find((a) => a.id_arancel === 'ARAN-CF-LIBRE');
    expect(cfAran).toBeDefined();
    expect(cfAran?.total).toBe(75700);

    // Verificar promociones válidas
    const promoIds = result.promociones.map((p) => p.id_promocion);
    expect(promoIds).toContain('PROMO-CF-01');
    expect(promoIds).toContain('PROMO-OLY-01');
    // Las de WL no deben publicarse en FyAF
    expect(promoIds).not.toContain('MEDIA-BECA-WL-S');

    // Sanitización de teléfonos de WhatsApp
    result.contactos.forEach((c) => {
      expect(c.destino).not.toContain('E+');
      expect(c.destino.startsWith('+54')).toBe(true);
    });

    // Redes sociales oficiales vinculadas
    expect(result.configuracion.instagram_cf).toBe('https://www.instagram.com/daom.cf/');
    expect(result.configuracion.instagram_oly).toBe('https://www.instagram.com/daom.wl/');
  });

  it('debe sanitizar números en formato científico provenientes de Google Sheets', () => {
    const rawSci = '5.49E+17';
    const sanitized = sanitizePhoneNumber(rawSci);
    expect(sanitized).toBe('+5491146734406');

    const cleanNum = '5491146734466';
    const sanitized2 = sanitizePhoneNumber(cleanNum);
    expect(sanitized2).toBe('+5491146734466');
  });

  it('debe generar enlaces de WhatsApp válidos y seguros', () => {
    const link = buildWhatsAppLink('+54 9 11 4673-4406', 'Hola, quiero empezar!');
    expect(link).toContain('https://wa.me/5491146734406');
    expect(link).toContain('text=Hola%2C%20quiero%20empezar!');
  });

  it('debe formatear monedas correctamente en ARS', () => {
    const formatted = formatCurrency(66700);
    expect(formatted).toContain('66.700');
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

    slots.forEach((slot) => {
      expect(slot.name).toBeTruthy();
      expect(slot.url).toBeTruthy();
      expect(slot.section).toBeTruthy();
      expect(slot.alt).toBeTruthy();
    });
  });
});
