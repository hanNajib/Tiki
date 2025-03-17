import Tiki, { TikiOptions } from './tiki';
import { useTiki, TikiTimeObject } from './hooks';

// Browser initialization
if (typeof window !== "undefined") {
  const initializeTiki = (): void => {
    document.querySelectorAll<HTMLElement>(".tiki-time").forEach(el => new Tiki(el));
  };
  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeTiki);
  } else {
    initializeTiki();
  }
}

export { Tiki, useTiki, TikiOptions, TikiTimeObject };
export default Tiki;