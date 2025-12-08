import { ButtonIcon } from "./ButtonIcon";
import "../style/EntryListItem.css";
import { WheelEntry } from "../services/WheelServices";

/**
 * Az EntryListItem komponens tulajdonságai.
 * @property {WheelEntry} entry - A megjelenítendő kerék bejegyzés objektum.
 * @property {number} percent - A bejegyzés nyerési esélye százalékban.
 * @property {number} weight - A bejegyzés súlya.
 * @property {() => void} onDelete - Eseménykezelő a törlés gombra kattintáskor.
 * @property {boolean} isSpinning - A kerék forgásának állapota (true ha forog).
 */
interface EntryListItemProps {
    entry: WheelEntry;
    percent: number;
    weight: number;
    onDelete: () => void;
    isSpinning: boolean;
}

/**
 * Egyetlen bejegyzés sora a szerkesztő listában.
 * Megjeleníti a nevet, a súlyt, az esélyszázalékot és a törlés gombot.
 * A gomb letiltott, ha éppen forog a kerék.
 * @param {EntryListItemProps} props - A komponens tulajdonságai.
 * @returns {JSX.Element} A lista elem UI reprezentációja.
 */
export function EntryListItem({ entry, percent, weight, onDelete, isSpinning }: EntryListItemProps) {
    return (
        <div class="EntryListItem" style={{ "--entry-color": entry.color }}>

            <div class="EntryName">
                <span class="EntrySpan">{entry.name}</span>
            </div>

            <div class="EntryPercent">
                <span class="PercentSpan">{percent.toFixed(1)}% / w: {weight}</span>
            </div>


            <div class="EntryButtons">
                <ButtonIcon icon="delete" onClick={onDelete} variant="delete" disabled={isSpinning}/>
            </div>

        </div>
    );
}