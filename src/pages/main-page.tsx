import { CodeBox } from "../components/code-box/code-box";
import { FileNav } from "../components/file-nav/file-nav";
import { ResourcesBox } from "../components/resources-box/resources-box";
import { WebGLEmbed } from "../components/webgl-embed/webgl-embed";
import { useLibraryContext } from "../hooks/use-library-context";

export function MainPage() {
    const { files, codeFiles: code, activeFile, selectedFile, onSelectFile } = useLibraryContext();

    return (
        <div className="main-page-container">
            <nav className="left-nav">
                <FileNav files={files} onClickFile={onSelectFile} currentSelection={selectedFile}/>
            </nav>
            <div className="content">
                <div className="top-content">
                    <WebGLEmbed activeFile={activeFile?.demoName ?? null} />
                    <ResourcesBox />
                </div>
                <h2 style={{padding: "10px", width: "300px"}}>{activeFile?.name}</h2>
                {code.map((codeFile) => (
                    <CodeBox key={codeFile.filename} filename={codeFile.filename} code={codeFile.code} />
                ))}
            </div>
        </div>
    )
}
