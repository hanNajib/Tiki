import { useState, useEffect } from "react";

export function useTiki(target: string, onEnd?: () => void) {
    const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });

    useEffect(() => {
        if (typeof window === "undefined") return; // Pastikan hanya berjalan di client

        let endTime: number;
        if (target.includes("h") || target.includes("m") || target.includes("s")) {
            endTime = Date.now() + parseDuration(target);
        } else {
            endTime = new Date(target).getTime();
        }

        const update = () => {
            const now = Date.now();
            const remaining = endTime - now;

            if (remaining <= 0) {
                setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
                if (onEnd) onEnd();
                return;
            }

            setTimeLeft({
                hours: String(Math.floor(remaining / (1000 * 60 * 60))).padStart(2, "0"),
                minutes: String(Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0"),
                seconds: String(Math.floor((remaining % (1000 * 60)) / 1000)).padStart(2, "0"),
            });
        };

        update();
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [target, onEnd]);

    return timeLeft;
}

function parseDuration(durationStr: string): number {
    let totalMs = 0;
    let match = durationStr.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    if (match) {
        totalMs += (match[1] ? parseInt(match[1]) * 3600000 : 0);
        totalMs += (match[2] ? parseInt(match[2]) * 60000 : 0);
        totalMs += (match[3] ? parseInt(match[3]) * 1000 : 0);
    }
    return totalMs;
}
