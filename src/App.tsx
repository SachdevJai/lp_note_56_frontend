import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "./envvarsconfig"; // You may not need this for config.BACKEND_URL anymore
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import Navbar from "./components/Navbar";
import CreatePos from "./pages/CreatePos";
import Positions from "./pages/Positions";


const wallets = [new PhantomWalletAdapter()];

function App() {
  const [allPools, setAllPools] = useState([]);
  const [allPos, setAllPos] = useState({});

  // Fetch data from the backend via the proxy
  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/getPairs`);
        setAllPools(response.data.pairs);
      } catch (error) {
        console.error("Error fetching pools:", error);
      }
    };

    const fetchPositions = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/getPos`);
        setAllPos(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPools();
    fetchPositions();

    const intervalId = setInterval(fetchPositions, 100_000); // 300,000ms = 5 minutes

    return () => clearInterval(intervalId);
  
  }, []);

  // Fetch wallet balance when connected
  // useEffect(() => {
  //   const { publicKey, connected } = window.solana || {};
  //   if (connected && publicKey) {
  //     const getBalance = async () => {
  //       try {
  //         const connection = new Connection(config.RPC_URL, "confirmed");
  //         const balance = await connection.getBalance(publicKey);
  //         setBalance(balance / 1e9); // Convert lamports to SOL
  //       } catch (error) {
  //         console.error("Error fetching balance:", error);
  //       }
  //     };
  //     getBalance();
  //   }
  // }, [window.solana]);

  return (
    <ConnectionProvider endpoint={config.RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <BrowserRouter>
          <Navbar />
          <div className="pt-[80px]">
            <Routes>
              <Route path="/create" element={<CreatePos data={allPools} />} />
              <Route path="/positions" element={<Positions positionData={allPos} />} />
            </Routes>
          </div>
        </BrowserRouter>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
