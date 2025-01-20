import { CodeBox } from "../components/code-box/code-box";
import { FileNav } from "../components/file-nav/file-nav";
import { MarkdownBox } from "../components/markdown-box/markdown-box";
import { ResourcesBox } from "../components/resources-box/resources-box";
import { WebGLEmbed } from "../components/webgl-embed/webgl-embed";
import { useLibraryContext } from "../hooks/use-library-context";

export function MainPage() {
    const { files, codeFiles: code, docFile, activeFile, selectedFile, onSelectFile } = useLibraryContext();

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
                {!!docFile && <MarkdownBox codeFile={docFile} /> }
                {code.map((codeFile) => (
                    <CodeBox key={codeFile.filename} codeFile={codeFile} />
                ))}
            </div>
        </div>
    )
}
