import { cloneElement, useState } from "react";
import Modal from "../modals/Modal";
import ConnectWallet from "../modals/ConnectWallet";
import type { ConnectionService } from "../../services/ethereum";

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
        : <span onClick={toggleModal}>Connect</span>;

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
