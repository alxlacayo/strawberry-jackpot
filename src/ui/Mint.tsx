import { useState, useEffect, type EffectCallback } from "react";
import { useContractService } from "../services/ethereum";
import MintSwitchChain from "./MintSwitchChain";
import MintForm from "./MintForm";
import type { ConnectionState, ConnectionService, ContractState } from "../services/ethereum";
import { Container, InnerContainer, Description, DetailsContainer, Showcase } from "./Mint.styled";
import ConnectWallet from "./MintConnectWallet";

interface Props {
    connectionState: ConnectionState;
    connectionService: ConnectionService;
}

export default function Mint({ connectionState, connectionService }: Props): JSX.Element {
    const { account, chainId, ethereum } = connectionState;
    const contractService = useContractService(ethereum);
    const [contractState, setContractState] = useState(contractService.getState());

    let component;
    if (!account) {
        component = <ConnectWallet connectionService={connectionService} />
    } else if (chainId !== contractService.getChainId()) {
        component = <MintSwitchChain connectionService={connectionService} />;
    } else {
        component = <MintForm contractService={contractService} contractState={contractState} />;
    }

    useEffect((): ReturnType<EffectCallback> => {
        const handleStateChanged = (state: ContractState): void => setContractState(state);
        contractService.on("stateChanged", handleStateChanged);
        return (): void => {
            contractService.removeListener("stateChanged", handleStateChanged);
            contractService.destroy();
        };
    }, [setContractState, contractService]);

    return (
        <Container>
            <InnerContainer>
                <Showcase>
                    <img className="showcase" src="/images/1.png" alt="I Did It" />
                    <img className="showcase" src="/images/2.png" alt="I Did It" />
                </Showcase>
                <DetailsContainer>
                    <h1>I Fkin Did It</h1>
                    <Description>A collection of 2,222 angry crypto bros that couldn't handle the bear market and made good on their promise to chop it. All metadata is permanently stored on IPFS. There are 1,000 free mints available, two per wallet.</Description>
                    <ul>
                        <li>Mint price: {contractState.mintPrice}</li>
                        <li>Total minted: {contractState.totalMinted} / {contractState.maxSupply}</li>
                        <li>Free mints left: {contractState.freeMintsAvailable}</li>
                    </ul>
                    {component}
                </DetailsContainer>
            </InnerContainer>
        </Container>
    );
}
