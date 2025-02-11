import React, { useState } from 'react';
import axios from 'axios';
import config from "../envvarsconfig";

const truncateAddress = (address) => {
  if (!address) return 'Unknown';
  return `${address.slice(0, 20)}...`;
};

const Positions = ({ positionData = {} }) => {
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState({});

  const handleAmountChange = (poolAddress, value) => {
    if (value === '') {
      setAmounts(prev => ({ ...prev, [poolAddress]: '' }));
      return;
    }

    const strValue = value.toString();
    
    if (!isNaN(parseFloat(strValue)) && 
        (strValue[0] !== '0' || strValue[1] === '.' || strValue.length === 1)) {
      setAmounts(prev => ({ ...prev, [poolAddress]: strValue }));
    }
  };

  const addLiquidity = async (poolAddress) => {
    try {
      setLoading(prev => ({ ...prev, [poolAddress]: 'add' }));
      await axios.post(config.BACKEND_URL + "/addLiq", {
        poolAddress,
        amount: parseFloat(amounts[poolAddress]) || 0,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding liquidity:", error);
    } finally {
      setLoading(prev => ({ ...prev, [poolAddress]: null }));
    }
  };

  const sellPosition = async (poolAddress) => {
    try {
      setLoading(prev => ({ ...prev, [poolAddress]: 'sell' }));
      await axios.post(config.BACKEND_URL + "/sell", { poolAddress });
      window.location.reload();
    } catch (error) {
      console.error("Error selling position:", error);
    } finally {
      setLoading(prev => ({ ...prev, [poolAddress]: null }));
    }
  };

  const claimFees = async (poolAddress) => {
    try {
      setLoading(prev => ({ ...prev, [poolAddress]: 'claim' }));
      await axios.post(config.BACKEND_URL + "/claimFees", { poolAddress });
      window.location.reload();
    } catch (error) {
      console.error("Error claiming fees:", error);
    } finally {
      setLoading(prev => ({ ...prev, [poolAddress]: null }));
    }
  };

  if (!positionData || Object.keys(positionData).length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Your Positions</h2>
        <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <p className="text-center text-zinc-400">No positions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Positions</h2>
      <div className="space-y-3">
        {Object.entries(positionData || {}).map(([key, position]) => (
          <div 
            key={position?.publicKey || key} 
            className="p-4 bg-zinc-800 rounded-lg border border-zinc-700"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-shrink-0 w-48 group relative">
                <p className="font-medium text-white">
                  {truncateAddress(position?.publicKey)}
                </p>
                <div className="invisible group-hover:visible absolute left-0 top-full mt-1 p-2 bg-black rounded text-sm text-white z-10 whitespace-nowrap">
                  {position?.publicKey || 'Unknown'}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-zinc-300">
                <span className="text-sm">
                  Fees: {position?.unclaimedFees || 0}
                </span>
                <span className="text-sm">
                  Liquidity: {position?.currentLiquidity || 0}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Amount"
                  value={amounts[position?.publicKey] || ''}
                  onChange={(e) => handleAmountChange(position?.publicKey, e.target.value)}
                  className="w-24 h-8 px-2 bg-zinc-900 border border-zinc-700 rounded text-right text-white"
                />
                <button 
                  onClick={() => addLiquidity(position?.publicKey)}
                  disabled={loading[position?.publicKey] === 'add'}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading[position?.publicKey] === 'add' ? 'Adding Liquidity...' : 'Add Liquidity'}
                </button>
                <button 
                  onClick={() => sellPosition(position?.publicKey)}
                  disabled={loading[position?.publicKey] === 'sell'}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading[position?.publicKey] === 'sell' ? 'Removing Liquidity...' : 'Remove Liquidity'}
                </button>
                <button 
                  onClick={() => claimFees(position?.publicKey)}
                  disabled={loading[position?.publicKey] === 'claim'}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading[position?.publicKey] === 'claim' ? 'Claiming Fees...' : 'Claim Fees'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Positions;