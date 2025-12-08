import { render } from 'preact';
import { Main } from './panels/Main';		
import './style.css';
import "./Pwa"

/**
 * A LuckyWheel alkalmazás fő komponense.
 * Megjeleníti az alkalmazás fő elrendezését (3 panel: bal, középső, jobb).
 * @returns {JSX.Element} Az alkalmazás gyökér komponense, amely tartalmazza a Main panelt.
 */
export function App() {
  return <Main />;
}
render(<App />, document.getElementById('app'));
