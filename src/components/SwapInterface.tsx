
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, TrendingUp, ArrowDownUp } from 'lucide-react';
import { motion } from 'framer-motion';

type SwapInterfaceProps = {
  swapTokens: (
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    minOutput: string,
    account: string
  ) => Promise<void>;
  getAmountsOut: (amountIn: string, path: string[]) => Promise<string[]>;
  loading: boolean;
  account: string | null;
};

const SwapInterface = ({
  swapTokens,
  getAmountsOut,
  loading,
  account,
}: SwapInterfaceProps) => {
  const [swapData, setSwapData] = useState({
    tokenIn: '',
    tokenOut: '',
    amountIn: '',
    amountOutMin: '',
    slippage: '0.3',
  });
  const [estimatedOutput, setEstimatedOutput] = useState('');

  useEffect(() => {
    const calculateOutput = async () => {
      if (swapData.amountIn && swapData.tokenIn && swapData.tokenOut && getAmountsOut) {
        try {
          const path = [swapData.tokenIn, swapData.tokenOut];
          const amounts = await getAmountsOut(swapData.amountIn, path);
          if (amounts && amounts.length > 1) {
            setEstimatedOutput(amounts[1].toString());
          }
        } catch (error) {
          console.error('Error calculating output:', error);
        }
      }
    };

    const debounceTimer = setTimeout(calculateOutput, 500);
    return () => clearTimeout(debounceTimer);
  }, [swapData.amountIn, swapData.tokenIn, swapData.tokenOut, getAmountsOut]);

  const handleSwap = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!swapData.tokenIn || !swapData.tokenOut || !swapData.amountIn || !account) return;
    
    const slippageMultiplier = (100 - parseFloat(swapData.slippage)) / 100;
    const minOutput = estimatedOutput ? (parseFloat(estimatedOutput) * slippageMultiplier).toString() : '0';
    
    await swapTokens(
      swapData.tokenIn,
      swapData.tokenOut,
      swapData.amountIn,
      minOutput,
      account
    );
  };

  const swapTokenPositions = () => {
    setSwapData({
      ...swapData,
      tokenIn: swapData.tokenOut,
      tokenOut: swapData.tokenIn,
      amountIn: '',
    });
    setEstimatedOutput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 glow-text">
            <TrendingUp className="w-6 h-6" />
            Swap Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSwap} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tokenIn">From Token Address</Label>
              <Input
                id="tokenIn"
                placeholder="0x..."
                value={swapData.tokenIn}
                onChange={(e) => setSwapData({ ...swapData, tokenIn: e.target.value })}
                className="glass-effect border-blue-500/20 focus:border-blue-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amountIn">Amount</Label>
              <Input
                id="amountIn"
                type="number"
                placeholder="0.0"
                value={swapData.amountIn}
                onChange={(e) => setSwapData({ ...swapData, amountIn: e.target.value })}
                className="glass-effect border-blue-500/20 focus:border-blue-500/50"
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                onClick={swapTokenPositions}
                variant="outline"
                size="icon"
                className="rounded-full border-purple-500/20 hover:bg-purple-500/10 hover:scale-110 transition-all"
              >
                <ArrowDownUp className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tokenOut">To Token Address</Label>
              <Input
                id="tokenOut"
                placeholder="0x..."
                value={swapData.tokenOut}
                onChange={(e) => setSwapData({ ...swapData, tokenOut: e.target.value })}
                className="glass-effect border-blue-500/20 focus:border-blue-500/50"
              />
            </div>

            {estimatedOutput && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-md glass-effect border border-green-500/20"
              >
                <div className="text-sm text-muted-foreground">Estimated Output</div>
                <div className="text-lg font-semibold text-green-400">{estimatedOutput}</div>
              </motion.div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
              <Input
                id="slippage"
                type="number"
                step="0.1"
                value={swapData.slippage}
                onChange={(e) => setSwapData({ ...swapData, slippage: e.target.value })}
                className="glass-effect border-blue-500/20 focus:border-blue-500/50"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading || !swapData.tokenIn || !swapData.tokenOut || !swapData.amountIn || !account}
              className="w-full crypto-gradient hover:scale-105 transition-transform"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Swapping...
                </>
              ) : (
                'Swap Tokens'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SwapInterface;