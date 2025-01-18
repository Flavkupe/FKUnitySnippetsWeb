import { WebGLEmbed } from "../../components/webgl-embed";
import { useEffect, useState } from "react";
import { GithubFile } from "../../models/github-files";
import { FileNav } from "../../components/file-nav";
import { CodeBox } from "../../components/code-box";

import allContents from "../../library-content/library-content.json";

export function MainPageContents() {
    const [files, setFiles] = useState<GithubFile[]>([]);
    const [code, setCode] = useState<string | null>(null);
    const [activeFile, setActiveFile] = useState<GithubFile | null>();
    const onClickFile = (file: GithubFile) => {
        setActiveFile(file);
        setCode(file.fileContent);
    }

    useEffect(() => {
        const fetchFiles = async () => {

            const contents = allContents as GithubFile[];
            if (contents == null) {
                console.log("error parsing contents");
                setFiles([]);
                return;
            }

            console.log(contents);
            setFiles(contents);
        }

        fetchFiles();
    }, []);

    return (
        <div className="main-page-container">
            <nav className="left-nav">
                <FileNav files={files} onClickFile={onClickFile}/>
            </nav>
            <div className="content">
                <WebGLEmbed activeFile={activeFile?.name ?? null} />
                <CodeBox code={code}/>
            </div>
        </div>
    )
}