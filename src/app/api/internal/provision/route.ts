import { NextResponse } from "next/server";

/**
 * Internal provision endpoint — called by rSpace Registry when activating
 * this app for a space. No auth required (only reachable from Docker network).
 *
 * Payload: { space, description, admin_email, public, owner_did }
 * The owner_did identifies who registered the space via the registry.
 *
 * rcal will associate calendars with space slugs in future.
 * Acknowledges provisioning for now.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const space: string = body.space?.trim();
  if (!space) {
    return NextResponse.json({ error: "Missing space name" }, { status: 400 });
  }
  const ownerDid: string = body.owner_did || "";
  return NextResponse.json({ status: "ok", space, owner_did: ownerDid, message: "rcal space acknowledged" });
}
