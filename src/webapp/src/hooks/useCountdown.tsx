import {useEffect, useState} from 'react';

export const useCountdown = (delayInMs: number) => {
    const [countdownDate, setCountdownDate] = useState<number>(new Date().getTime() + delayInMs)
    const [countdown, setCountDown] = useState<number | null>(new Date().getTime() - countdownDate);

    useEffect(() => {
            const interval = setInterval(() => {
                setCountDown(countdownDate - new Date().getTime());
            }, 1000);

            return () => clearInterval(interval);
        }, [countdownDate]
    );

    if (!countdown) {
        return null
    }

    return Math.floor((countdown % (1000 * 60)) / 1000);
};