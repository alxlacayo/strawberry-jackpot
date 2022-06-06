import { useState } from "react";
import { type ContractService, type ContractState, type TransactionReceipt } from "../services/ethereum";
import Modal from "./modals/Modal";
import Transaction from "./modals/Transaction";
import { getErrorMessage } from "../utils/error";
import { MintControls, QuantityInput, Quantity, Adjuster } from "./MintForm.styled";
import Button from "./elements/Button.styled";

interface Props {
    contractService: ContractService;
    contractState: ContractState;
}

export default function MintForm({ contractService, contractState }: Props): JSX.Element {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [maxMints] = useState(20);
    const [quantity, setQuantity] = useState(1);
    const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { totalMinted, maxSupply, freeMintsAvailable } = contractState;
    const isSoldOut = totalMinted >= maxSupply;
    const isSoldOutOfFreebies = freeMintsAvailable <= 0;

    const closeModal = (): void => {
        setIsModalVisible(false);
        setTransactionReceipt(null);
        setErrorMessage(null);
    };

    const increment = (): void => {
        setQuantity(current => current < maxMints ? current + 1 : maxMints);
    };

    const decrement = (): void => {
        setQuantity(current => current > 1 ? current - 1 : 1);
    };

    const handleMint = async (): Promise<void> => {
        setIsModalVisible(true);
        const [_transactionReceipt, _errorMessage] = await mint();
        setTransactionReceipt(_transactionReceipt);
        setErrorMessage(_errorMessage);
    };

    const handleFreeMint = async (): Promise<void> => {
        setIsModalVisible(true);
        const [_transactionReceipt, _errorMessage] = await freeMint();
        setTransactionReceipt(_transactionReceipt);
        setErrorMessage(_errorMessage);
    };

    const mint = async (): Promise<[TransactionReceipt, null] | [null, string]> => {
        try {
            const _transactionReceipt = await contractService.mint(quantity);
            return [_transactionReceipt, null];
        } catch (error: any) {
            return [null, getErrorMessage(error)];
        }
    };

    const freeMint = async (): Promise<[TransactionReceipt, null] | [null, string]> => {
        try {
            const _transactionReceipt = await contractService.freeMint();
            return [_transactionReceipt, null];
        } catch (error: any) {
            return [null, getErrorMessage(error)];
        }
    };

    return (
        <>
            <MintControls>
                {!isSoldOut &&
                    <>
                        <QuantityInput>
                            <Adjuster onClick={decrement}><img src="/assets/subtract.svg" alt="subtract" /></Adjuster>
                            <Quantity>{quantity}</Quantity>
                            <Adjuster onClick={increment}><img src="/assets/add.svg" alt="subtract" /></Adjuster>
                        </QuantityInput>
                        <Button className="mint-button" onClick={handleMint}>Mint</Button>
                        {(isSoldOutOfFreebies)
                            ? <Button>Free mints all gone</Button>
                            : <Button onClick={handleFreeMint}>Free mint (2)</Button>
                        }
                    </>
                }
                {isSoldOut && <Button>Sold out</Button>}
            </MintControls>

            {isModalVisible &&
                <Modal close={closeModal}>
                    <Transaction
                        chainId={contractService.getChainId()}
                        transactionHash={transactionReceipt?.transactionHash}
                        errorMessage={errorMessage}
                    />
                </Modal>
            }
        </>
    );
}
