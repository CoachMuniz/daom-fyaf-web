import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Genera el enlace oficial de WhatsApp con mensaje personalizado y codificado
 */
export function buildWhatsAppLink(phone: string, text: string): string {
  // Eliminar cualquier caracter que no sea dígito
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Formateador de moneda en pesos argentinos (ARS)
 */
export function formatCurrency(amount?: number, currency = 'ARS'): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'A consultar';
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
