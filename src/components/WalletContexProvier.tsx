import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { FC, ReactNode } from "react";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets"
import "@solana/wallet-adapter-react-ui/styles.css"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = clusterApiUrl("devnet")
  const wallets = [
    new walletAdapterWallets.PhantomWalletAdapter(),
    new walletAdapterWallets.SolflareWalletAdapter()
  ]
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}