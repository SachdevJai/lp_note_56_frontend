import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

// Returns an object containing the connected wallet’s public key and the wallet connection object.
export const connectPhantomWallet = async (): Promise<{ publicKey: string; wallet: any }> => {
    if (window.solana && window.solana.isPhantom) {
      try {
        // If already connected, disconnect first to ensure a fresh connection
        if (window.solana.isConnected) {
          try {
            await window.solana.disconnect();
          } catch (disconnectError) {
          }
        }
        const response = await window.solana.connect();
        return {
          publicKey: response.publicKey.toString(),
          wallet: window.solana,
        };
      } catch (err) {
        throw new Error("Failed to connect wallet. Please try again.");
      }
    } else {
      throw new Error("Phantom Wallet not found! Please install it from https://phantom.com/");
    }
  };


export const getWalletBalance = async (publicKey: string): Promise<number> => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const balanceLamports = await connection.getBalance(new PublicKey(publicKey));
    return balanceLamports / 1e9; 
  };
  
  // Stub for future implementation: signing a transaction.
  export const signTransaction = async (transaction: any): Promise<any> => {
    if (window.solana && window.solana.isPhantom) {
      return await window.solana.signTransaction(transaction);
    }
    throw new Error("Phantom Wallet not found!");
  };
  