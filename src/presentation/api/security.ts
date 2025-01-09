import crypto from 'crypto';
import util from 'util';

const pbkdf2 = util.promisify(crypto.pbkdf2);

export const generateSalt = () => crypto.randomBytes(128).toString('base64');
export const generateSecret = () => crypto.randomBytes(32).toString('base64url');

export function encodeApiKey(clientId: string, secret: string) {
  return Buffer.from(`${clientId}.${secret}`, 'utf-8').toString('base64url');
}

export function generateApiKey(clientId: string) {
  const secret = generateSecret();
  return Buffer.from(`${clientId}.${secret}`, 'utf-8').toString('base64url');
}

export function decodeApiKey(encodedApiKey: string): { clientId: string; secret: string } {
  const apiKey = Buffer.from(encodedApiKey, 'base64').toString('utf-8');
  const parts = apiKey.split('.');
  if (parts.length !== 2) {
    throw new Error("Couldn't decode API key.");
  }

  const [clientId, secret] = parts;

  return {
    clientId,
    secret
  };
}

export async function hashSecret(secret: string) {
  if (!process.env.SECRET_PEPPER) {
    throw new Error('Missing SECRET_PEPPER environment variable');
  }

  const pepperedKey = `${process.env.SECRET_PEPPER}${secret}`;
  const salt = generateSalt();
  const iterations = 10000;
  const keylen = 128;
  const digest = 'sha256';

  const hashBuffer = await pbkdf2(pepperedKey, salt, iterations, keylen, digest);
  const hashedSecret = hashBuffer.toString('base64');

  return { salt, hashedSecret, iterations };
}

export async function verifySecret(
  secret: string,
  savedHash: string,
  salt: string,
  savedIterations: number
): Promise<boolean> {
  if (!process.env.SECRET_PEPPER) {
    throw new Error('Missing PASSWORD_PEPPER environment variable');
  }

  const keylen = Buffer.from(savedHash, 'base64').length;
  const digest = 'sha256';

  const pepperyPassword = `${process.env.SECRET_PEPPER}${secret}`;
  const attemptBuffer = await pbkdf2(pepperyPassword, salt, savedIterations, keylen, digest);
  const savedBuffer = Buffer.from(savedHash, 'base64');

  return crypto.timingSafeEqual(savedBuffer, attemptBuffer);
}
