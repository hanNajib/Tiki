import { useState, useEffect } from 'react';
import Tiki from './tiki';

export interface TikiTimeObject {
  hours: string;
  minutes: string;
  seconds: string;
}

/**
 * React hook for TikiTime countdown
 * @param target - Target date/time as string or Date object
 * @param duration - Duration string in format "1h30m15s"
 * @returns Time object with hours, minutes, seconds as strings
 */
export function useTiki(target?: string | Date, duration?: string): TikiTimeObject {
  const [time, setTime] = useState<TikiTimeObject>({ hours: "00", minutes: "00", seconds: "00" });
  
  useEffect(() => {
    let endTime: number;
    if (target) {
      endTime = new Date(target).getTime();
    } else if (duration) {
      const tiki = new Tiki(null);
      endTime = new Date().getTime() + tiki.parseDuration(duration);
    } else {
      console.error("useTiki: Ehh? (・ω・) Where's target or duration~?");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remainingTime = endTime - now;

      if (remainingTime <= 0) {
        setTime({ hours: "00", minutes: "00", seconds: "00" });
        clearInterval(interval);
        return;
      }

      const hours = String(Math.floor(remainingTime / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
      const seconds = String(Math.floor((remainingTime % (1000 * 60)) / 1000)).padStart(2, "0");

      setTime({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [target, duration]);

  return time;
}