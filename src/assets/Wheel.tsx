import "../style/Wheel.css";
import { useRef, useEffect } from "preact/hooks";
import { WheelEntry } from "../services/WheelServices";

/**
 * A kerék megjelenítéséhez szükséges tulajdonságok.
 * @typedef {object} WheelProps
 * @property {number} rotationDeg - A kerék aktuális elforgatása fokban.
 * @property {Entry[]} entries - A keréken lévő bejegyzések listája.
 */
type WheelProps = {
  rotationDeg: number;
  entries: WheelEntry[];
};

/**
 * A vizuális szerencsekerék komponens.
 * Canvas segítségével rajzolja ki a cikkelyeket, a színeket és a feliratokat.
 * Két fázisban rajzol (Pass 1: háttér, Pass 2: szöveg) a megfelelő rétegrend érdekében.
 * @param {WheelProps} props - A kerékhez szükséges adatok.
 * @returns {JSX.Element} A kerék konténer és a canvas.
 */
export function Wheel({ rotationDeg, entries }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const size = 320;
  const borderWidth = 6;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - borderWidth;

    const totalWeight = entries.reduce((s, e) => s + e.weight, 0);
    if (totalWeight <= 0) return;

    let startAngle = -Math.PI / 2;

    entries
      .sort((a, b) => a.entryNumber - b.entryNumber)
      .forEach((entry) => {

        //az entry cikk belső szöge
        const sliceAngle = (entry.weight / totalWeight) * 2 * Math.PI;

        //canvas rajzolóval cikk felrajzolása
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = entry.color || "#888";
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000ff";
        ctx.stroke();

        startAngle += sliceAngle;
      });



    startAngle = -Math.PI / 2;

    entries
      .sort((a, b) => a.entryNumber - b.entryNumber)
      .forEach((entry) => {

        //feliratok felrajzolása
        const sliceAngle = (entry.weight / totalWeight) * 2 * Math.PI;
        const midAngle = startAngle + sliceAngle / 2;

        //felirat poziciója
        const textX = cx + Math.cos(midAngle) * (radius * 0.75);
        const textY = cy + Math.sin(midAngle) * (radius * 0.75);

        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(midAngle + Math.PI / 2);

        ctx.font = "bold 0.8rem sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
        ctx.lineJoin = "round";
        ctx.strokeText(entry.name, 0, 0, radius * 0.5);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(entry.name, 0, 0, radius * 0.5);

        ctx.restore();

        startAngle += sliceAngle;
      });

  }, [entries]);

  return (
    <div class="WheelContainer">

      <div class="WheelPointer"></div>
      <div
        class="Wheel"
        style={{ transform: `rotate(${rotationDeg}deg)` }}
      >
        <canvas ref={canvasRef} width={size} height={size} />
      </div>
      <div class="WheelHub">
        DT
      </div>
    </div>
  );
}