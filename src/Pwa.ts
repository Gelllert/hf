/**
 * Progressive Web App (PWA) kezelő osztály.
 * Felelős a Service Worker regisztrációjáért biztonságos kontextusban.
 */
class Pwa {
    #serviceWorkerRegistration?: ServiceWorkerRegistration;
    
    /**
     * A PWA konstruktora.
     * Automatikusan regisztrálja a Service Worker-t, ha a böngésző biztonságos kontextusban fut (HTTPS vagy localhost).
     */
    constructor() {
        if (isSecureContext) {
            (async () => {
                this.#serviceWorkerRegistration = await navigator.serviceWorker.register("sw.js");
            })();
        }
    }
}
export const pwa = new Pwa();