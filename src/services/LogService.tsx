import { WheelEntry } from './WheelServices'; 

/**
 * Egy naplóbejegyzés adatszerkezete.
 * @typedef {object} LogEntry
 * @property {string} id - Egyedi azonosító.
 * @property {string} winnerName - A nyertes neve.
 * @property {number} timestamp - Időbélyeg.
 * @property {boolean} eliminated - Törölve lett-e a nyertes.
 * @property {WheelEntry[]} entriesAtSpin - A kerék állapota pörgetéskor.
 */
export interface LogEntry {
  id: string;
  winnerName: string;
  timestamp: number;
  eliminated: boolean;
  entriesAtSpin: WheelEntry[]; 
}
const STORAGE_KEY = 'wheelSpinLogs';

type LogUpdateListener = () => void;

/**
 * A naplózási logika üzleti szolgáltatása (Business Logic).
 * Singleton mintát követ, kezeli a LocalStorage-t és az eseményfeliratkozókat.
 */
class LogService {

    private listeners: LogUpdateListener[] = [];
    
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }

    /**
     * Feliratkozik az adatváltozási eseményekre.
     * @param listener - A meghívandó callback függvény.
     */
    public addListener(listener: LogUpdateListener): void {
        this.listeners.push(listener);
    }

    /**
     * Leiratkozik az eseményekről.
     * @param listener - A törlendő callback függvény.
     */
    public removeListener(listener: LogUpdateListener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    /**
     * Betölti a naplókat a böngésző LocalStorage-ából.
     * @returns {LogEntry[]} A betöltött naplók listája.
     */
    public loadLogs(): LogEntry[] {
        if (typeof window === 'undefined') {
            return [];
        }
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as LogEntry[]) : [];
        } catch (error) {
            console.error("A logok nemszeretnek minket:", error);
            return [];
        }
    }

    /**
     * Elmenti a megadott naplólistát a LocalStorage-ba.
     * @param logs - A mentendő lista.
     */
    private saveAllLogs(logs: LogEntry[]): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        } catch (error) {
            console.error("Már menteni se tudunk:", error);
        }
    }

    /**
     * Új bejegyzést ad a naplóhoz, menti és értesíti a figyelőket.
     * @param winnerName - A nyertes neve.
     * @param eliminated - Eliminálva lett-e.
     * @param entriesAtSpin - A kerék állapota.
     * @returns {LogEntry} Az újonnan létrehozott bejegyzés.
     */
    public addLog(winnerName: string, eliminated: boolean, entriesAtSpin: WheelEntry[]): LogEntry {
        const newLog: LogEntry = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9), 
            winnerName,
            timestamp: Date.now(),
            eliminated,
            entriesAtSpin, 
        };

        const currentLogs = this.loadLogs();
        currentLogs.unshift(newLog); 

        this.saveAllLogs(currentLogs);
        
        this.notifyListeners(); 

        return newLog;
    }

    /**
     * Törli az összes naplóbejegyzést a tárolóból.
     */
    public clearLogs(): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(STORAGE_KEY);
            this.notifyListeners(); 
        } catch (error) {
            console.error("Ragaszkodik a logokhoz:", error);
        }
    }
}

export const logService = new LogService();