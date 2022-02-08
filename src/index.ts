import './style.css';
import { updateStateGarage, listeners } from './ui';
import { renderHTML } from './components/renderHTML';

renderHTML();
await updateStateGarage();
listeners();
