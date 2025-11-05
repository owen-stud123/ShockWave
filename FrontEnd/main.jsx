import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Correct the path to the CSS file
import './styles/index.css' 
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)