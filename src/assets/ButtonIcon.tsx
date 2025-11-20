import "../style/ButtonIcon.css"

/**
 * A gomb komponens tulajdonságainak definíciója.
 * @typedef {object} ButtonIcon
 * @property {string} icon - A Material Symbols ikon neve (pl. 'add', 'delete').
 * @property {string} [label] - Opcionális szöveg a gombhoz.
 * @property {() => void} onClick - Eseménykezelő a kattintáshoz.
 */
export type ButtonIcon = {
    icon: string;
    label?: string;
    onClick: () => void;
}
/**
 * Egy ikon és szöveg alkotta gomb.
 * @param icon megjelenített googlefont ikon.
 * @param label szöveg a gomb mellett.
 * @param onClick gomb viselkedése, a button onClick eseménye. 
 * @returns 
 */
export function ButtonIcon({ icon, label, onClick }: ButtonIcon) {
    return (
        <button type="button" class="ButtonIcon" onClick={onClick}>
            <span class="material-symbols-outlined">{icon}</span>
            {label && <span class="ButtonIconLabel">{label}</span>}
        </button>
    );
}