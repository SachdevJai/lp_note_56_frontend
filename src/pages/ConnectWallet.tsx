import React, { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { connectPhantomWallet } from "../utils/wallet";

declare global {
  interface Window {
    solana?: any;
  }
}

interface ConnectWalletProps {
  onConnect: (publicKey: string) => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);

  const checkIfWalletIsConnected = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect({ onlyIfTrusted: true });
        const publicKey = response.publicKey.toString();
        setWalletAddress(publicKey);
        onConnect(publicKey);
      } catch (err) {}
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    setHasAttempted(true);
    setErrorMessage(null);

    try {
      const { publicKey } = await connectPhantomWallet();
      setWalletAddress(publicKey);
      onConnect(publicKey);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      {hasAttempted && errorMessage && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4">
          <div className="flex justify-between items-center">
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
          <div className="flex items-center mb-6">
            <Wallet className="text-white w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold text-white">Connect Your Wallet</h2>
          </div>
          <p className="text-gray-300 mb-6">Connect your Phantom wallet to get started</p>

          {walletAddress ? (
            <div>
              <p className="text-white">Connected Wallet:</p>
              <p className="text-gray-300">{walletAddress}</p>
            </div>
          ) : (
            <div>
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
                onClick={connectWallet}
              >
                <Wallet className="inline-block mr-2" />
                Connect Phantom Wallet
              </button>
              <p className="text-gray-400 mt-4 text-sm">
                Don't have Phantom?{" "}
                <a
                  href="https://phantom.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
                >
                  Install Wallet
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConnectWallet;
