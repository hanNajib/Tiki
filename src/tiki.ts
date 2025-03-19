class Tiki {
    private endTime: number;
    private interval: number | null = null;
    private onEnd: () => void;
    
    constructor(
        private target?: HTMLElement | null,
        durationOrTarget?: string,
        onEndCallback?: () => void
    ) {
        const isDirectUsage = typeof durationOrTarget === "string";

        this.onEnd = () => {
            if (onEndCallback) onEndCallback();
            if (this.target) {
                const event = new Event("tiki-end");
                this.target.dispatchEvent(event);
            }
            console.log("TikiTime! ⏳");
        };

        if (isDirectUsage) {
            if (durationOrTarget.includes(":") || durationOrTarget.includes("-")) {
                this.endTime = new Date(durationOrTarget).getTime();
            } else {
                this.endTime = new Date().getTime() + this.parseDuration(durationOrTarget);
            }
        } else if (this.target) {
            if (this.target.hasAttribute("data-target")) {
                this.endTime = new Date(this.target.getAttribute("data-target")!).getTime();
            } else if (this.target.hasAttribute("data-duration")) {
                this.endTime = new Date().getTime() + this.parseDuration(this.target.getAttribute("data-duration")!);
            } else {
                throw new Error("Tiki: data-target or data-duration is required.");
            }
        } else {
            throw new Error("Tiki: Missing target or duration.");
        }

        this.start();
    }

    private parseDuration(durationStr: string): number {
        let match = durationStr.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
        if (!match) return 0;
        return (parseInt(match[1] || "0") * 3600000) +
               (parseInt(match[2] || "0") * 60000) +
               (parseInt(match[3] || "0") * 1000);
    }

    private start() {
        this.update();
        this.interval = window.setInterval(() => this.update(), 1000);
    }

    private update() {
        const remaining = this.endTime - new Date().getTime();
        if (remaining <= 0) {
            if (this.interval) clearInterval(this.interval);
            this.onEnd();
            return;
        }

        if (this.target) {
            this.target.querySelector(".tiki-hours")!.textContent = String(Math.floor(remaining / 3600000)).padStart(2, "0");
            this.target.querySelector(".tiki-minutes")!.textContent = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
            this.target.querySelector(".tiki-seconds")!.textContent = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
        }
    }

    public stop() {
        if (this.interval) clearInterval(this.interval);
    }
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll<HTMLElement>(".tiki-time").forEach(el => new Tiki(el));
    });
}



export default Tiki;
