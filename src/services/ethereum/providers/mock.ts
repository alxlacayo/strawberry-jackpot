import makeEthereumProvider from "./ethereumProvider";
import EventEmitter from "events";
import type {
    RequestArguments,
    SwitchEthereumChainParameter,
    Provider
} from "../types";

const ETH_ADDRESS = "0x6e149BFc5cf4Bd41a07Be259066a1E787972243b";
const TIMEDELAY = 100;

export const mockEthereum: Provider = Object.assign(new EventEmitter(), {
    request: (args: RequestArguments): Promise<unknown> => {
        return new Promise((resolve) => {
            switch (args.method) {
                case "eth_accounts":
                    setTimeout(() => resolve([ETH_ADDRESS]), TIMEDELAY);
                    break;
                case "eth_requestAccounts":
                    setTimeout(() => resolve([ETH_ADDRESS]), TIMEDELAY);
                    break;
                case "eth_chainId":
                    setTimeout(() => resolve(["0x1"]), TIMEDELAY);
                    break;
                case "wallet_switchEthereumChain":
                    const params = args.params as SwitchEthereumChainParameter[];
                    setTimeout(() => {
                        mockEthereum.emit("chainChanged", params[0].chainId);
                        resolve(null);
                    }, TIMEDELAY);
                    break;
                default:
                    throw new Error("Invalid RPC method specified.");
            }
        });
    }
});

export const mockProvider = makeEthereumProvider(mockEthereum);
