import type { AddEthereumChainParameter } from "./types"

type Chain = Partial<AddEthereumChainParameter> & {
    chainId: string;
};

interface Chains {
    [index: string]: Chain;
}

const chains: Chains = {
    mainnet: {
        chainId: "0x1"
    },
    polygon: {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        nativeCurrency: {
            name: "Matic",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: [
            "https://rpc-mainnet.maticvigil.com"
        ],
        blockExplorerUrls: [
            "https://polygonscan.com"
        ]
    },
    mumbai: {
        chainId: "0x13881",
        chainName: "Mumbai",
        nativeCurrency: {
            name: "Matic",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: [
            "https://rpc-mumbai.maticvigil.com/"
        ],
        blockExplorerUrls: [
            "https://mumbai.polygonscan.com"
        ]
    },
    localhost: {
        chainId: "0x5555555"
    }
}

export default chains;
