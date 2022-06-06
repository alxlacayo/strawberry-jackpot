import { cloneElement, useState } from "react";
import Modal from "../modals/Modal";
import ConnectWallet from "../MintConnectWallet";
import type { ConnectionService } from "../../services/ethereum";
import TextButton from "../elements/TextButton.styled";

interface Props {
    children?: JSX.Element;
    connectionService: ConnectionService;
}

export default function Connect({ children, connectionService }: Props): JSX.Element {
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const toggleModal = (): void => {
        setIsModalVisible(state => !state);
    };

    const button = children 
        ? cloneElement(children, { onClick: toggleModal })
        : <TextButton onClick={toggleModal}>Connect</TextButton>;

    return (
        <>
            {button}
            {isModalVisible &&
                <Modal close={toggleModal}>
                    <ConnectWallet connectionService={connectionService} />
                </Modal>
            }
        </>
    );
}
