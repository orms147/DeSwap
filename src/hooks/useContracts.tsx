import { ethers } from 'ethers';
import { toast } from '../components/ui/use-toast';
import { TOKEN_FACTORY_ABI, FACTORY_ABI, ROUTER_ABI } from '../contracts/contractData';
import { useEffect, useState } from 'react';

type Contracts = {
    tokenFactory: ethers.Contract;
    factory: ethers.Contract;
    router: ethers.Contract;
} | null;

export const useContracts = (signer: ethers.Signer | null) => {
    const [ contracts, setContracts ] = useState<Contracts>(null);
    const [ loading, setLoading ] = useState<boolean>(false);

    useEffect (() => {
        if (signer) {
            const tokenFactoryAddress = import.meta.env.VITE_TOKEN_FACTORY;
            if (!tokenFactoryAddress) {
                throw new Error('VITE_TOKEN_FACTORY environment variable is not defined');
            }
            const tokenFactory = new ethers.Contract(tokenFactoryAddress, TOKEN_FACTORY_ABI, signer);
            
            const factoryAddress = import.meta.env.VITE_FACTORY;
            if(!factoryAddress) {
                throw new Error('VITE_FACTORY environment variable is not defined');
            }
            console.log("Factory address:", factoryAddress);
            const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, signer);
            
            const routerAddress = import.meta.env.VITE_ROUTER;
            if(!routerAddress) {
                throw new Error('VITE_ROUTER environment variable is not defined');
            }
            const router = new ethers.Contract(routerAddress, ROUTER_ABI, signer);

            setContracts({
                tokenFactory,
                factory,
                router
            });
        }
    }, [signer]);

    const handleTransaction = async (
        contractMethod: () => Promise<any>,
        successMessage: string,
        errorMessagePrefix: string
    ) => {
        try {
            setLoading(true);
            const tx = await contractMethod();
            await tx.wait(); 
            
            toast({
                title: "Transaction Successful",
                description: successMessage,
            });
        } catch (error) {
        console.error(`${errorMessagePrefix}:`, error);
        toast({
            title: "Transaction Failed",
            description: (error instanceof Error ? error.message : String(error)) || `Failed to ${errorMessagePrefix.toLowerCase()}`,
            variant: "destructive",
        });
        } finally {
            setLoading(false);
        }
    };

    const createToken = async (name: string, symbol: string, totalSupply: string) => { 
        if (!contracts || !contracts.tokenFactory) return;
        return handleTransaction(
            () => contracts?.tokenFactory.createToken(name, symbol, ethers.parseEther(totalSupply)), 
            `${name} (${symbol}) has been created successfully`,
            "Create Token"
        )
    }

    const getAllPairs = async () => {
        if (!contracts || !contracts.factory) return [];
        try {
            setLoading(true);
            const pairCount = await contracts.factory.allPairsLength();
            const pairs = [];
            for (let i = 0; i < pairCount; i++) {
                const pairAddress = await contracts.factory.allPairs(i);
                pairs.push(pairAddress);
            }
            return pairs;
        } catch (error) {
            console.error('Error fetching pairs:', error);
            toast({
                title: "Fetch Pairs Failed",
                description: (error instanceof Error ? error.message : "Failed to fetch liquidity pairs"),
                variant: "destructive",
            });
            return [];
        } finally {
            setLoading(false);
        }
    }

    const createPair = async (tokenA: string, tokenB: string) => {
        if(!contracts || !contracts.factory) return;
        return handleTransaction(
            () => contracts?.factory.createPair(tokenA, tokenB),
            "Trading pair has been created successfully",
            "Create Pair"
        )
    }

    const getPairDetails = async (pairAddress: string) => {
        if (!signer || !pairAddress) return null;
        const pairContract = new ethers.Contract(
            pairAddress, 
            [
                'function token0() external view returns (address)', 
                'function token1() external view returns (address)'
            ], 
            signer
        );
        try {
            const token0 = await pairContract.token0();
            const token1 = await pairContract.token1();
            return { address: pairAddress, token0, token1 };
        } catch (error) {
            console.error(`Error fetching details for pair ${pairAddress}:`, error);
            return { address: pairAddress, token0: 'N/A', token1: 'N/A', error: true };
        }
    };

    const addLiquidity = async (tokenA: string, tokenB: string, amountA: string, amountB: string) => { 
        if (!contracts || !contracts.router) return;
        return handleTransaction (
            () => contracts?.router.addLiquidity(
                tokenA, 
                tokenB, 
                ethers.parseEther(amountA), 
                ethers.parseEther(amountB), 
            ),
            "Liquidity has been added to the pool",
            "Add Liquidity"
        )
    }

    const swapTokens = async (tokenIn: string, tokenOut: string, amountIn: string, amountOutMin: string, to: string) => { 
        if (!contracts || !contracts.router) return;
        return handleTransaction (
            () => contracts?.router.swapExactTokensForTokens(
                ethers.parseEther(amountIn), 
                ethers.parseEther(amountOutMin), 
                [tokenIn, tokenOut], // path
                to,
            ),
            "Tokens have been swapped successfully",
            "Swap Tokens"
        )
    }

    const getAmountsOut = async (amountIn: string, path: string[]) => { 
        if (!contracts || !contracts.router) return [];
        try {
            const amounts = await contracts?.router.getAmountsOut(ethers.parseEther(amountIn), path);
            return amounts.map((amount: any) => ethers.formatEther(amount)); 
        } catch (error) {
            console.error('Error getting amounts out:', error);
            return [];
        }
    }

    return {
        contracts,
        loading,
        createToken,
        createPair,
        addLiquidity,
        swapTokens,
        getAmountsOut,
        getAllPairs,
        getPairDetails,
    }
}
