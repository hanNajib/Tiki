declare class Tiki {
    private target?;
    private endTime;
    private interval;
    private onEnd;
    constructor(target?: (HTMLElement | null) | undefined, durationOrTarget?: string, onEndCallback?: () => void);
    private parseDuration;
    private start;
    private update;
    stop(): void;
}
export default Tiki;
//# sourceMappingURL=tiki.d.ts.map