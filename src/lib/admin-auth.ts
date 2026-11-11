import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

// Administradores autorizados explícitamente en el servidor
export const AUTHORIZED_ADMIN_EMAILS = [
  'matias.muniz@gmail.com',
  'coachmuniz@users.noreply.github.com',
  'administracion@daom.com.ar',
  'daom.weightlifting@gmail.com',
];

const ADMIN_FALLBACK_KEY = process.env.ADMIN_PANEL_KEY || 'daom-fyaf-admin-2026';
const JWT_SECRET = process.env.JWT_SECRET || 'fyaf_jwt_secret_daom_2026_super_secure_auth';

export interface AdminSession {
  email: string;
  name?: string;
  role: 'admin';
  exp: number;
}

/**
 * Genera un token HMAC-SHA256 firmado para la sesión administrativa
 */
export function signAdminToken(email: string, name?: string): string {
  const payload: AdminSession = {
    email: email.toLowerCase(),
    name,
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 horas
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Valida un token de sesión de administrador
 */
export function verifyAdminToken(token: string): AdminSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(payloadB64)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: AdminSession = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expirado
    }

    if (!AUTHORIZED_ADMIN_EMAILS.includes(payload.email.toLowerCase())) {
      return null; // No está en la lista blanca
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Comprueba si la solicitud entrante está debidamente autorizada en el servidor
 */
export function isRequestAuthorized(req: NextRequest): boolean {
  // 1. Verificar Authorization Bearer (Token de sesión o Clave Maestra de despliegue)
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (token) {
    if (token === ADMIN_FALLBACK_KEY) {
      return true;
    }
    const verified = verifyAdminToken(token);
    if (verified) return true;
  }

  // 2. Verificar Cookie de sesión segura
  const cookieToken = req.cookies.get('fyaf_admin_session')?.value;
  if (cookieToken) {
    const verified = verifyAdminToken(cookieToken);
    if (verified) return true;
  }

  return false;
}
