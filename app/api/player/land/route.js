import { NextResponse } from 'next/server';
import { neon } from '@netlify/neon';
import { GRAIN_PER_MINUTE_PER_LAND } from 'lib/config';

const sql = neon();

// GET: Return player data (land + grain) and optionally update grain if needed
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId');

  if (!playerId) {
    return NextResponse.json({ error: 'Missing playerId' }, { status: 400 });
  }

  const result = await sql`
    SELECT id, name, land, grain, grain_updated_at
    FROM players
    WHERE id = ${playerId}
  `;

  if (result.length === 0) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  const player = result[0];

  // Ensure both timestamps are in UTC
  const nowUTC = new Date(new Date().toISOString());
  const lastUpdate = new Date(player.grain_updated_at || 0);
  const diffMinutes = Math.floor((nowUTC - lastUpdate) / 60000);

  let updatedGrain = player.grain;

  if (diffMinutes > 0 && player.land > 0) {
    const generated = Math.floor(diffMinutes * player.land * GRAIN_PER_MINUTE_PER_LAND);
    updatedGrain += generated;

    await sql`
      UPDATE players
      SET grain = ${updatedGrain}, grain_updated_at = ${nowUTC.toISOString()}
      WHERE id = ${playerId}
    `;
  }

  return NextResponse.json({
    id: player.id,
    name: player.name,
    land: player.land,
    grain: updatedGrain,
    grain_updated_at: nowUTC.toISOString(),
  });
}

// POST: Modify land value (e.g. for purchasing)
export async function POST(request) {
  const body = await request.json();
  const { amount, playerId } = body;

  if (!playerId || typeof amount !== 'number' || !Number.isInteger(amount)) {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }

  const result = await sql`
    UPDATE players
    SET land = land + ${amount}
    WHERE id = ${playerId}
    RETURNING id, land
  `;

  if (result.length === 0) {
    return NextResponse.json({ success: false, error: 'Player not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, land: result[0].land });
}
