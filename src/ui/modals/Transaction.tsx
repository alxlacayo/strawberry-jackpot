interface Props {
    chainId: number;
    transactionHash: string | undefined;
    errorMessage: string | null;
}

export default function Transaction({ chainId, transactionHash, errorMessage }: Props) {
    const getEtherscanUrl = (): string => {
        return chainId === 1
            ? `https://etherscan.io/tx/${transactionHash}`
            : `https://rinkeby.etherscan.io/tx/${transactionHash}`;
    };

    return (
        <>
            {!transactionHash &&
                <>
                    <h2>{errorMessage ? "Error" : "Confirm transaction"}</h2>
                    {!errorMessage && <span>(awaiting confirmation...)</span>}
                    {errorMessage && <span>{errorMessage}</span>}
                </>
            }
            {transactionHash &&
                <>
                    <h2>Success</h2>
                    <span>Your transaction has been confirmed on the blockchain.</span>
                    {/* <UnderlinedButton as="a" href={getEtherscanUrl()} target="_blank">View on etherscan</UnderlinedButton> */}
                </>
            }
        </>
    );
}
