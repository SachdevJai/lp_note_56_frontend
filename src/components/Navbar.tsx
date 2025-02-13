import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Connection, PublicKey } from "@solana/web3.js";
import config from "../envvarsconfig";

declare global {
  interface Window {
    solana?: any;
  }
}

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = async (publicKey: string) => {
    try {
      const connection = new Connection(config.RPC_URL, "confirmed");
      const balanceLamports = await connection.getBalance(new PublicKey(publicKey));
      setBalance(balanceLamports / 1e9); // Convert lamports to SOL (1 SOL = 1e9 lamports)
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Check if wallet is already connected
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      window.solana.connect({ onlyIfTrusted: true }).then(
        (response: any) => {
          setWalletAddress(response.publicKey.toString());
          setConnected(true);
          fetchBalance(response.publicKey.toString());
        },
        (err: any) => {
          console.log("Error connecting wallet:", err);
        }
      );
    }
  }, []);

  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
        setConnected(true);
        fetchBalance(response.publicKey.toString());
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install Phantom wallet!");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setConnected(false);
    setBalance(0); // Reset balance when disconnected
  };

  // Function to shorten the wallet address
  const shortenAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-zinc-900 p-4 shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex space-x-6">
            <Link to="/" className="text-white hover:text-green-500 text-lg">Home</Link>
            <Link to="/positions" className="text-white hover:text-green-500 text-lg">Positions</Link>
            <Link to="/create" className="text-white hover:text-green-500 text-lg">Create Positions</Link>
          </div>
        </div>

        {connected ? (
          <div className="text-white text-sm flex flex-col items-end space-y-3">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <p className="text-lg text-white">Address: <span className="hover:text-gray-300">{shortenAddress(walletAddress)}</span></p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-lg text-green-400">Balance: {balance} SOL</p>
            </div>
            <button
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none transition-colors mt-2"
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
            onClick={connectWallet}
          >
            Connect Phantom Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
