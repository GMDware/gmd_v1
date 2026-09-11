import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'gmdware-default-super-secret-key-32-chars-minimum'
);

export interface AdminTokenPayload {
  userId: string;
  email: string;
  name: string;
  roles: string[];
}

/**
 * Signs a cryptographic JWT session token using Jose
 */
export async function signAdminToken(
  payload: AdminTokenPayload,
  expiresIn = '7d'
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

/**
 * Cryptographically verifies and unpacks a JWT token
 */
export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Hashes a plaintext password with bcryptjs salt factor 12
 */
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 12);
}

/**
 * Verifies a plaintext password against a bcrypt hash
 */
export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}
