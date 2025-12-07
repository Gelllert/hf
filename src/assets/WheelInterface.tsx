import { useEffect, useState } from "preact/hooks";
import { ButtonIcon } from "./ButtonIcon";
import { wheelService } from "../services/WheelServices";
import { Wheel } from "./Wheel";
import { logService } from "../services/LogService";
import "../style/WheelInterface.css";

/**
 * A fő felület komponens, ami összeköti a vizuális kereket (Wheel) a logikával.
 * Felelős a pörgetési folyamat vezérléséért (state), a forgásszög számításáért, 
 * az eredmények kezeléséért (nyertes hirdetés, elimináció) és a logolásért.
 * @returns {JSX.Element} A kerék interfész teljes UI eleme (kerék + vezérlők).
 */
export function WheelInterface() {
    const [rotation, setRotation] = useState(0);
    const [state, setState] = useState<"idle" | "reset" | "spinning" | "finished">("idle");
    const [winner, setWinner] = useState(null);
    const [eliminate, setEliminate] = useState(false);
    const [entries, setEntries] = useState(wheelService.getEntries());


    useEffect(() => {
        const listener = () => setEntries([...wheelService.getEntries()]);
        wheelService.addListener(listener);
        return () => wheelService.removeListener(listener);
    }, []);

    /**
     * A pörgetés és idő kezelését végző aszinkron függvény.
     */
    async function spin() {
        if (state !== "idle") return;

        setState("reset");
        setWinner(null);
        wheelService.setIsSpinning(true);
        
        await new Promise(res => setTimeout(res, 100));

        const result = wheelService.spinWheel();

        if (!result || !result.winningEntry) {
            setState("idle");
            wheelService.setIsSpinning(false);
            return;
        }

        //Pörgetési szög és animáció számítása:
        //1: Aktuális pozíció normalizálása (hol állunk a körön belül).
        const currentRotationMod = rotation % 360;

        //2: Távolság kiszámítása a következő 0 fokig (hogy ne forogjon visszafelé).
        const distanceToNextCircle = (360 - currentRotationMod) % 360;

        //3: Extra pörgetések hozzáadása (360 fok többszöröse, tehát a végeredmény szempontjából nem számít)
        const extraSpins = Math.floor(Math.random() * 5 + 5) * 360;
        
        //4: Végső szög összeállítása: jelenlegi + kifutás + cél szög + extra körök.
        const finalDeg = rotation + distanceToNextCircle + result.rotation + extraSpins;



        setState("spinning");
        setRotation(finalDeg);

        await new Promise(res => setTimeout(res, 3100));

        if (eliminate && result.winningEntry) {
            wheelService.removeWinnerEntry(result.winningEntry.id);
        }

        if (result.winningEntry) {
            logService.addLog(result.winningEntry.name, eliminate, entries);
        }

        setWinner(result.winningEntry);
        setState("finished");
        wheelService.setIsSpinning(false);
    }

    function reset() {
        if (state === "spinning") return;
        setWinner(null);
        setState("idle");
        wheelService.setIsSpinning(false);
    }

    return (
        <div class="WheelInterface">

            <Wheel rotationDeg={rotation} entries={entries} />

            <div class="WheelControls">
                {state === "idle" && <ButtonIcon icon="rotate_right" onClick={spin} label="Spin" variant="spin"/>}
                {state === "reset" && <div>Reseting…</div>}
                {state === "spinning" && <div>Spinning…</div>}
                {state === "finished" && (
                    <ButtonIcon icon="check_circle" label={`Winner: ${winner?.name}`} onClick={reset} variant="spin"/>
                )}

                <label class="elim-toggle">
                    <input
                        type="checkbox"
                        checked={eliminate}
                        onInput={() => setEliminate(!eliminate)}
                    />
                    Elimination mode
                </label>
            </div>


        </div>
    );
}