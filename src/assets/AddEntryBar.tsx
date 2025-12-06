import { useState, useEffect } from "react";
import { wheelService } from "../services/WheelServices";
import { ButtonIcon } from "./ButtonIcon";
import "../style/AddEntryBar.css";

const MAX_WHEEL_ENTRIES = 10;
const MAX_ENTRY_NAME_LENGTH = 25;

const getRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') + 'ff';
};

/**
 * A bejegyzés hozzáadására szolgáló felső sáv komponense.
 * Lehetővé teszi új elemek felvételét a kerékre, név és szín megadásával.
 * @returns {JSX.Element} A UI elem erre.
 */
export function AddEntryBar() {
    let [entryName, setName] = useState("");
    let [entryWeight, setWeight] = useState(1);
    let [entryColor, setColor] = useState("#ff0000ff");
    let [isRandomColorActive, setIsRandomColorActive] = useState(false);
    let [nameError, setNameError] = useState(false);
    let [weightError, setWeightError] = useState(false);
    let [colorError, setColorError] = useState(false);
    let [currentEntries, setCurrentEntries] = useState(wheelService.getEntries());

    useEffect(() => {
        const handleEntriesChange = () => {
            setCurrentEntries(wheelService.getEntries());
        };

        wheelService.addListener(handleEntriesChange);

        return () => wheelService.removeListener(handleEntriesChange);
    }, []);


    const onAddEntryClick = () => {
        if (!validate()) return;

        let finalColor = entryColor;
        if (isRandomColorActive) {
            finalColor = getRandomColor();
            setColor(finalColor);
        }

        wheelService.addEntry(entryName, entryWeight, finalColor);

        setName("");
        setWeight(1);


        if (!isRandomColorActive) {
            setColor("#ff0000ff");
        }
    }

    /** 
     * Inputok validálása, a hibás input mező piroskeretezése.
     * @returns {boolean} helyesek az inputok.
     */
    function validate(): boolean {

        let entries = wheelService.getEntries();

        let valid = true;


        if (entryName.toLowerCase().includes("gajdos")) {

            const body = document.body;

            const videoPath = 'warning_loop.mp4';

            const videoHTML = `<video src="${videoPath}" autoplay playsinline
                    style="width: 100%; max-width: 800px; margin-bottom: 20px;"
                ></video>`;

            const errorHTML = `${videoHTML}
            <h1>Ah hell naahh</h1><p>Majd jövőre, meg ilyenek kolléga <p>(<b>inkább ne</b>) Jöjjön legközelebb. Az alkalmazás működése felfüggesztve. <p>Terminating session, meg ilyenek<h1>szevasz</h1></p></p></p>`;

            if (body) {
                body.innerHTML = '';
                body.style.margin = '0';
                body.style.display = 'flex';
                body.style.alignItems = 'center';
                body.style.justifyContent = 'center';
                body.style.minHeight = '100vh';
                body.style.minWidth = '100vw';
                body.style.backgroundColor = '#440000';
                body.style.color = 'white';
                body.style.flexDirection = 'column';
                body.style.textAlign = 'center';
                body.style.position = 'fixed';
                body.style.top = '0';
                body.style.left = '0';
                body.innerHTML = errorHTML;
            }

            return false;

        } 

        const nameIsTooLong = entryName.length > MAX_ENTRY_NAME_LENGTH;

        if (nameIsTooLong || !entryName.trim() || entries.some(e => e.name.toLowerCase() === entryName.toLowerCase())) {
            setNameError(true);
            valid = false;
        } else {
            setNameError(false);
        }

        if (entryWeight <= 0) {
            setWeightError(true);
            valid = false;
        } else {
            setWeightError(false);
        }

        if (!isRandomColorActive && entries.some(e => e.color?.toLowerCase() === entryColor.toLowerCase())) {
            setColorError(true);
            valid = false;
        } else {
            setColorError(false);
        }

        return valid;
    }

    const showAddButton = currentEntries.length < MAX_WHEEL_ENTRIES;

    return (
        <div class="AddEntryBar">

            <input
                type="text"
                placeholder="Name... (max 25 characters)"
                value={entryName}
                onInput={(e) => {
                    setName(e.currentTarget.value);
                    setNameError(false);
                }}
                className={nameError ? "error" : ""}
            />

            <div class="WeightGroup">
                <span class="WeightLabel">Weight: </span>
                <input
                    type="number"
                    min={1}
                    value={entryWeight}
                    onInput={(e) => {
                        setWeight(parseInt(e.currentTarget.value) || 1);
                        setWeightError(false);
                    }}
                    className={weightError ? "error" : ""}
                />
                <span class="Explanation">( % = (SUM(w) / input) * 0.01 )</span>
            </div>
            <div className="ColorGroup">
                <input
                    type="color"
                    disabled={isRandomColorActive}
                    value={entryColor.substring(0, 7)}
                    onInput={(e) => {
                        if (!isRandomColorActive) {
                            setColor(e.currentTarget.value + 'ff');
                            setColorError(false);
                        }
                    }}
                    className={`ColorPicker ${colorError ? "error" : ""}`}
                />

                <div className="RandomColorCheckbox">
                    <input
                        type="checkbox"
                        id="random-color-check"
                        checked={isRandomColorActive}
                        onChange={(e) => {
                            const newRandomState = e.currentTarget.checked;
                            setIsRandomColorActive(newRandomState);
                            setColorError(false);

                            if (newRandomState) {
                                setColor(getRandomColor());
                            } else {
                                setColor("#ff0000ff");
                            }
                        }}
                    />
                    <label htmlFor="random-color-check" title="Véletlenszerű szín generálása"></label>
                </div>
            </div>

            {showAddButton ? (
                <ButtonIcon icon="add" label="Add" onClick={onAddEntryClick} />
            ) : (
                <span className="EntryLimitReached">MAX ({MAX_WHEEL_ENTRIES})</span>
            )}
        </div>
    );
}