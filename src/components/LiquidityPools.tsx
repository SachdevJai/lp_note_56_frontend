import React, { useState } from "react";
import styles from "../styles/LiquidityPools.module.css";

interface PoolData {
  address: string;
  symbol_x: string;
  symbol_y: string;
  volume_24h: number;
  tvl: number;
}

interface LiquidityPoolsProps {
  data: PoolData[];
}

const LiquidityPools: React.FC<LiquidityPoolsProps> = ({ data }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [amounts, setAmounts] = useState<Record<string, number>>({});

  const groupedPools = data.reduce<Record<string, PoolData[]>>((acc, pool) => {
    const pairKey = [pool.symbol_x, pool.symbol_y].sort().join(" - ");
    (acc[pairKey] ||= []).push(pool);
    return acc;
  }, {});

  const toggleExpand = (pair: string) => {
    setExpanded((prev) => ({ ...prev, [pair]: !prev[pair] }));
  };

  const handleAmountChange = (address: string, value: number) => {
    setAmounts((prev) => ({ ...prev, [address]: value }));
  };

  const handleBuy = (address: string) => {
    const amount = amounts[address];
    if (amount > 0) {
      alert(`Buying ${amount} from pool ${address}`);
      // Implement your buy logic here
    }
  };

  return (
    <div className={styles.container}>
      <h2>Liquidity Pools</h2>
      {Object.entries(groupedPools).map(([pair, pools]) => (
        <div key={pair} className={styles.pairSection}>
          <button className={styles.expandButton} onClick={() => toggleExpand(pair)}>
            {expanded[pair] ? "▼" : "▶"} {pair}
          </button>
          {expanded[pair] && (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Volume</span>
                {/* <span>&nbsp;&nbsp;</span> */}
                <span>TVL</span>
                <span>Amount</span>
                <span>Action</span>
              </div>
              {pools.map((pool) => (
                <div key={pool.address} className={styles.tableRow}>
                  <span>${pool.volume_24h.toLocaleString()}</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span>${pool.tvl.toLocaleString()}</span>
                  <input
                    type="number"
                    min="1"
                    value={amounts[pool.address] || 0}
                    onChange={(e) => handleAmountChange(pool.address, +e.target.value)}
                    className={styles.amountInput}
                  />
                  <button
                    onClick={() => handleBuy(pool.address)}
                    className={styles.buyButton}
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LiquidityPools;
