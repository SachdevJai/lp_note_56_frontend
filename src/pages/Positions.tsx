import React, { useState } from "react";
import styles from "../styles/LiquidityPools.module.css";
import axios from 'axios';
import config from '../envvarsconfig';

const Positions: React.FC<{ positionData: {} }> = ({ positionData }) => {
  // State to hold the amount for each position
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});

  // Function to handle amount change
  const handleAmountChange = (positionKey: string, value: number) => {
    setAmounts((prev) => ({ ...prev, [positionKey]: value }));
  };

  // Function to add liquidity
  const addLiquidity = async (positionKey: string, poolAddress: string) => {
    // Logic to add liquidity to the position
    try {
        await axios.post(config.BACKEND_URL+'/addLiq', {
            "poolAddress": poolAddress,
            "amount": amounts[positionKey] || 0 // Use the amount from state
        });
        console.log(`Adding liquidity to position: ${positionKey}`);
        window.location.reload(); // Refresh the page after successful response
    } catch (error) {
        console.error("Error adding liquidity:", error);
    }
  };

  // Function to sell position
  const sellPosition = async (positionKey: string, poolAddress: string) => {
    // Logic to sell the position
    try {
        await axios.post(config.BACKEND_URL+'/sell', {
            "poolAddress": poolAddress
        });
        console.log(`Selling position: ${positionKey}`);
        window.location.reload(); // Refresh the page after successful response
    } catch (error) {
        console.error("Error selling position:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Your Positions</h2>
      {Object.keys(positionData).map((key) => {
        const position = positionData[key];
        const poolAddress = position.publicKey; // Assuming publicKey is the pool address
        return (
          <div key={poolAddress} className={styles.positionSection}>
            <h3>Position: {poolAddress}</h3>
            <div>
              <p>Total X Amount: {position.lbPairPositionsData[0].positionData.totalXAmount}</p>
              <p>Total Y Amount: {position.lbPairPositionsData[0].positionData.totalYAmount}</p>
              <p>Token X Mint: {position.tokenXMint}</p>
              <p>Token Y Mint: {position.tokenYMint}</p>
              {/* Add more details as needed */}
            </div>
            <input 
              type="number" 
              placeholder="Amount" 
              value={amounts[poolAddress] || ''} 
              onChange={(e) => handleAmountChange(poolAddress, Number(e.target.value))} 
            />
            <button onClick={() => addLiquidity(poolAddress, poolAddress)} className={styles.addLiquidityButton}>
              Add Liquidity
            </button>
            <button onClick={() => sellPosition(poolAddress, poolAddress)} className={styles.sellPositionButton}>
              Sell Position
            </button>
          </div>
        );
      })}
    </div>
  );
};


export default Positions;