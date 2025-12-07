import { useEffect, useState } from "preact/hooks";
import { wheelService } from "../services/WheelServices";
import { EntryListItem } from "./EntryListItem";
import "../style/EntryList.css";

/**
 * A kerék bejegyzéseit listázó komponens.
 * Figyeli a WheelService változásait és megjeleníti az elemeket, valamint a százalékos esélyeiket.
 * @returns {JSX.Element} A bejegyzések listája.
 */
export function EntryList() {

    const [entries, setEntries] = useState(wheelService.getEntries());
    const [isSpinning, setIsSpinning] = useState(wheelService.getIsSpinning());

    useEffect(() => {
        const listener = () => {
            setEntries([...wheelService.getEntries()]);
            setIsSpinning(wheelService.getIsSpinning());
        };

        wheelService.addListener(listener);
        return () => wheelService.removeListener(listener);
    }, []);

    const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);

    return (
        <div class="EntryList">
            {entries.length === 0 && <div class="NoEntries">...</div>}
            {entries.map(entry => {
                const percent = totalWeight > 0
                    ? (entry.weight / totalWeight) * 100
                    : 0;

                return (
                    <EntryListItem
                        key={entry.id}
                        entry={entry}
                        percent={percent}
                        weight={entry.weight}
                        onDelete={() => wheelService.removeEntry(entry.id)}
                        isSpinning={isSpinning}
                    />
                );
            })}
        </div>
    );
}