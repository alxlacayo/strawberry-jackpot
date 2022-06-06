type StateSetter<T> = (state: Partial<T>) => void

export default function makeState<T>(initialState: T, callback: (state: T) => void): [T, StateSetter<T>] {
    const state = { ...initialState };

    const setState = (_state: Partial<T>): void => {
        Object.assign(state, _state);
        callback({ ...state });
    };

    return [state, setState];
}
