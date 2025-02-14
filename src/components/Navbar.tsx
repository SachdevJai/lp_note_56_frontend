import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Connection, PublicKey } from "@solana/web3.js";
import config from "../envvarsconfig";


const Navbar = () => {
  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = async (publicKey: string) => {
    try {
      const connection = new Connection(config.RPC_URL, "confirmed");
      const balanceLamports = await connection.getBalance(new PublicKey(publicKey));
      setBalance(balanceLamports / 1e9); // Convert lamports to SOL
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance(config.WALLET_ADDRESS);
  }, []);

  return (
    <nav className="bg-zinc-900 p-4 shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-green-500 text-lg">Home</Link>
          <Link to="/positions" className="text-white hover:text-green-500 text-lg">Positions</Link>
          <Link to="/create" className="text-white hover:text-green-500 text-lg">Create Positions</Link>
        </div>

        {/* Display known wallet data */}
        <div className="text-white text-sm flex flex-col items-end space-y-3">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <p className="text-lg text-white">
              Address: <span className="hover:text-gray-300">{config.WALLET_ADDRESS}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-lg text-green-400">Balance: {balance} SOL</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
