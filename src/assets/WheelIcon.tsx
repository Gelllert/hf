import { WheelEntry } from "../services/WheelServices";
import { useRef, useEffect } from "preact/hooks";

/**
 * A miniatűr kerékikon tulajdonságai.
 * @typedef {object} WheelIconProps
 * @property {Entry[]} entries - A kerék bejegyzései a kirajzoláshoz.
 * @property {number} [size] - Az ikon mérete pixelben (alapértelmezett: 40).
 */
type WheelIconProps = {
    entries: WheelEntry[];
    size?: number;
};


/**
 * Egy statikus, miniatűr kerék ikon kirajzolása Canvas segítségével.
 * A naplóban (LogList) használatos a pörgetéskori állapot megjelenítésére.
 * @param {WheelIconProps} props - A komponens tulajdonságai.
 * @returns {JSX.Element} A canvas alapú ikon.
 */
export function WheelIcon({ entries, size = 40 }: WheelIconProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, size, size);

        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2;

        const totalWeight = entries.reduce((s, e) => s + e.weight, 0);
        if (totalWeight <= 0) return;

        let startAngle = -Math.PI / 2;

        entries
            .sort((a, b) => a.entryNumber - b.entryNumber)
            .forEach((entry) => {
                const sliceAngle = (entry.weight / totalWeight) * 2 * Math.PI;

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = entry.color || "#888";
                ctx.fill();

                startAngle += sliceAngle;
            });
    }, [entries, size]);

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            style={{ borderRadius: '50%', flexShrink: 0, width: `${size}px`, height: `${size}px` }}
        />
    );
}