import React, { useState } from "react";
import styles from "../styles/LiquidityPools.module.css";
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

const CreatePos: React.FC<LiquidityPoolsProps> = ({ data }) => {

  console.log(data);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const groupedPools = data.reduce<Record<string, PoolData[]>>((acc, pool) => {
    const pairKey = [pool.name].sort().join(" - ");
    (acc[pairKey] ||= []).push(pool);
    return acc;
  }, {});

  const toggleExpand = (pair: string) => {
    setExpanded((prev) => ({ ...prev, [pair]: !prev[pair] }));
  };

  const createPos = async (address: string) => {
    alert(`Creating position in pool ${address}`);
    await axios.post(config.BACKEND_URL + '/buy', {
      "poolAddress": address
    })
    
    alert(`Created Position for pool ${address}`);
  };

  return (
    <div className={styles.container}>
      <h2>Liquidity Pools</h2>
      {data.map((poolData) => (
        <div key={poolData.name} className={styles.pairSection}>
          <h3>{poolData.name}</h3>
          <div className={styles.table}>
            <div className={styles.tableRow}>
              <span>Total Volume: ${poolData.total_volume_24h.toLocaleString()}</span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>Total TVL: ${poolData.total_tvl.toLocaleString()}</span>
            </div>
            {poolData.pools.map((pool, index) => (
              <div key={index} className={styles.poolRow}>
                <span>{pool.address}&nbsp;&nbsp;&nbsp;</span>
                <button onClick={() => createPos(pool.address)} className={styles.createButton}>
                  Create Position
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreatePos;
