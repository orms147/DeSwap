import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from '../components/ui/use-toast';

// Extend the Window interface to include ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}

export const useWeb3 = () => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [chainId, setChainId] = useState<bigint | null>(null);

    const connectWallet = async () => {
        try {
            if(typeof window.ethereum !== 'undefined') {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send('eth_requestAccounts', []);
                const signer = await provider.getSigner();
                const network = await provider.getNetwork();

                setProvider(provider);
                setSigner(signer);
                setAccount(accounts[0]);
                setIsConnected(true);
                setChainId(network.chainId);

                toast({
                    title: "Wallet Connected! 🎉",
                    description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
                });
            } else {
                toast({
                title: "MetaMask Not Found",
                description: "Please install MetaMask to use this DEX",
                variant: "destructive",
                }); 
            }
        }
        catch (error) {
            console.error('Error connecting wallet:', error);
            toast({
                title: "Connection Failed",
                description: "Failed to connect wallet. Please try again.",
                variant: "destructive",
            });
        }
    };

    const disConnectWallet = () => {
        setProvider(null);
        setSigner(null);
        setAccount(null);
        setIsConnected(null);
        setChainId(null);

        toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
        });
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    disConnectWallet();
                } else {
                    setAccount(accounts[0]);
                }
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
            }
        };
    }, []);

    return {
        provider,
        signer,
        account,
        isConnected,
        chainId,
        connectWallet,
        disConnectWallet
    }
}