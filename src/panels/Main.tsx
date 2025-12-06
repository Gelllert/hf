import { useState, useEffect } from "react";
import { LeftPane } from "./LeftPane";
import { RightPane } from "./RightPane";
import { MainPane } from "./MainPane";
import { ButtonIcon } from "../assets/ButtonIcon";
import "../style/Main.css";

type ActivePane = "none" | "left" | "right";

/**
 * Az alkalmazás fő elrendezését (layout) kezelő komponens.
 * Felelős a reszponzív viselkedésért: figyeli az ablakméretet és annak megfelelően
 * jeleníti meg a paneleket (Left, Main, Right) egymás mellett vagy külön nézetben.
 * Kezeli a navigációt a panelek között kis képernyőn.
 * @returns {JSX.Element} Az alkalmazás fő kerete.
 */
export function Main() {
  const [activePane, setActivePane] = useState<ActivePane>("none");
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const isL1 = width >= 1500;
  const isL2 = width < 1500 && width >= 1100;
  const isL3 = width < 1100;

  const back = () => setActivePane("none");

  return (
    <div className="MainLayout">

      {/* ---------------- HEADER ---------------- */}
      <div className="Header">
        <div className="TopButtons">
          {isL2 && activePane === "none" && (
            <ButtonIcon icon="bar_chart" label="Stats" onClick={() => setActivePane("right")} />
          )}

          {isL3 && activePane === "none" && (
            <>
              <ButtonIcon icon="inventory" label="Items" onClick={() => setActivePane("left")} />
              <ButtonIcon icon="bar_chart" label="Stats" onClick={() => setActivePane("right")} />
            </>
          )}
          {(isL3 || isL2) && activePane !== "none" && (
            <ButtonIcon icon="arrow_back" label="Back" onClick={back} />
          )}
        </div>
      </div>

      {/* ------------------- CONTENT ------------------- */}
      <div className="ContentArea">
        {/* DESKTOP LAYOUT */}
        {isL1 && (
          <>
            <LeftPane />
            <div className="MainContent"><MainPane /></div>
            <RightPane />
          </>
        )}

        {/* TABLET LAYOUT left*/}
        {isL2 && (activePane === "none" || activePane === "left") && (
          <>
            <LeftPane />
            <div className="MainContent"><MainPane /></div>
          </>
        )}

        {/* TABLET LAYOUT right*/}
        {isL2 && activePane === "right" && (
          <>
            <div className="MainContent"><MainPane /></div>
            <RightPane />
          </>
        )}

        {/* PHONE LAYOUT main*/}
        {isL3 && activePane === "none" && (
          <div className="MainContent"><MainPane /></div>
        )}

        {/* PHONE LAYOUT left*/}
        {isL3 && activePane === "left" && <LeftPane/>}

        {/* PHONE LAYOUT right*/}
        {isL3 && activePane === "right" && <RightPane/>}
      </div>
    </div>
  );
}
