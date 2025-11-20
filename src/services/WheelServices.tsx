/**
 * Egy kerék cikkely adatszerkezete.
 * @typedef {object} WheelEntry
 * @property {string} id - Egyedi azonosító.
 * @property {string} name - A cikkely felirata.
 * @property {number} weight - Súlyozás (esély).
 * @property {string} color - A cikkely színe.
 * @property {number} entryNumber - Sorszám a rendezéshez.
 */
export type WheelEntry = {
    id: string;
    name: string;
    weight: number;
    color: string;
    entryNumber: number;
}

/**
 * A pörgetés eredményének adatszerkezete.
 * @typedef {object} SpinResult
 * @property {string} spinId - A pörgetés egyedi azonosítója.
 * @property {number} rotation - A végső forgásszög.
 * @property {WheelEntry[]} entries - A pörgetésben résztvevő elemek.
 * @property {WheelEntry} winningEntry - A nyertes elem.
 */
export type SpinResult = {
    spinId: string;
    rotation: number;
    entries: WheelEntry[];
    winningEntry: WheelEntry;
}

/**
 * A kerék adatait és logikáját kezelő központi szolgáltatás.
 * Singleton, kezeli a bejegyzéseket, a véletlenszám-generálást és a pörgetés logikáját.
 */
class WheelService {
    private static instance: WheelService;
    private entries: WheelEntry[] = [];
    private listeners: (() => void)[] = [];

    private constructor() {

        this.initializeWithDefaultEntries();
    }

    /**
     * Inicializálja a szolgáltatást alapértelmezett adatokkal.
     */
    private initializeWithDefaultEntries(): void {
        const defaultEntries = [
            { name: "Zsiguli", weight: 3, color: "#da2222ff" },
            { name: "Zsé", weight: 2, color: "#15ff00ff" },
            { name: "Zsarnok", weight: 4, color: "#e6d92eff" },
            { name: "Zsurnaliszt", weight: 1, color: "#4f6597" },
            { name: "Zsibbad", weight: 5, color: "#613b8c" }
        ];

        defaultEntries.forEach((d, index) => {
            const entry: WheelEntry = {
                id: index.toString() + "-" + Math.random().toString(36),
                name: d.name,
                weight: d.weight,
                color: d.color,
                entryNumber: this.entries.length
            };
            this.entries.push(entry);
        });
        this.notifyListeners();
    }

    /**
     * Feliratkozás az adatváltozásokra.
     * @param listener - Callback függvény.
     */
    public addListener(listener: () => void): void {
        this.listeners.push(listener);
    }

    /**
     * Leiratkozás az adatváltozásokról.
     * @param listener - Callback függvény.
     */
    public removeListener(listener: () => void): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach((nf) => nf());
    }


    /**
     * Singleton példány lekérése.
     * @returns {WheelService} Az egyetlen példány.
     */
    public static getInstance(): WheelService {
        if (!WheelService.instance) {
            WheelService.instance = new WheelService();
        }
        return WheelService.instance;
    }

    private generateId(): string {
        return this.entries.length.toString() + "-" + (Math.random() * 10).toString(36);
    }

    private generateSpinId(): string {
        return Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 8);
    }

    /**
     * Hozzáad egy új elemet a kerékhez.
     * @param name - Az elem neve.
     * @param weight - Az elem súlya.
     * @param color - Az elem színe.
     */
    public addEntry(name: string, weight: number, color: string): void {
        const entry: WheelEntry = {
            id: this.generateId(),
            name,
            weight,
            color,
            entryNumber: this.entries.length
        };
        this.entries.push(entry);
        this.notifyListeners();
    }

    /**
     * Törli az összes elemet a kerékről.
     */
    public clearEntries(): void {
        this.entries = [];
        this.notifyListeners();
    }

    /**
     * Lekéri az aktuális elemek listáját.
     * @returns {WheelEntry[]} Az elemek tömbje.
     */
    public getEntries(): WheelEntry[] {
        return this.entries;
    }

    /**
     * Eltávolít egy elemet ID alapján.
     * @param id - A törlendő elem azonosítója.
     */
    public removeEntry(id: string): void {
        this.entries = this.entries.filter(e => e.id !== id);
        this.notifyListeners();
    }

    /**
     * Eltávolít a győztes elemet ID alapján, shifteli a id-kat.
     * @param id - A törlendő elem azonosítója.
     */
    public removeWinnerEntry(id: string): void {
        this.entries = this.entries.filter(e => e.id !== id);
        this.entries.forEach((e, i) => e.entryNumber = i);
        this.notifyListeners();
    }

    /**
     * Végrehajtja a pörgetés logikáját (nyertes sorsolása, szög számítása).
     * @returns {SpinResult | null} A pörgetés eredménye, vagy null ha üres a kerék.
     */
    public spinWheel(): SpinResult | null {
        if (this.entries.length === 0) return null;
        const totalWeight = this.entries.reduce((s, e) => s + e.weight, 0);
        if (totalWeight <= 0) return null;

        const spinTarget = Math.random() * totalWeight;
        const sorted = [...this.entries].sort((a, b) => a.entryNumber - b.entryNumber);

        let startWeight = 0;
        let winningEntry: WheelEntry | null = null;
        let winningDeg = 0;

        //megtalálni a súlyok alapján a nyertest
        for (const entry of sorted) {
            const endWeight = startWeight + entry.weight;

            if (spinTarget >= startWeight && spinTarget < endWeight) {
                winningEntry = entry;

                winningDeg = (spinTarget / totalWeight) * 360;

                break;
            }
            startWeight = endWeight;
        }

        //ha épp 0-nál áll meg, az első nyert
        if (!winningEntry) {
            winningEntry = sorted[0];
        }

        const finalRotationDeg = 360 - winningDeg;

        const result: SpinResult = {
            spinId: this.generateSpinId(),
            rotation: finalRotationDeg,
            entries: [...sorted],
            winningEntry,
        };

        return result;
    }
}

export const wheelService = WheelService.getInstance();