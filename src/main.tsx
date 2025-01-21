import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LibraryContextProvider } from './hooks/use-library-context.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LibraryContextProvider>
      <App />
      </LibraryContextProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
