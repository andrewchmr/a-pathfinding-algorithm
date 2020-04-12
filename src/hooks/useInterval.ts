import {useEffect, useRef} from "react";
import {clearInterval, setInterval} from "timers";

export const useInterval = (callback: any, delay: number | null) => {
    const savedCallback = useRef();
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            (savedCallback as any).current();
        };

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};