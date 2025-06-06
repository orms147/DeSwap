\DEX\DeSwap\src\components\WalletConnect.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface WalletConnectProps {
  account: string | null;
  isConnected: boolean | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ 
  account, 
  isConnected, 
  connectWallet, 
  disconnectWallet 
}) => {
  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        <Card className="trading-card border-green-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full pulse-animation"></div>
              <span className="text-sm font-medium text-green-400">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Button
          onClick={disconnectWallet}
          variant="outline"
          size="sm"
          className="border-red-500/20 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button
        onClick={connectWallet}
        className="gradient-bg hover:scale-105 transition-transform neon-glow"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    </motion.div>
  );
};

export default WalletConnect;