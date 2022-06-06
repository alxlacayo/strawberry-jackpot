import { setMetaMask, PROVIDER_ID as METAMASK_ID } from "./metamask";
import { setCoinbaseWallet, PROVIDER_ID as COINBASE_WALLET_ID } from "./coinbase";
import { setWalletConnect, PROVIDER_ID as WALLET_CONNECT_ID } from "./walletConnect";
import type { EthereumProviders } from "../types";

export type ProviderIds = typeof METAMASK_ID | typeof COINBASE_WALLET_ID | typeof WALLET_CONNECT_ID;

export const ethereumProviders: EthereumProviders = {};

setMetaMask(ethereumProviders);
setCoinbaseWallet(ethereumProviders);
setWalletConnect(ethereumProviders);
