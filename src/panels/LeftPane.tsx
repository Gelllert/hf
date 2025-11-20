import { ButtonIcon } from "../assets/ButtonIcon";
import { AddEntryBar } from "../assets/AddEntryBar";
import { EntryList } from "../assets/EntryList";

/**
 * A bal oldali panel komponens.
 * Tartalmazza a bejegyzés hozzáadó sávot (AddEntryBar) és a bejegyzések listáját (EntryList).
 * Mobil nézetben 'Back' gombbal rendelkezik.
 * @param {object} props - A komponens tulajdonságai.
 * @param {() => void} [props.onBack] - Opcionális visszalépés eseménykezelő (mobil nézethez).
 * @returns {JSX.Element} A bal oldali panel.
 */
export function LeftPane({ onBack }: { onBack?: () => void }) {
  return (
    <div className="LeftPane pane">
      {onBack && (
        <div className="back-button-top">
          <ButtonIcon icon="arrow_back" label="Back" onClick={onBack} />
        </div>
      )}
      <h3>Wheel Entries</h3>
      <AddEntryBar />
      <EntryList />
    </div>
  );
}
