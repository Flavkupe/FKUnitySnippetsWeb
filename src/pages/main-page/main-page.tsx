import { MainPageContents } from "./main-page-contents";
import { MainPageHeader } from "./main-page-header";


export function MainPage() {
    return (
        <>
            <header className="App-header">
                <MainPageHeader />
            </header>
            <main>
                <MainPageContents />
            </main>
        </>
    )
}
