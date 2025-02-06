import React, { useState } from "react";
import "./App.css";
import LiquidityPools from "./components/LiquidityPools";
import PoolData from "./data/pools.json";
import ConnectWallet from "./components/ConnectWallet";
import { getWalletBalance } from "./utils/wallet";

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const handleConnect = async (publicKey: string) => {
    setWalletAddress(publicKey);
    try {
      const balance = await getWalletBalance(publicKey);
      setWalletBalance(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const allPools = PoolData.pairs.flatMap((pair) => pair.pools);

  return (
    <div className="App">
      {walletAddress ? (
        <>
          <div className="balanceDisplay">
            Available Balance:{" "}
            {walletBalance !== null ? walletBalance.toFixed(2) : "--"} SOL
          </div>
          <LiquidityPools data={allPools} />
        </>
      ) : (
        <ConnectWallet onConnect={handleConnect} />
      )}
    </div>
  );
}

export default App;
