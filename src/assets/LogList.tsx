import { LogEntry } from "../services/LogService";
import { LogListItem } from "./LogListItem";
import { logService } from "../services/LogService";
import { useState, useEffect } from "preact/hooks";
import "../style/LogList.css";

/**
 * Az alkalmazásban történt pörgetések listáját megjelenítő komponens.
 * Kezeli a logok betöltését a szolgáltatásból (LogService) és a lista frissítését.
 * Tartalmazza a logok törlésére szolgáló gombot is.
 * * @returns {JSX.Element} A Log lista és a törlés gomb konténere.
 */
export function LogList() {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const refreshLogs = () => {
        setLogs(logService.loadLogs());
    };

    useEffect(() => {
        refreshLogs();

        logService.addListener(refreshLogs);

        return () => logService.removeListener(refreshLogs);
    }, []);

    const handleClearLogs = () => {
        if (confirm("Logs will be deleted permanently")) {
            logService.clearLogs();
        }
    };


    if (logs.length === 0) {
        return (
            <div class="LogListEmpty">
                . . .
            </div>
        );
    }

    return (
        <div class="LogListContainer">
            <button class="ClearLogsButton" onClick={handleClearLogs}>
                DELETE LOGS
            </button>

            <ul class="LogList">
                {logs.map(log => (
                    <LogListItem key={log.id} log={log} />
                ))}
            </ul>
        </div>
    );
}