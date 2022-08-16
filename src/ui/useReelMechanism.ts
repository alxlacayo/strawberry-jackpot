import { useCallback, useEffect, useState, type EffectCallback } from "react";

interface ReelsMechanism {
    positions: number[],
    spin(): void;
    stop(stopPositions: number[]): void;
    reset(): void;
}

const numberOfReels = 4;
const itemsPerReel = 15;
const intervalFrequency = 125;
const intervals: Array<NodeJS.Timer | null> = [];

export default function useReelMechanism(spinCompleteCallback: () => void): ReelsMechanism {
    const [positions, setPositions] = useState(makeNumberArray(numberOfReels));
    const [stopPositions, setStopPositions] = useState<number[]>([]);

    const spin = useCallback((): void => {
        for (let i = 0; i < numberOfReels; i++) {
            intervals[i] = setInterval(() => {
                setPositions(previous => {
                    const state = [...previous];
                    state[i] = state[i] < itemsPerReel - 1 ? state[i] + 1 : 0;
                    return state;
                });
            }, intervalFrequency);
        }
    }, [setPositions]);

    const stop = useCallback((stopPositions: number[]): void => {
        setStopPositions(stopPositions);
    }, [setStopPositions]);

    const reset = useCallback((): void => {
        for (let i = numberOfReels - 1; i >= 0; i--) {
            if (intervals[i] !== null) {
                clearInterval(intervals[i]!);
            }
            intervals.pop();
        }
        setStopPositions([]);
    }, [setStopPositions]);

    useEffect((): ReturnType<EffectCallback> => {
        if (stopPositions.length === 0) { return; }
        for (let i = 0; i < numberOfReels; i++) {
            for (let j = 0; j < i; j++) {
                if (intervals[j] !== null) { return; }
            }
            if (intervals[i] !== null) {
                if (positions[i] !== stopPositions[i]) { break; }
                clearInterval(intervals[i]!);
                intervals[i] = null;
                if (i === numberOfReels - 1) {
                    spinCompleteCallback();
                }
            }
        }
    }, [spinCompleteCallback, positions, stopPositions]);

    return {
        positions,
        spin,
        stop,
        reset
    };
}

function makeNumberArray(length: number): number[] {
    const numbers: number[] = [];
    for (let i = 0; i < length; i++) {
        numbers.push(randomNumber());
    }
    return numbers;
}

function randomNumber(): number {
    return Math.floor(Math.random() * (itemsPerReel - 1));
}
