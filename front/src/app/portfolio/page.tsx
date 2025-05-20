"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWalletStore } from "@/store/wallet-store";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Edit2,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface UserData {
  id: string;
  username: string;
  wallet_address: string;
  created_at: string;
}

interface Transaction {
  id: string;
  idea_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  rate: number;
  total_value: number;
  status: string;
  created_at: string;
  idea_title?: string;
}

interface Holding {
  idea_id: string;
  idea_title: string;
  total_amount: number;
  average_price: number;
  current_price: number;
  total_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
}

async function fetchUserData(walletAddress: string) {
  const response = await fetch(`http://localhost:8080/users/${walletAddress}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch user data");
  return response.json();
}

async function fetchUserTransactions(walletAddress: string) {
  const response = await fetch(
    `http://localhost:8080/users/${walletAddress}/transactions`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
}

async function updateUsername(walletAddress: string, newUsername: string) {
  const response = await fetch(`http://localhost:8080/users/${walletAddress}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username: newUsername }),
  });
  if (!response.ok) throw new Error("Failed to update username");
  return response.json();
}

export default function PortfolioPage() {
  const { address, connect } = useWalletStore();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const queryClient = useQueryClient();

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", address],
    queryFn: () => fetchUserData(address!),
    enabled: !!address,
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", address],
    queryFn: () => fetchUserTransactions(address!),
    enabled: !!address,
  });

  const updateUsernameMutation = useMutation({
    mutationFn: () => updateUsername(address!, newUsername),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", address] });
      setIsEditingUsername(false);
      toast.success("Username updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (!address) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px] p-6">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-500 mb-6">
              Please connect your wallet to view your portfolio
            </p>
            <Button className="w-full" onClick={() => connect("solana")}>
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingUser || isLoadingTransactions) {
    return <PortfolioSkeleton />;
  }

  const holdings = calculateHoldings(transactions || [], address!);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* User Profile Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  {isEditingUsername ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-[200px]"
                        placeholder="Enter new username"
                      />
                      <Button
                        size="sm"
                        onClick={() => updateUsernameMutation.mutate()}
                        disabled={updateUsernameMutation.isPending}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingUsername(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">
                        {userData?.username}
                      </h1>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setNewUsername(userData?.username || "");
                          setIsEditingUsername(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Member since</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Value</p>
                  <h3 className="text-2xl font-bold mt-1">
                    $
                    {holdings
                      .reduce((sum, h) => sum + h.total_value, 0)
                      .toFixed(2)}
                  </h3>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Profit/Loss</p>
                  <h3 className="text-2xl font-bold mt-1">
                    $
                    {holdings
                      .reduce((sum, h) => sum + h.profit_loss, 0)
                      .toFixed(2)}
                  </h3>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Holdings</p>
                  <h3 className="text-2xl font-bold mt-1">{holdings.length}</h3>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings and Transactions Tabs */}
        <Tabs defaultValue="holdings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.map((holding) => (
                    <motion.div
                      key={holding.idea_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div>
                        <h4 className="font-medium">{holding.idea_title}</h4>
                        <p className="text-sm text-gray-500">
                          {holding.total_amount} shares @ $
                          {holding.average_price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${holding.total_value.toFixed(2)}
                        </p>
                        <p
                          className={`text-sm ${
                            holding.profit_loss >= 0
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          {holding.profit_loss >= 0 ? "+" : ""}
                          {holding.profit_loss_percentage.toFixed(2)}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions?.map((tx: Transaction) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div>
                        <h4 className="font-medium">{tx.idea_title}</h4>
                        <p className="text-sm text-gray-500">
                          {tx.buyer_id === address ? "Bought" : "Sold"}{" "}
                          {tx.amount} shares @ ${tx.rate.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(tx.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${tx.total_value.toFixed(2)}
                        </p>
                        <p
                          className={`text-sm flex items-center gap-1 ${
                            tx.buyer_id === address
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          {tx.buyer_id === address ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {tx.buyer_id === address ? "Buy" : "Sell"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-24" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <Skeleton className="h-96" />
      </Card>
    </div>
  );
}

function calculateHoldings(
  transactions: Transaction[],
  userAddress: string
): Holding[] {
  const holdingsMap = new Map<string, Holding>();

  transactions.forEach((tx) => {
    if (!holdingsMap.has(tx.idea_id)) {
      holdingsMap.set(tx.idea_id, {
        idea_id: tx.idea_id,
        idea_title: tx.idea_title || "Unknown Idea",
        total_amount: 0,
        average_price: 0,
        current_price: tx.rate,
        total_value: 0,
        profit_loss: 0,
        profit_loss_percentage: 0,
      });
    }

    const holding = holdingsMap.get(tx.idea_id)!;
    if (tx.buyer_id === tx.seller_id) {
      return;
    }

    if (tx.buyer_id === userAddress) {
      // Buying
      const newTotal = holding.total_amount + tx.amount;
      const newCost = holding.total_value + tx.total_value;
      holding.total_amount = newTotal;
      holding.average_price = newCost / newTotal;
      holding.total_value = newTotal * holding.current_price;
    } else {
      // Selling
      holding.total_amount -= tx.amount;
      holding.total_value = holding.total_amount * holding.current_price;
    }

    holding.profit_loss =
      holding.total_value - holding.total_amount * holding.average_price;
    holding.profit_loss_percentage =
      ((holding.current_price - holding.average_price) /
        holding.average_price) *
      100;
  });

  return Array.from(holdingsMap.values()).filter((h) => h.total_amount > 0);
}
