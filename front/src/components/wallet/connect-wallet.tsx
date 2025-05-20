import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/store/wallet-store";
import { Wallet } from "lucide-react";
import { useState } from "react";

export function ConnectWallet() {
  const { address, isConnected, connect, disconnect } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      // Check if Phantom wallet is installed
      const { solana } = window as any;

      if (!solana?.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        return;
      }

      // Connect to Phantom wallet
      const response = await solana.connect();
      connect(response.publicKey.toString());
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      const { solana } = window as any;
      await solana.disconnect();
      disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format wallet address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Button
        variant="outline"
        onClick={handleDisconnect}
        disabled={isLoading}
        className="gap-2"
      >
        <Wallet className="h-4 w-4" />
        {formatAddress(address)}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading} className="gap-2">
      <Wallet className="h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
