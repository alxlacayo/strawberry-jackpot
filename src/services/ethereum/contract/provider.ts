import { ethers } from "ethers";
import { JsonRpcProvider, type BaseProvider, type JsonRpcSigner } from "@ethersproject/providers";
import type { Provider } from "../types";

export const getProvider = (chainIdAsHex: string): BaseProvider => {
    const chainId = parseInt(chainIdAsHex);
    return chainId !== 31337
        ? new ethers.providers.AlchemyProvider(chainId, process.env.REACT_APP_ALCHEMY_ID)
        : ethers.getDefaultProvider("http://localhost:8545");
}

export const getSigner = (providerOrJsonRpcProvider: Provider | JsonRpcProvider): JsonRpcSigner => {
    const provider = (providerOrJsonRpcProvider instanceof JsonRpcProvider)
        ? providerOrJsonRpcProvider
        : new ethers.providers.Web3Provider(providerOrJsonRpcProvider);
    return provider.getSigner();
};
