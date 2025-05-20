"use client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { Chain, http } from "viem";
import { cookieStorage, createConfig, createStorage, WagmiProvider } from "wagmi";


const myChainlet: Chain = {
    id: 2747220808242000,
    name: "SKT",
    nativeCurrency: { name: "SKT", symbol: "SKT", decimals: 18},
    rpcUrls: {
        default: {
            http: ["https://rynn-2747220808242000-1.ws.sagarpc.io"]
        }
    }
}

const queryClient = new QueryClient();
const config = createConfig({
    chains: [myChainlet],
    transports: { [myChainlet.id]: http() },
    connectors: [],
    ssr: true,
    storage: createStorage({storage: cookieStorage})
});

export function Providers({children} : { children: React.ReactNode}) {
    return (
        <ConfigProvider>
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>
                    <RainbowKitProvider>{children}</RainbowKitProvider>
                </WagmiProvider>
            </QueryClientProvider>
        </ConfigProvider>
    )
}