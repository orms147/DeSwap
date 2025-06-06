import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Droplets, Loader2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

type LiquidityPoolProps = {
  addLiquidity: (tokenA: string, tokenB: string, amountA: string, amountB: string) => Promise<void>;
  createPair: (tokenA: string, tokenB: string) => Promise<void>;
  loading: boolean;
};

const LiquidityPool: React.FC<LiquidityPoolProps> = ({ addLiquidity, createPair, loading }) => {
  const [liquidityData, setLiquidityData] = useState({
    tokenA: '',
    tokenB: '',
    amountA: '',
    amountB: '',
  });

  const handleCreatePair = async () => {
    if (!liquidityData.tokenA || !liquidityData.tokenB) return;
    await createPair(liquidityData.tokenA, liquidityData.tokenB);
  };

  const handleAddLiquidity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!liquidityData.tokenA || !liquidityData.tokenB || !liquidityData.amountA || !liquidityData.amountB) return;
    
    await addLiquidity(
      liquidityData.tokenA,
      liquidityData.tokenB,
      liquidityData.amountA,
      liquidityData.amountB
    );
    
    setLiquidityData({ tokenA: '', tokenB: '', amountA: '', amountB: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 glow-text">
            <Droplets className="w-6 h-6" />
            Liquidity Pool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tokenA_address">Token A Address</Label>
                <Input
                  id="tokenA_address"
                  placeholder="0x..."
                  value={liquidityData.tokenA}
                  onChange={(e) => setLiquidityData({ ...liquidityData, tokenA: e.target.value })}
                  className="glass-effect border-blue-500/20 focus:border-blue-500/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tokenB_address">Token B Address</Label>
                <Input
                  id="tokenB_address"
                  placeholder="0x..."
                  value={liquidityData.tokenB}
                  onChange={(e) => setLiquidityData({ ...liquidityData, tokenB: e.target.value })}
                  className="glass-effect border-blue-500/20 focus:border-blue-500/50"
                />
              </div>

              <Button
                onClick={handleCreatePair}
                disabled={loading || !liquidityData.tokenA || !liquidityData.tokenB}
                variant="outline"
                className="w-full border-purple-500/20 hover:bg-purple-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Pair...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Pair
                  </>
                )}
              </Button>
            </div>

            <div className="border-t border-border pt-6">
              <form onSubmit={handleAddLiquidity} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amountA">Amount A</Label>
                  <Input
                    id="amountA"
                    type="number"
                    placeholder="0.0"
                    value={liquidityData.amountA}
                    onChange={(e) => setLiquidityData({ ...liquidityData, amountA: e.target.value })}
                    className="glass-effect border-blue-500/20 focus:border-blue-500/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amountB">Amount B</Label>
                  <Input
                    id="amountB"
                    type="number"
                    placeholder="0.0"
                    value={liquidityData.amountB}
                    onChange={(e) => setLiquidityData({ ...liquidityData, amountB: e.target.value })}
                    className="glass-effect border-blue-500/20 focus:border-blue-500/50"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={loading || !liquidityData.tokenA || !liquidityData.tokenB || !liquidityData.amountA || !liquidityData.amountB}
                  className="w-full crypto-gradient hover:scale-105 transition-transform"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Liquidity...
                    </>
                  ) : (
                    'Add Liquidity'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LiquidityPool;