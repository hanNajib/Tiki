export interface TikiOptions {
    onEnd?: () => void;
  }
  
  export class Tiki {
    target: HTMLElement | null;
    hoursEl: HTMLElement | null;
    minutesEl: HTMLElement | null;
    secondsEl: HTMLElement | null;
    endTime: number;
    interval: ReturnType<typeof setInterval> | null;
    onEnd: () => void;
  
    constructor(element: HTMLElement | null, options?: TikiOptions) {
      this.target = element;
      this.hoursEl = element?.querySelector('.tiki-hours') || null;
      this.minutesEl = element?.querySelector('.tiki-minutes') || null;
      this.secondsEl = element?.querySelector('.tiki-seconds') || null;
  
      this.onEnd = options?.onEnd || (() => {
        if (element) {
          const event = new Event("tiki-end");
          element.dispatchEvent(event);
        }
        console.log("TikiTime! (⌒‿⌒)");
      });
  
      let targetTime: string | null = null;
      let durationStr: string | null = null;
  
      if (element) {
        targetTime = element.getAttribute("data-target");
        durationStr = element.getAttribute("data-duration");
      }
  
      if (targetTime) {
        this.endTime = new Date(targetTime).getTime();
      } else if (durationStr) {
        let duration = this.parseDuration(durationStr);
        this.endTime = new Date().getTime() + duration;
      } else {
        if (element) console.error("Tiki: Ehh? (・ω・) Where's data-target or data-duration~?");
        this.endTime = 0;
        return;
      }
  
      this.interval = null;
      this.start();
    }
  
    parseDuration(durationStr: string): number {
      let totalMs = 0;
      const match = durationStr.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
      if (match) {
        totalMs += (match[1] ? parseInt(match[1]) * 3600000 : 0);
        totalMs += (match[2] ? parseInt(match[2]) * 60000 : 0);
        totalMs += (match[3] ? parseInt(match[3]) * 1000 : 0);
      }
      return totalMs;
    }
  
    start(): void {
      this.update();
      this.interval = setInterval(() => {
        this.update();
      }, 1000);
    }
  
    update(): void {
      const now = new Date().getTime();
      const remainingTime = this.endTime - now;
  
      if (remainingTime <= 0) {
        if (this.interval) clearInterval(this.interval);
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
  
    stop(): void {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  }
  
  export default Tiki;