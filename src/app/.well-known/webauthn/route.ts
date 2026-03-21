import { NextResponse } from 'next/server';

/**
 * Related Origin Requests for WebAuthn
 * Allows passkeys registered with RP ID "rspace.online" to be used on this domain
 * See: https://passkeys.dev/docs/advanced/related-origins/
 */
export async function GET() {
  return NextResponse.json({
    origins: ['https://rspace.online'],
  });
}

