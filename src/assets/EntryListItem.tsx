import { ButtonIcon } from "./ButtonIcon";
import "../style/EntryListItem.css";

/**
 * Egyetlen bejegyzés sora a szerkesztő listában.
 * Megjeleníti a nevet, a súlyt, az esélyszázalékot és a törlés gombot.
 * * @param {object} props - A komponens tulajdonságai.
 * @param {Entry} props.entry - A megjelenítendő bejegyzés objektum.
 * @param {number} props.percent - A bejegyzés nyerési esélye százalékban.
 * @param {number} props.weight - A bejegyzés súlya.
 * @param {() => void} props.onDelete - Eseménykezelő a törlés gombra kattintáskor.
 * @returns {JSX.Element} A lista elem UI reprezentációja.
 */
export function EntryListItem({ entry, percent, weight, onDelete, isSpinning }) {
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