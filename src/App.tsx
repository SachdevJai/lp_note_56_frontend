import { useState } from "react";
import "./App.css";
import LiquidityPools from "./components/LiquidityPools";
import PoolData from "./data/pools.json";
import ConnectWallet from "./components/ConnectWallet";

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const allPools = PoolData.pairs.flatMap((pair) => pair.pools);

  return (
    <div className="App">
      {walletAddress ? (
        <LiquidityPools data={allPools} />
      ) : (
        <ConnectWallet onConnect={(pubKey) => setWalletAddress(pubKey)} />
      )}
    </div>
  );
}

export default App;
