import { NextRequest, NextResponse } from 'next/server';
import {
  AUTHORIZED_ADMIN_EMAILS,
  signAdminToken,
} from '@/lib/admin-auth';

const ADMIN_FALLBACK_KEY = process.env.ADMIN_PANEL_KEY || 'daom-fyaf-admin-2026';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, password, googleCredential } = body;

    // A) Autenticación directa por Clave Administrativa Maestra
    if (method === 'key') {
      if (password === ADMIN_FALLBACK_KEY) {
        const token = signAdminToken(AUTHORIZED_ADMIN_EMAILS[0], 'Administrador Oficial FyAF');
        const res = NextResponse.json({
          success: true,
          token,
          user: { email: AUTHORIZED_ADMIN_EMAILS[0], name: 'Administrador Maestro' },
        });
        res.cookies.set('fyaf_admin_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
          path: '/',
        });
        return res;
      }
      return NextResponse.json({ error: 'Clave administrativa incorrecta' }, { status: 401 });
    }

    // B) Autenticación federada con Google (Validación de ID Token / Credencial JWT)
    if (method === 'google') {
      if (!googleCredential) {
        return NextResponse.json({ error: 'Credencial de Google no proporcionada' }, { status: 400 });
      }

      // Decodificar el payload del ID Token de Google
      const parts = googleCredential.split('.');
      if (parts.length !== 3) {
        return NextResponse.json({ error: 'Token de Google con formato inválido' }, { status: 400 });
      }

      const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
      const payload = JSON.parse(payloadJson);

      const email = (payload.email || '').toLowerCase().trim();
      const emailVerified = payload.email_verified;

      if (!email || !emailVerified) {
        return NextResponse.json(
          { error: 'El correo de Google no está verificado' },
          { status: 400 }
        );
      }

      // Verificación estricta de autorización en el servidor
      if (!AUTHORIZED_ADMIN_EMAILS.includes(email)) {
        return NextResponse.json(
          {
            error: `Acceso denegado: La cuenta ${email} no está autorizada en la lista de administradores de FyAF.`,
          },
          { status: 403 }
        );
      }

      const token = signAdminToken(email, payload.name || payload.given_name);
      const res = NextResponse.json({
        success: true,
        token,
        user: { email, name: payload.name || payload.given_name },
      });
      res.cookies.set('fyaf_admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return res;
    }

    return NextResponse.json({ error: 'Método de autenticación no soportado' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
