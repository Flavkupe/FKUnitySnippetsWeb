import { CodeBox } from "../components/code-box";
import { FileNav } from "../components/file-nav";
import { WebGLEmbed } from "../components/webgl-embed";
import { useLibraryContext } from "../hooks/use-library-context";

export function MainPage() {
    const { files, code, activeFile, onSelectFile } = useLibraryContext();

    return (
        <div className="main-page-container">
            <nav className="left-nav">
                <FileNav files={files} onClickFile={onSelectFile} currentSelection={activeFile}/>
            </nav>
            <div className="content">
                <h2 style={{padding: "10px", width: "300px"}}>{activeFile?.name}</h2>
                <WebGLEmbed activeFile={activeFile?.name ?? null} />
                <CodeBox code={code}/>
            </div>
        </div>
    )
}
