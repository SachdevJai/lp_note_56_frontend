import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from "react";
import config from './envvarsconfig';

import CreatePos from "./pages/CreatePos";
import Positions from "./pages/Positions";

function App() {
  const [allPools, setAllPools] = useState([]);
  const [allPos, setAllPos] = useState({});

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
        console.error("Error fetching pools:", error);
      }
    };

    fetchPositions();
    fetchPools();
  }, []);

  // const [walletAddress, setWalletAddress] = useState<string | null>(null);
  // const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // const handleConnect = async (publicKey: string) => {
  //   setWalletAddress(publicKey);
  //   try {
  //     const balance = await getWalletBalance(publicKey);
  //     setWalletBalance(balance);
  //   } catch (error) {
  //     console.error("Error fetching balance:", error);
  //   }
  // };



  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<ConnectWallet onConnect={(publicKey) => console.log(publicKey)} />} /> */}
        <Route path="/createPos" element={<CreatePos data={allPools} />} />
        <Route path="/pos" element={<Positions positionData = {allPos} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
