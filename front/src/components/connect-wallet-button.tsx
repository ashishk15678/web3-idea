"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/store/wallet-store";
import { API_ADDRESS } from "@/api";

export function ConnectWalletButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
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
      const response = await solana.connect();
      connect(response.publicKey.toString());

      try {
        // First try to get the user
        const userResponse = await fetch(
          `http://localhost:8080/user/${response.publicKey.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        // If user doesn't exist (404), create a new one
        if (userResponse.status === 404) {
          const createResponse = await fetch(`http://localhost:8080/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              wallet_address: response.publicKey.toString(),
              username: `user_${response.publicKey.toString().slice(0, 8)}`,
            }),
          });

          if (!createResponse.ok) {
            const error = await createResponse.text();
            throw new Error(`Failed to create user: ${error}`);
          }

          const newUser = await createResponse.json();
          console.log("Created new user:", newUser);
        } else if (!userResponse.ok) {
          throw new Error(`Failed to get user: ${await userResponse.text()}`);
        } else {
          const user = await userResponse.json();
          console.log("Found existing user:", user);
        }
      } catch (error) {
        console.error("Error handling user:", error);
        // Don't throw here, just log the error
      }

      // Connect to Phantom wallet
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
        className={className}
        {...props}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {formatAddress(address)}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className={className}
      {...props}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
