import { ButtonIcon } from "../assets/ButtonIcon";
import { LogList } from "../assets/LogList";

/**
 * A jobb oldali panel komponens.
 * Tartalmazza a statisztikákat és a pörgetési naplót (LogList).
 * Mobil nézetben 'Back' gombbal rendelkezik.
 * @param {object} props - A komponens tulajdonságai.
 * @param {() => void} [props.onBack] - Opcionális visszalépés eseménykezelő (mobil nézethez).
 * @returns {JSX.Element} A jobb oldali panel.
 */
export function RightPane({ onBack }: { onBack?: () => void }) {
  return (
    <div className="RightPane pane">
      {onBack && (
        <div className="back-button-top">
          <ButtonIcon icon="arrow_back" label="Back" onClick={onBack} />
        </div>
      )}
      <h3>Statistics</h3>
      <LogList />
    </div>
  );
}
