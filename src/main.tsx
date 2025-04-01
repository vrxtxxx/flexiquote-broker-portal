
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure the root element exists before rendering
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  createRoot(rootElement).render(<App />);
}
