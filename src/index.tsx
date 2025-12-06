import { render } from 'preact';
import { Main } from './panels/Main';		
import './style.css';
import "./Pwa"

/**
 * 
 * @returns Fő program, ami tartalmazza a 3 rész lapot.
 */
export function App() {
  return <Main />;
}
render(<App />, document.getElementById('app'));
