import { Routes, Route } from 'react-router-dom'
import './App.css'
import { PageHeader } from './components/header/page-header'
import { HomePage } from './pages/home-page'
import { LibraryPage } from './pages/library-page'
import { ROOT_PATH } from './constants/constants'



function App() {
  return (
    <div className="App">
        <header className="App-header">
            <PageHeader />
        </header>
        <main>
          <Routes>
            <Route path={`/${ROOT_PATH}/`} element={<HomePage />}/>
            <Route path={`/${ROOT_PATH}/library`} element={<LibraryPage />}/>
            <Route path={`/${ROOT_PATH}/library/:itemId`} element={<LibraryPage />} />
          </Routes>
        </main>
    </div>
  )
}

export default App
