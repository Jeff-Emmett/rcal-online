import { NextResponse } from "next/server";

/**
 * Internal provision endpoint — called by rSpace Registry when activating
 * this app for a space. No auth required (only reachable from Docker network).
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
  return NextResponse.json({ status: "ok", space, message: "rcal space acknowledged" });
}
