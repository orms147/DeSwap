import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/toaster';
import { useWeb3 } from './hooks/useWeb3';
import { useContracts } from './hooks/useContracts';
import WalletConnect from './components/WalletConnect';
import TokenFactory from './components/TokenFactory';
import SwapInterface from './components/SwapInterface';
import LiquidityPool from './components/LiquidityPool';
import TradingStats from './components/TradingStats';
import { motion } from 'framer-motion';
import { Zap, Coins, TrendingUp, Droplets, List } from 'lucide-react';

function App() {
  const { provider, signer, account, isConnected, connectWallet, disconnectWallet } = useWeb3();
  const { 
    loading,
    createToken, 
    createPair, 
    addLiquidity, 
    swapTokens, 
    getAmountsOut, 
    getAllPairs,
    getPairDetails 
  } = useContracts(signer);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center neon-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold glow-text">CryptoDEX</h1>
              <p className="text-muted-foreground">Decentralized Exchange Platform</p>
            </div>
          </div>
          <WalletConnect
            account={account}
            isConnected={isConnected}
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
          />
        </motion.header>

        <Tabs defaultValue="swap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 glass-effect">
            <TabsTrigger value="swap" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Swap
            </TabsTrigger>
            <TabsTrigger value="liquidity" className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Liquidity
            </TabsTrigger>
            <TabsTrigger value="factory" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Factory
            </TabsTrigger>
            <TabsTrigger value="pairs" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Pairs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="swap">
            <SwapInterface
              swapTokens={swapTokens}
              getAmountsOut={getAmountsOut}
              loading={loading}
              account={account}
            />
          </TabsContent>

          <TabsContent value="liquidity">
            <LiquidityPool
              addLiquidity={addLiquidity}
              createPair={createPair}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="factory">
            <TokenFactory
              createToken={createToken}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="pairs">
            <TradingStats 
              getAllPairs={getAllPairs} 
              getPairDetails={getPairDetails}
              loading={loading}
              signer={signer}
            />
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
           <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="trading-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 glow-text">Connection Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Wallet</span>
                  <div className={`flex items-center gap-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isConnected ? 'pulse-animation' : ''}`}></div>
                    <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                </div>
                {isConnected && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="text-sm font-mono">
                      {account?.slice(0, 6)}...{account?.slice(-4)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="trading-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 glow-text">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg crypto-gradient flex items-center justify-center">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Token Factory</p>
                    <p className="text-xs text-muted-foreground">Create custom tokens</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg crypto-gradient flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Token Swapping</p>
                    <p className="text-xs text-muted-foreground">Exchange tokens instantly</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg crypto-gradient flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Liquidity Pools</p>
                    <p className="text-xs text-muted-foreground">Provide liquidity & earn</p>
                  </div>
                </div>
              </div>
            </motion.div>
        </div>


        <div className="fixed top-20 left-10 w-20 h-20 rounded-full gradient-bg opacity-20 floating"></div>
        <div className="fixed bottom-20 right-10 w-16 h-16 rounded-full crypto-gradient opacity-20 floating" style={{ animationDelay: '1s' }}></div>
        <div className="fixed top-1/2 right-20 w-12 h-12 rounded-full gradient-bg opacity-20 floating" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;