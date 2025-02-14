import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import config from "../envvarsconfig";

const truncateAddress = (address: string) => {
  if (!address) return 'Unknown';
  return `${address.slice(0, 20)}...`;
};

interface BinData {
  binId: number;
  price: string;
  pricePerToken: string;
  binXAmount: string;
  binYAmount: string;
  binLiquidity: string;
  positionLiquidity: string;
  positionXAmount: string;
  positionYAmount: string;
}

interface PositionData {
  totalXAmount: string;
  totalYAmount: string;
  positionBinData: BinData[];
  lastUpdatedAt: string;
  lowerBinId: number;
  upperBinId: number;
  feeX: string;
  feeY: string;
  rewardOne: string;
  rewardTwo: string;
  feeOwner: string;
  totalClaimedFeeXAmount: string;
  totalClaimedFeeYAmount: string;
}

interface LBPair {
  pairType: number;
  activeId: number;
  binStep: number;
  status: number;
  tokenXMint: string;
  tokenYMint: string;
  reserveX: string;
  reserveY: string;
  oracle: string;
  creator: string;
}

interface Token {
  publicKey: string;
  reserve: string;
  amount: string;
  decimal: number;
}

interface LBPairPosition {
  publicKey: string;
  positionData: PositionData;
  version: number;
}

interface Position {
  publicKey: string;
  lbPair: LBPair;
  tokenX: Token;
  tokenY: Token;
  lbPairPositionsData: LBPairPosition[];
}

interface PositionsProps {
  positionData: Record<string, Position>;
}

const Positions: React.FC<PositionsProps> = ({ positionData = {} }) => {
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, string | null>>({});
  const [expandedPositions, setExpandedPositions] = useState<Record<string, boolean>>({});

  const handleAmountChange = (poolAddress: string, value: string) => {
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

  const addLiquidity = async (position: Position, lbPosition: LBPairPosition) => {
    try {
      setLoading(prev => ({ ...prev, [lbPosition.publicKey]: 'add' }));
      await axios.post(config.BACKEND_URL + "/addLiq", {
        poolAddress: position.publicKey,
        amount: parseFloat(amounts[lbPosition.publicKey]) || 0,
        positionPubKey: lbPosition.publicKey
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding liquidity:", error);
    } finally {
      setLoading(prev => ({ ...prev, [lbPosition.publicKey]: null }));
    }
  };

  const closePosition = async (position: Position, lbPosition: LBPairPosition) => {
    try {
      setLoading(prev => ({ ...prev, [lbPosition.publicKey]: 'sell' }));
      await axios.post(config.BACKEND_URL + "/sell", { 
        poolAddress: position.publicKey,
        positionPubKey: lbPosition.publicKey
      });
      window.location.reload();
    } catch (error) {
      console.error("Error closing position:", error);
    } finally {
      setLoading(prev => ({ ...prev, [lbPosition.publicKey]: null }));
    }
  };

  const claimFees = async (position: Position, lbPosition: LBPairPosition) => {
    try {
      setLoading(prev => ({ ...prev, [lbPosition.publicKey]: 'claim' }));
      await axios.post(config.BACKEND_URL + "/claim", { 
        poolAddress: position.publicKey,
        positionPubKey: lbPosition.publicKey,
        Positions: position.lbPairPositionsData
      });
      window.location.reload();
    } catch (error) {
      console.error("Error claiming fees:", error);
    } finally {
      setLoading(prev => ({ ...prev, [lbPosition.publicKey]: null }));
    }
  };

  const toggleExpand = (poolAddress: string) => {
    setExpandedPositions(prev => ({
      ...prev,
      [poolAddress]: !prev[poolAddress]
    }));
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
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">Your Positions</h2>
      <div className="space-y-4">
        {Object.keys(positionData).length === 0 ? (
          <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 text-center text-zinc-400">
            No positions found
          </div>
        ) : (
          Object.entries(positionData).map(([key, position]) => (
            <div key={position.publicKey || key} className="bg-zinc-800 rounded-lg border border-zinc-700 p-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{position.publicKey}</span>
                <button onClick={() => setExpandedPositions((prev) => ({ ...prev, [key]: !prev[key] }))}>
                  {expandedPositions[key] ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                </button>
              </div>
              {expandedPositions[key] && (
                <div className="mt-4 space-y-3">
                  {position.lbPairPositionsData.map((lbPosition) => (
                    <div key={lbPosition.publicKey} className="p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                      <div className="text-sm text-zinc-300 flex justify-between">
                        <span>Active Bin: {position.lbPair.activeId}</span>
                        <span>Bin Step: {position.lbPair.binStep}</span>
                        <span>Liquidity Invested: {lbPosition.positionData.positionBinData.reduce((acc, bin) => acc + (Number(bin.positionLiquidity) || 0), 0)}</span>
                        <span>Fee X: {lbPosition.positionData.feeX}</span>
                        <span>Fee Y: {lbPosition.positionData.feeY}</span>
                        <span>Reward one: {lbPosition.positionData.rewardOne}</span>
                        <span>Reward two: {lbPosition.positionData.rewardTwo}</span>
                        <span>Claimed Fee X: {lbPosition.positionData.totalClaimedFeeXAmount}</span>
                        <span>Claimed Fee Y: {lbPosition.positionData.totalClaimedFeeYAmount}</span>
                      </div>
                      <div className="mt-2 flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Amount"
                          value={amounts[lbPosition.publicKey] || ''}
                          onChange={(e) => handleAmountChange(lbPosition.publicKey, e.target.value)}
                          className="w-24 h-8 px-2 bg-zinc-900 border border-zinc-700 rounded text-right text-white"
                        />
                        <button
                          onClick={() => addLiquidity(position, lbPosition)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                          disabled={loading[lbPosition.publicKey] === 'addLiq'}
                        >
                          {loading[lbPosition.publicKey] === 'addLiq' ? 'Adding...' : 'Add'}
                        </button>
                        <button
                          onClick={() => closePosition(position, lbPosition)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          disabled={loading[lbPosition.publicKey] === 'sell'}
                        >
                          {loading[lbPosition.publicKey] === 'sell' ? 'Removing...' : 'Remove'}
                        </button>
                        <button
                          onClick={() => claimFees(position, lbPosition)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          disabled={loading[lbPosition.publicKey] === 'claim'}
                        >
                          {loading[lbPosition.publicKey] === 'claim' ? 'Claiming...' : 'Claim'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Positions;