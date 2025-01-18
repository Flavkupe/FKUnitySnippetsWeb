import './App.css'
import { PageHeader } from './components/page-header'
import { MainPage } from './pages/main-page'

function App() {
  return (
    <div className="App">
        <header className="App-header">
            <PageHeader />
        </header>
        <main>
            <MainPage />
        </main>
    </div>
  )
}

export default App
