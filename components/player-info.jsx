'use client';

import { useEffect, useState } from 'react';

export function PlayerInfo({ playerId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlayerInfo = async () => {
    if (!playerId) return;

    try {
      const res = await fetch(`/api/player/land?playerId=${playerId}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('❌ Failed to fetch player info', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial + lazy-load refresh
  useEffect(() => {
    fetchPlayerInfo();

    // Auto-refresh every 3 minutes (180000 ms)
    const interval = setInterval(fetchPlayerInfo, 180000);

    return () => clearInterval(interval);
  }, [playerId]);

  if (loading || !data) return <p>Loading player info...</p>;

  return (
    <div className="p-4 rounded-xl">
      <p className="text-lg font-semibold mb-2">Player Info</p>
      <p>👤 <strong>{data.name}</strong></p>
      <p>🌾 Grain: <strong>{data.grain}</strong></p>
      <p>🌱 Land: <strong>{data.land} ha</strong></p>
    </div>
  );
}
