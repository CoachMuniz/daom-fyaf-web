import { describe, it, expect } from 'vitest';
import { getFyAfData, normalizeSheetData, parseCsv } from '@/lib/sheets';
import { signAdminToken, verifyAdminToken, AUTHORIZED_ADMIN_EMAILS } from '@/lib/admin-auth';

describe('3. Integridad Editorial, Sincronización Dinámica y Resiliencia', () => {
  it('debe reflejar la aparición de una actividad nueva válida', () => {
    const rawAct = [
      ['ID_ACTIVIDAD', 'NOMBRE', 'DESCRIPCION', 'TIPO', 'DIRECCION_TECNICA', 'ESTADO', 'PUBLICAR'],
      ['FYAF-NUEVA', 'Nueva Disciplina Funcional', 'Descripción nueva', 'Clases', 'Coach', 'ACTIVA', 'SI'],
    ];

    const result = normalizeSheetData(rawAct, [], [], [], [], [], []);
    expect(result).not.toBeNull();
    expect(result?.actividades.length).toBe(1);
    expect(result?.actividades[0].id_actividad).toBe('FYAF-NUEVA');
    // El slot multimedia para la nueva actividad debe haberse creado automáticamente
    expect(result?.mediaSlots['activity-fyaf-nueva']).toBeDefined();
    expect(result?.mediaSlots['activity-fyaf-nueva'].name).toContain('Nueva Disciplina');
  });

  it('un registro despublicado en Google Sheets desaparece inmediatamente', () => {
    const rawAct = [
      ['ID_ACTIVIDAD', 'NOMBRE', 'DESCRIPCION', 'TIPO', 'DIRECCION_TECNICA', 'ESTADO', 'PUBLICAR'],
      ['FYAF-CF', 'CrossFit', 'Desc', 'Tipo', 'Coach', 'ACTIVA', 'NO'], // PUBLICAR = NO
    ];

    const result = normalizeSheetData(rawAct, [], [], [], [], [], []);
    expect(result?.actividades.length).toBe(0);
  });

  it('una promoción vencida en Google Sheets deja de mostrarse', () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 86400000).toISOString().split('T')[0]; // Ayer
    const futureDate = new Date(now.getTime() + 86400000 * 30).toISOString().split('T')[0]; // En 30 días

    const rawAct = [
      ['ID_ACTIVIDAD', 'NOMBRE', 'DESCRIPCION', 'TIPO', 'DIRECCION_TECNICA', 'ESTADO', 'PUBLICAR'],
      ['FYAF-CF', 'CrossFit', 'Desc', 'Tipo', 'Coach', 'ACTIVA', 'SI'],
    ];

    const rawPromo = [
      ['ID_PROMOCION', 'ID_ACTIVIDAD', 'NOMBRE', 'DESCRIPCION', 'TIPO_BENEFICIO', 'VALOR_BENEFICIO', 'CONDICIONES', 'VIGENTE_DESDE', 'VIGENTE_HASTA', 'ESTADO', 'PUBLICAR'],
      ['PROMO-ACTIVA', 'FYAF-CF', 'Promo Vigente', 'Desc', 'descuento', '20%', '', '2026-01-01', futureDate, 'ACTIVA', 'SI'],
      ['PROMO-CADUCADA', 'FYAF-CF', 'Promo Vieja', 'Desc', 'descuento', '50%', '', '2026-01-01', pastDate, 'ACTIVA', 'SI'],
    ];

    const result = normalizeSheetData(rawAct, [], [], rawPromo, [], [], []);
    expect(result?.promociones.length).toBe(1);
    expect(result?.promociones[0].id_promocion).toBe('PROMO-ACTIVA');
  });

  it('un precio modificado en Google Sheets se actualiza exactamente', () => {
    const rawAct = [
      ['ID_ACTIVIDAD', 'NOMBRE', 'DESCRIPCION', 'TIPO', 'DIRECCION_TECNICA', 'ESTADO', 'PUBLICAR'],
      ['FYAF-CF', 'CrossFit', 'Desc', 'Tipo', 'Coach', 'ACTIVA', 'SI'],
    ];

    const rawAran = [
      ['ID_ARANCEL', 'ID_ACTIVIDAD', 'NOMBRE_PLAN', 'FRECUENCIA', 'PRECIO', 'MONEDA', 'CUOTA_SOCIAL', 'TOTAL', 'VIGENTE_DESDE', 'VIGENTE_HASTA', 'ESTADO', 'OBSERVACIONES'],
      ['ARAN-CF-01', 'FYAF-CF', 'Pase Mensual', 'Libre', '15000', 'ARS', '30500', '85000', '2026-01-01', '', 'APROBADO', ''],
    ];

    const result = normalizeSheetData(rawAct, [], rawAran, [], [], [], []);
    expect(result?.aranceles.length).toBe(1);
    expect(result?.aranceles[0].total).toBe(85000);
    expect(result?.aranceles[0].cuota_social).toBe(30500);
  });

  it('una respuesta vacía o incompleta no reemplaza los últimos datos válidos', () => {
    // Si Google Sheets devuelve un CSV vacío o de 0 filas
    const resultEmpty = normalizeSheetData([], [], [], [], [], [], []);
    expect(resultEmpty).toBeNull();
  });
});

describe('4. Seguridad y Autorización Administrativa en Servidor', () => {
  it('permite acceso a usuarios en la lista blanca con token firmado válido', () => {
    const adminEmail = AUTHORIZED_ADMIN_EMAILS[0];
    const token = signAdminToken(adminEmail, 'Matias');
    const verified = verifyAdminToken(token);

    expect(verified).not.toBeNull();
    expect(verified?.email).toBe(adminEmail);
    expect(verified?.role).toBe('admin');
  });

  it('deniega acceso si el token fue manipulado o el usuario no está en la lista blanca', () => {
    const fakeToken = signAdminToken('hacker@externo.com', 'Invasor');
    const verified = verifyAdminToken(fakeToken);
    expect(verified).toBeNull();

    const validToken = signAdminToken(AUTHORIZED_ADMIN_EMAILS[0]);
    const tamperedToken = validToken.substring(0, validToken.length - 4) + 'abcd';
    expect(verifyAdminToken(tamperedToken)).toBeNull();
  });
});
