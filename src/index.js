class Tiki {
    constructor(element) {
        /** @type {HTMLElement} */
        this.target = element;
        this.hoursEl = element.querySelector('.tiki-hours') || null;
        this.minutesEl = element.querySelector('.tiki-minutes') || null;
        this.secondsEl = element.querySelector('.tiki-seconds') || null;

        this.onEnd = () => {
            const event = new Event("tiki-end");
            element.dispatchEvent(event);
            console.log("TikiTime! (⌒‿⌒)");
        };

        if (this.target.hasAttribute("data-target")) {
            this.endTime = new Date(this.target.getAttribute("data-target")).getTime();
        } else if (this.target.hasAttribute("data-duration")) {
            let duration = this.parseDuration(this.target.getAttribute("data-duration"));
            this.endTime = new Date().getTime() + duration;
        } else {
            console.error("Tiki: Ehh? (・ω・) Where’s data-target or data-duration~?");
            return;
        }

        this.interval = null;
        this.start();
    }

    parseDuration(durationStr) {
        let totalMs = 0;
        let match = durationStr.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
        if (match) {
            totalMs += (match[1] ? parseInt(match[1]) * 3600000 : 0);
            totalMs += (match[2] ? parseInt(match[2]) * 60000 : 0);
            totalMs += (match[3] ? parseInt(match[3]) * 1000 : 0);
        }
        return totalMs;
    }

    start() {
        this.update();
        this.interval = setInterval(() => {
            this.update();
        }, 1000);
    }

    update() {
        const now = new Date().getTime();
        const remainingTime = this.endTime - now;

        if (remainingTime <= 0) {
            clearInterval(this.interval);
            if (this.hoursEl) this.hoursEl.textContent = "00";
            if (this.minutesEl) this.minutesEl.textContent = "00";
            if (this.secondsEl) this.secondsEl.textContent = "00";
            this.onEnd();
            return;
        }

        const hours = String(Math.floor(remainingTime / (1000 * 60 * 60))).padStart(2, "0");
        const minutes = String(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
        const seconds = String(Math.floor((remainingTime % (1000 * 60)) / 1000)).padStart(2, "0");

        if (this.hoursEl) this.hoursEl.textContent = hours;
        if (this.minutesEl) this.minutesEl.textContent = minutes;
        if (this.secondsEl) this.secondsEl.textContent = seconds;
    }
}

if (typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".tiki-time").forEach(el => new Tiki(el));
    });
}

export default Tiki;
