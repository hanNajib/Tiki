declare class Tiki {
    constructor(element: HTMLElement | null);
    parseDuration(durationStr: string): number;
    start(): void;
    update(): void;
}

interface TikiTime {
    hours: string;
    minutes: string;
    seconds: string;
}

export function useTiki(target?: string | null, duration?: string | null): TikiTime;
export default Tiki;
