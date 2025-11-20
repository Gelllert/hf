import { render } from 'preact';
import { Main } from './panels/Main';		
import './style.css';
import "./Pwa"
/**
 * Fő applikáció
 * @returns {JSXInternal.Element} A main eleme, ami összefogja a különböző pane-ket
 */
export function App() {
  return <Main />;
}
render(<App />, document.getElementById('app'));
