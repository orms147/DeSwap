
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Coins, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type TokenFactoryProps = {
  createToken: (name: string, symbol: string, totalSupply: string) => Promise<void>;
  loading: boolean;
};

const TokenFactory: React.FC<TokenFactoryProps> = ({ createToken, loading }) => {
  const [tokenData, setTokenData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tokenData.name || !tokenData.symbol || !tokenData.totalSupply) return;
    
    await createToken(tokenData.name, tokenData.symbol, tokenData.totalSupply);
    setTokenData({ name: '', symbol: '', totalSupply: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 glow-text">
            <Coins className="w-6 h-6" />
            Token Factory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                placeholder="e.g., My Awesome Token"
                value={tokenData.name}
                onChange={(e) => setTokenData({ ...tokenData, name: e.target.value })}
                className="glass-effect border-blue-500/20 focus:border-blue-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symbol">Token Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., MAT"
                value={tokenData.symbol}
                onChange={(e) => setTokenData({ ...tokenData, symbol: e.target.value.toUpperCase() })}
                className="glass-effect border-blue-500/20 focus:border-blue-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supply">Total Supply</Label>
              <Input
                id="supply"
                type="number"
                placeholder="e.g., 1000000"
                value={tokenData.totalSupply}
                onChange={(e) => setTokenData({ ...tokenData, totalSupply: e.target.value })}
                className="glass-effect border-blue-500/20 focus:border-blue-500/50"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading || !tokenData.name || !tokenData.symbol || !tokenData.totalSupply}
              className="w-full crypto-gradient hover:scale-105 transition-transform"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Token...
                </>
              ) : (
                'Create Token'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TokenFactory;
