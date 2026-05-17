import { useEffect, useState } from "react";

const useProgress = (duration = 3000, running=true) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!running) return;

        const start = performance.now();
        const tick = (now) => {
            const elapsed = now - start;
            const next = Math.min((elapsed / duration) * 100, 100);
            setProgress(next);
            if (next < 100) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [duration, running]);

    return progress;
};

export default useProgress;