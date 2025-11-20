import { LogEntry } from "../services/LogService";
import { WheelIcon } from "./WheelIcon";

/**
 * @typedef {object} LogListItemProps
 * @property {LogEntry} log - Egyetlen napló bejegyzés objektum, amely tartalmazza a pörgetés adatait.
 */
type LogListItemProps = {
    log: LogEntry;
};

const LOG_WHEEL_SIZE = 60;

export function LogListItem({ log }: LogListItemProps) {
    const winnerName = log.winnerName;
    const winnerIconName = log.eliminated ? 'skull' : 'trophy';
    const winnerIconColor = log.eliminated ? '#ff0000ff' : '#ffd700'
    const winnerIconFontSize = '16px';
    const formattedDate = new Date(log.timestamp).toLocaleString('hu-HU', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });


    return (
        <li class="LogListItem">
            <WheelIcon entries={log.entriesAtSpin} size={LOG_WHEEL_SIZE} />
            <div class="LogDetails">
                <p>
                    <strong>Spin ID: {log.id}</strong> ({formattedDate})
                </p>
                <div class="LogEntriesList">
                    {log.entriesAtSpin
                        .map(entry => {
                            const isWinner = entry.name === winnerName;
                            const tagClassName = isWinner
                                ? log.eliminated ? 'tag-eliminated' : 'tag-winner'
                                : '';

                            const tagIcon = isWinner
                                ? <span
                                    class="material-symbols-outlined"
                                    style={{ fontSize: winnerIconFontSize, color: winnerIconColor }}>
                                    {winnerIconName}
                                </span>
                                : null;

                            return (
                                <span key={entry.id} class={`LogEntryTag ${tagClassName}`}>
                                    <span
                                        class="ColorDot"
                                        style={{ backgroundColor: entry.color }}
                                    />

                                    {entry.name}
                                    {tagIcon}
                                </span>
                            );
                        })}
                </div>
            </div>
        </li>
    );
}