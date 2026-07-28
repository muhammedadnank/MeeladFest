import crypto from 'crypto';

/**
 * Generates a unique, reproducible verification code for a certificate.
 */
export function generateVerificationCode(
  festId: string,
  chestNo: string,
  itemId: string,
  certificateType: string
): string {
  const secret = process.env.NEXTAUTH_SECRET || 'meeladfest_cert_secret';
  const rawPayload = `${festId}:${chestNo.toLowerCase()}:${itemId}:${certificateType}`;
  const hash = crypto.createHmac('sha256', secret).update(rawPayload).digest('hex').substring(0, 10).toUpperCase();
  
  return `MF-${hash}`;
}

/**
 * Decodes or validates verification payload parameters
 */
export function parseVerificationCode(code: string): { validFormat: boolean; hash: string } {
  const cleaned = code.trim().toUpperCase();
  const isValid = cleaned.startsWith('MF-') && cleaned.length === 13;
  return {
    validFormat: isValid,
    hash: cleaned.replace('MF-', ''),
  };
}
