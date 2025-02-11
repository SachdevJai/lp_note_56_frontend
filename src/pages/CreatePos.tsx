import React, { useState } from "react";
import axios from 'axios';
import config from '../envvarsconfig';

interface PoolData {
  name: string;
  pools: Array<any>;
  total_tvl: number;
  total_volume_24h: number;
  last_updated: string;
}

interface LiquidityPoolsProps {
  data: PoolData[];
}

const truncateAddress = (address: string) => {
  if (!address) return 'Unknown';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const CreatePos: React.FC<LiquidityPoolsProps> = ({ data }) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const createPos = async (address: string) => {
    try {
      setLoading(prev => ({ ...prev, [address]: true }));
      await axios.post(config.BACKEND_URL + '/buy', {
        poolAddress: address
      });
      alert(`Created Position for pool ${address}`);
    } catch (error) {
      console.error("Error creating position:", error);
      alert(`Error creating position in pool ${address}`);
    } finally {
      setLoading(prev => ({ ...prev, [address]: false }));
    }
  };

  const toggleExpansion = (poolName: string) => {
    setExpanded(prev => ({ ...prev, [poolName]: !prev[poolName] }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-6 text-white">Liquidity Pools</h2>
      
      <div className="space-y-6">
        {data.map((poolData) => (
          <div 
            key={poolData.name} 
            className="p-4 bg-zinc-800 rounded-lg border border-zinc-700"
          >
            <h3 className="text-lg font-medium text-white mb-4 flex justify-between items-center">
              {poolData.name}
              <button
                onClick={() => toggleExpansion(poolData.name)}
                className="text-blue-400 hover:text-blue-500"
              >
                {expanded[poolData.name] ? "Hide Positions" : "Show Positions"}
              </button>
            </h3>
            
            <div className="mb-4 flex flex-wrap gap-6 text-zinc-300">
              <span className="text-sm">
                Total Volume: ${poolData.total_volume_24h.toLocaleString()}
              </span>
              <span className="text-sm">
                Total TVL: ${poolData.total_tvl.toLocaleString()}
              </span>
            </div>

            {expanded[poolData.name] && (
              <div className="space-y-3">
                {poolData.pools.map((pool, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-zinc-900 rounded border border-zinc-700"
                  >
                    <div className="group relative">
                      <span className="text-white font-mono">
                        {truncateAddress(pool.address)}
                      </span>
                      <div className="invisible group-hover:visible absolute left-0 top-full mt-1 p-2 bg-black rounded text-sm text-white z-10 whitespace-nowrap">
                        {pool.address}
                      </div>
                    </div>

                    <button
                      onClick={() => createPos(pool.address)}
                      disabled={loading[pool.address]}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading[pool.address] ? 'Creating...' : 'Create Position'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePos;
