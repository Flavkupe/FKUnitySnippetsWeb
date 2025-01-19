import { useEffect, useState } from "react";
import { GithubFile } from "../models/github-files";

import allContents from "../library-content/library-content.json";

export interface CodeFile {
    filename: string;
    code: string;
}

export interface SnippetLibraryValues {
    files: GithubFile[];
    codeFiles: CodeFile[] ;
    activeFile: GithubFile | null;
    onSelectFile: (file: GithubFile) => void;
}

export function useSnippetLibrary(): SnippetLibraryValues {
    const [files, setFiles] = useState<GithubFile[]>([]);
    const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
    const [activeFile, setActiveFile] = useState<GithubFile | null>(null);
    const onSelectFile = (file: GithubFile) => {
        setActiveFile(file);
        
        const newCodeFiles = [{ filename: file.filename, code: file.fileContent }];
        for (const supportingFile of file.supportingFiles ?? []) {
            newCodeFiles.push({ filename: supportingFile.filename, code: supportingFile.fileContent });
        }

        setCodeFiles(newCodeFiles);
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
        codeFiles,
        activeFile,
        onSelectFile
    }
}