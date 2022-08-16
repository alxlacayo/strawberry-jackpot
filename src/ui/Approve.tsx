import { handleErrorMessage } from "../utils/error";
import type { StrawberryService } from "../services/ethereum";

interface Props {
    strawberryService: StrawberryService;
    setHasApproved: React.Dispatch<React.SetStateAction<boolean>>;
    setModalMessage: React.Dispatch<React.SetStateAction<string | null>>;
    spender: string;
}

export default function Approve({ strawberryService, setHasApproved, setModalMessage, spender }: Props): JSX.Element {
    const handleApprove = async (): Promise<void> => {
        setModalMessage("Waiting for approval.");
        const isApprovalSuccesful = await approve();
        setHasApproved(isApprovalSuccesful);
        setModalMessage(!isApprovalSuccesful ? "Approval failed." : null);
    };

    const approve = async (): Promise<boolean> => {
        try {
            await strawberryService.approve(spender);
            return true;
        } catch (error: any) {
            handleErrorMessage(error);
            return false;
        }
    };

    // TODO: disable button while pending?
    return <span onClick={handleApprove}>Approve</span>;
}
