import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { captureAttribution } from './utils/attribution'

captureAttribution();

createRoot(document.getElementById("root")!).render(<App />);
