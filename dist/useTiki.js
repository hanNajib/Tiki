import Tiki from "./tiki";
import { useState, useEffect } from "react";
export function useTiki(durationOrTarget, onEnd) {
    const [time, setTime] = useState({ hours: "00", minutes: "00", seconds: "00" });
    useEffect(() => {
        const tiki = new Tiki(null, durationOrTarget, () => {
            if (onEnd)
                onEnd();
        });
        const updateTime = () => {
            const now = new Date().getTime();
            const remaining = tiki["endTime"] - now;
            if (remaining <= 0) {
                setTime({ hours: "00", minutes: "00", seconds: "00" });
                return;
            }
            setTime({
                hours: String(Math.floor(remaining / 3600000)).padStart(2, "0"),
                minutes: String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0"),
                seconds: String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0"),
            });
        };
        const interval = setInterval(updateTime, 1000);
        updateTime();
        return () => clearInterval(interval);
    }, [durationOrTarget]);
    return time;
}
//# sourceMappingURL=useTiki.js.map