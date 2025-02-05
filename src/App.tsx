import './App.css';
import LiquidityPools from './components/LiquidityPools';
import PoolData from './data/pools.json';
import ConnectWallet from './components/ConnectWallet';

function App() {

  const allPools = PoolData.pairs.flatMap(pair => pair.pools);

  return (
    <>
      <LiquidityPools data={allPools} />
    </>
  )
}

export default App
