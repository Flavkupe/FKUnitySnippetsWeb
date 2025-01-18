import { useEffect, useState } from "react";
import { GithubFile } from "../models/github-files";

import allContents from "../library-content/library-content.json";

export interface SnippetLibraryValues {
    files: GithubFile[];
    code: string | null;
    activeFile: GithubFile | null;
    onSelectFile: (file: GithubFile) => void;
}

export function useSnippetLibrary(): SnippetLibraryValues {
    const [files, setFiles] = useState<GithubFile[]>([]);
    const [code, setCode] = useState<string | null>(null);
    const [activeFile, setActiveFile] = useState<GithubFile | null>(null);
    const onSelectFile = (file: GithubFile) => {
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

            setFiles(contents);
        }

        fetchFiles();
    }, []);

    return {
        files,
        code,
        activeFile,
        onSelectFile
    }
}