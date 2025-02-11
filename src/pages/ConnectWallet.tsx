import React, { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
// import styles from "../styles/ConnectWallet.module.css";
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
        <div className={styles.errorTop}>
          <div className={styles.alert}>{errorMessage}</div>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.walletCard}>
          <div className={styles.walletHeader}>
            <Wallet className={styles.walletIcon} />
            <h2>Connect Your Wallet</h2>
            <p>Connect your Phantom wallet to get started</p>
          </div>

          {walletAddress ? (
            <div>
              <p>Connected Wallet:</p>
              <p className={styles.walletAddress}>{walletAddress}</p>
            </div>
          ) : (
            <div>
              <button className={styles.connectButton} onClick={connectWallet}>
                <Wallet className={styles.buttonIcon} />
                Connect Phantom Wallet
              </button>
              <p className={styles.installText}>
                Don't have Phantom?{" "}
                <a
                  href="https://phantom.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.installLink}
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
