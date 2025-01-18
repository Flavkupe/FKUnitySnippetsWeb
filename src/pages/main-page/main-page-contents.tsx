import { WebGLEmbed } from "../../components/webgl-embed";
import { useEffect, useState } from "react";
import axios from "axios";
import { GithubAccessibleFile, GithubFile } from "../../models/github-files";
import { FileNav } from "../../components/file-nav";
import { CodeBox } from "../../components/code-box";

const validFolders = [
    "Transformations",
    "Text/TMPro",
]

export function MainPageContents() {
    const [files, setFiles] = useState<GithubAccessibleFile[]>([]);
    const [code, setCode] = useState<string | null>(null);
    const [activeFile, setActiveFile] = useState<GithubAccessibleFile | null>();
    const onClickFile = (file: GithubAccessibleFile) => {
        setActiveFile(file);
        fetchCode(file);
    }

    const fetchCode = async (file: GithubAccessibleFile) => {
        const response = await axios.get<string>(
            file.download_url,
        );

        if (response == null || response.status !== 200) {
            console.log("Error with response", response);
            return;
        }

        setCode(response.data);
    }

    useEffect(() => {
        const fetchFiles = async () => {
            const newFiles: GithubAccessibleFile[] = [];
            for (const folder of validFolders) {       
                const response = await axios.get<GithubFile[]>(
                `https://api.github.com/repos/Flavkupe/FKUnitySnippetsLibrary/contents/FKUnitySnippetsLibrary/${folder}`
                );

                if (response == null || response.status !== 200) {
                    console.log("Error with response", response);
                    continue;
                }

                const results = response.data;
                
                for (const file of results) {
                    if (!file.name.endsWith(".cs")) {
                        continue;
                    }

                    const trimmedName = file.name.slice(0, file.name.length - 3);
                    newFiles.push({
                        ...file,
                        displayName: trimmedName,
                        componentName: trimmedName,
                    })
                }
            }

            setFiles(newFiles);
        }

        fetchFiles();
    }, []);

    return (
        <div className="main-page-container">
            <nav className="left-nav">
                <FileNav files={files} onClickFile={onClickFile}/>
            </nav>
            <div className="content">
                <WebGLEmbed activeFile={activeFile?.componentName ?? null} />
                <CodeBox code={code}/>
            </div>
        </div>
    )
}