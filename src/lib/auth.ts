import { getEncryptIDSession } from '@encryptid/sdk/server/nextjs';
import { NextResponse } from 'next/server';
import { prisma } from './prisma';
import type { User } from '@prisma/client';

export interface AuthResult {
  user: User;
  did: string;
}

const UNAUTHORIZED = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

/**
 * Get authenticated user from request, or null if not authenticated.
 * Upserts User in DB by DID (find-or-create).
 */
export async function getAuthUser(request: Request): Promise<AuthResult | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const claims: any = await getEncryptIDSession(request);
  if (!claims) return null;

  const did: string | undefined = claims.did || claims.sub;
  if (!did) return null;

  const username: string | null = claims.username || null;
  const user = await prisma.user.upsert({
    where: { did },
    update: { username: username || undefined },
    create: { did, username },
  });

  return { user, did };
}

/**
 * Require authentication. Returns auth result or a 401 NextResponse.
 */
export async function requireAuth(request: Request): Promise<AuthResult | NextResponse> {
  const result = await getAuthUser(request);
  if (!result) return UNAUTHORIZED;
  return result;
}

/** Type guard for successful auth */
export function isAuthed(result: AuthResult | NextResponse): result is AuthResult {
  return !(result instanceof NextResponse);
}
