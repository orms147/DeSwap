import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, RefreshCw, List } from 'lucide-react';
import { motion } from 'framer-motion';

type TradingStatsProps = {
  getAllPairs: () => Promise<string[]>;
  getPairDetails: (address: string) => Promise<any>;
  loading: boolean;
  signer: any;
};

const TradingStats: React.FC<TradingStatsProps> = ({ getAllPairs, getPairDetails, loading, signer }) => {
  const [pairs, setPairs] = useState<string[]>([]);
  const [detailedPairs, setDetailedPairs] = useState<any[]>([]);

  const fetchPairs = async () => {
    if (!getAllPairs || !signer) return;
    const fetchedPairs = await getAllPairs();
    setPairs(fetchedPairs);
    setDetailedPairs([]); 
  };

  useEffect(() => {
    if (signer) {
      fetchPairs();
    }
  }, [signer]);

  useEffect(() => {
    const fetchAllPairDetails = async () => {
      if (pairs.length > 0 && getPairDetails) {
        const detailsPromises = pairs.map(pairAddress => getPairDetails(pairAddress));
        const resolvedDetails = await Promise.all(detailsPromises);
        setDetailedPairs(resolvedDetails.filter(detail => detail !== null));
      }
    };
    if (pairs.length > 0) {
      fetchAllPairDetails();
    }
  }, [pairs, getPairDetails]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="trading-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 glow-text">
            <List className="w-6 h-6" />
            Liquidity Pairs
          </CardTitle>
          <Button onClick={fetchPairs} variant="outline" size="sm" disabled={loading || !signer} className="border-purple-500/20 hover:bg-purple-500/10">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          {loading && detailedPairs.length === 0 && (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
          )}
          {!loading && detailedPairs.length === 0 && signer && (
            <p className="text-center text-muted-foreground">No liquidity pairs found or yet to be loaded. Try refreshing.</p>
          )}
          {!signer && (
            <p className="text-center text-muted-foreground">Connect your wallet to view liquidity pairs.</p>
          )}
          {detailedPairs.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
              {detailedPairs.map((pair, index) => (
                <motion.div
                  key={pair.address || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg glass-effect border border-white/10"
                >
                  <p className="text-sm font-medium truncate">Pair Address: {pair.address}</p>
                  {pair.error ? (
                     <p className="text-xs text-red-400">Error fetching details</p>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground truncate">Token0: {pair.token0}</p>
                      <p className="text-xs text-muted-foreground truncate">Token1: {pair.token1}</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TradingStats;