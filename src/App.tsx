import { Routes, Route } from 'react-router-dom'
import './App.css'
import { PageHeader } from './components/header/page-header'
import { HomePage } from './pages/home-page'
import { LibraryPage } from './pages/library-page'

function App() {
  return (
    <div className="App">
        <header className="App-header">
            <PageHeader />
        </header>
        <main>
          <Routes>
            <Route path={`/`} element={<HomePage />}/>
            <Route path={`/library`} element={<LibraryPage />}/>
            <Route path={`/library/:itemId`} element={<LibraryPage />} />
          </Routes>
        </main>
    </div>
  )
}

export default App
