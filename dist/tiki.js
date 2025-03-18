class Tiki {
    constructor(target) {
        this.target = target;
        this.interval = null;
        const hoursEl = target.querySelector('.tiki-hours');
        const minutesEl = target.querySelector('.tiki-minutes');
        const secondsEl = target.querySelector('.tiki-seconds');
        this.onEnd = () => {
            const event = new Event("tiki-end");
            target.dispatchEvent(event);
        };
        if (target.hasAttribute("data-target")) {
            this.endTime = new Date(target.getAttribute("data-target")).getTime();
        }
        else if (target.hasAttribute("data-duration")) {
            this.endTime = new Date().getTime() + this.parseDuration(target.getAttribute("data-duration"));
        }
        else {
            throw new Error("Tiki: data-target or data-duration is required.");
        }
        this.start(hoursEl, minutesEl, secondsEl);
    }
    parseDuration(durationStr) {
        let match = durationStr.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
        if (!match)
            return 0;
        return (parseInt(match[1] || "0") * 3600000) +
            (parseInt(match[2] || "0") * 60000) +
            (parseInt(match[3] || "0") * 1000);
    }
    start(hoursEl, minutesEl, secondsEl) {
        this.update(hoursEl, minutesEl, secondsEl);
        this.interval = window.setInterval(() => this.update(hoursEl, minutesEl, secondsEl), 1000);
    }
    update(hoursEl, minutesEl, secondsEl) {
        const remaining = this.endTime - new Date().getTime();
        if (remaining <= 0) {
            if (this.interval)
                clearInterval(this.interval);
            hoursEl && (hoursEl.textContent = "00");
            minutesEl && (minutesEl.textContent = "00");
            secondsEl && (secondsEl.textContent = "00");
            this.onEnd();
            return;
        }
        const formatNumber = (num) => num.toString().padStart(2, "0");
        hoursEl && (hoursEl.textContent = formatNumber(Math.floor(remaining / 3600000)));
        minutesEl && (minutesEl.textContent = formatNumber(Math.floor((remaining % 3600000) / 60000)));
        secondsEl && (secondsEl.textContent = formatNumber(Math.floor((remaining % 60000) / 1000)));
    }
}
// **Auto-init agar semua framework langsung jalan**
const observer = new MutationObserver(() => {
    document.querySelectorAll(".tiki-time:not([data-init])").forEach(el => {
        el.setAttribute("data-init", "true");
        new Tiki(el);
    });
});
observer.observe(document.body, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tiki-time:not([data-init])").forEach(el => {
        el.setAttribute("data-init", "true");
        new Tiki(el);
    });
});
export default Tiki;
//# sourceMappingURL=tiki.js.map