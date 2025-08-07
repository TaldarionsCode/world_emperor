'use client';

import { useEffect, useRef, useState } from 'react';
import {PlayerInfo} from 'components/player-info';

export default function LandPage() {
  const [landAmount, setLandAmount] = useState(1);
  const [buying, setBuying] = useState(false);
  const [status, setStatus] = useState(null);

  // Example: 10 grain per hectare
  const grainCostPerHa = 10;
  const totalCost = landAmount * grainCostPerHa;

  const handleBuy = async () => {
    if (landAmount < 1) return;

    setBuying(true);
    setStatus(null);

    try {
      const res = await fetch('/api/player_land', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: landAmount, playerId: '1' }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('Successfully bought land.');
      } else {
        setStatus('Error: ' + (data.error || 'Unknown'));
      }
    } catch (err) {
      setStatus('Network error while purchasing land.');
    } finally {
      setBuying(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Buy Land</h1>

      <PlayerInfo playerId="1" />

      <div className="space-y-4">
        <label className="block">
          <span className="text-lg font-semibold">How much land do you want to buy?</span>
          <input
            type="number"
            min={1}
            value={landAmount}
            onChange={(e) => setLandAmount(parseInt(e.target.value) || 1)}
            className="mt-2 block w-full p-2 border border-gray-300 rounded"
          />
        </label>

        <button
          onClick={handleBuy}
          disabled={buying}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {buying ? 'Processing...' : `Buy for ${totalCost} grain`}
        </button>

        {status && <p className="text-sm text-gray-700">{status}</p>}
      </div>
    </main>
  );
}
