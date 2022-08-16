import { useEffect, type EffectCallback } from "react";
import { ReelsStyled } from "./Reels.styled";
import useReelMechanism from "./useReelMechanism";

interface Props {
    stopPositions: number[] | null;
    handleSpinComplete(): void;
}

export default function Reels({ stopPositions, handleSpinComplete }: Props): JSX.Element {
    const { positions, spin, stop, reset } = useReelMechanism(handleSpinComplete);

    useEffect((): ReturnType<EffectCallback> => {
        console.log("Effect.");
        let timeout: NodeJS.Timeout;
        if (stopPositions !== null) {
            console.log("Spin.");
            spin();
            console.log("Stopping here in 5 seconds -->", stopPositions);
            timeout = setTimeout(() => {
                stop(stopPositions);
            }, 5000);
        }
        return (): void => {
            console.log("Reset.");
            clearTimeout(timeout);
            reset();
        };
    }, [spin, stop, stopPositions, reset]);

    return (
        <ReelsStyled>
            {positions.map((position, index) => {
                return (
                    <img key={index}
                       
                            src={`/assets/reel/${position}.png`}
                            alt="Reel"
                         
                    />
                );
            })}
        </ ReelsStyled>
    );
}
