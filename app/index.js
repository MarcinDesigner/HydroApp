// Plik: index.js
import { registerRootComponent } from 'expo';
import App from './App';  // Upewnij się, że ścieżka jest poprawna

console.log("Rejestrowanie komponentu głównego");
registerRootComponent(App);