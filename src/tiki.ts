class Tiki {
    private endTime: number;
    private interval: number | null = null;
    private onEnd: () => void;

    constructor(private target: HTMLElement) {
        const hoursEl = target.querySelector('.tiki-hours') as HTMLElement | null;
        const minutesEl = target.querySelector('.tiki-minutes') as HTMLElement | null;
        const secondsEl = target.querySelector('.tiki-seconds') as HTMLElement | null;

        this.onEnd = () => {
            const event = new Event("tiki-end");
            target.dispatchEvent(event);
        };

        if (target.hasAttribute("data-target")) {
            this.endTime = new Date(target.getAttribute("data-target")!).getTime();
        } else if (target.hasAttribute("data-duration")) {
            this.endTime = new Date().getTime() + this.parseDuration(target.getAttribute("data-duration")!);
        } else {
            throw new Error("Tiki: data-target or data-duration is required.");
        }

        this.start(hoursEl, minutesEl, secondsEl);
    }

    private parseDuration(durationStr: string): number {
        let match = durationStr.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
        if (!match) return 0;
        return (parseInt(match[1] || "0") * 3600000) +
               (parseInt(match[2] || "0") * 60000) +
               (parseInt(match[3] || "0") * 1000);
    }

    private start(hoursEl: HTMLElement | null, minutesEl: HTMLElement | null, secondsEl: HTMLElement | null) {
        this.update(hoursEl, minutesEl, secondsEl);
        this.interval = window.setInterval(() => this.update(hoursEl, minutesEl, secondsEl), 1000);
    }

    private update(hoursEl: HTMLElement | null, minutesEl: HTMLElement | null, secondsEl: HTMLElement | null) {
        const remaining = this.endTime - new Date().getTime();
        if (remaining <= 0) {
            if (this.interval) clearInterval(this.interval);
            hoursEl && (hoursEl.textContent = "00");
            minutesEl && (minutesEl.textContent = "00");
            secondsEl && (secondsEl.textContent = "00");
            this.onEnd();
            return;
        }

        const formatNumber = (num: number) => num.toString().padStart(2, "0");
        hoursEl && (hoursEl.textContent = formatNumber(Math.floor(remaining / 3600000)));
        minutesEl && (minutesEl.textContent = formatNumber(Math.floor((remaining % 3600000) / 60000)));
        secondsEl && (secondsEl.textContent = formatNumber(Math.floor((remaining % 60000) / 1000)));
    }
}

const observer = new MutationObserver(() => {
    document.querySelectorAll<HTMLElement>(".tiki-time:not([data-init])").forEach(el => {
        el.setAttribute("data-init", "true");
        new Tiki(el);
    });
});

observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll<HTMLElement>(".tiki-time:not([data-init])").forEach(el => {
        el.setAttribute("data-init", "true");
        new Tiki(el);
    });
});

export default Tiki;
