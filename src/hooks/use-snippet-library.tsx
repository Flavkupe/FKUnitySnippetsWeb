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
    selectedFile: GithubFile | null;
    onSelectFile: (file: GithubFile) => void;
    hasPackageFile: boolean;
    downloadPackageFile: () => void;
}

interface Props {
    webGLReady: boolean;
}

export function useSnippetLibrary({webGLReady}: Props): SnippetLibraryValues {
    const [files, setFiles] = useState<GithubFile[]>([]);
    const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
    const [activeFile, setActiveFile] = useState<GithubFile | null>(null);
    const [selectedFile, setSelectedFile] = useState<GithubFile | null>(null);


    const onSelectFile = (file: GithubFile) => {
        setSelectedFile(file);
        const newCodeFiles = [{ filename: file.filename, code: file.fileContent }];
        for (const supportingFile of file.supportingFiles ?? []) {
            newCodeFiles.push({ filename: supportingFile.filename, code: supportingFile.fileContent });
        }

        setCodeFiles(newCodeFiles);
    }

    const activateFile = (file: GithubFile) => {
        setActiveFile(file);
    }

    const downloadPackageFile = () => {
        if (!selectedFile?.packageFileUrl || !selectedFile?.packageFileName) {
            return;
        }

        const link = document.createElement("a");
        link.href = selectedFile.packageFileUrl;
        link.download = selectedFile.packageFileName;
        link.click();
    }

    useEffect(() => {
        if (webGLReady && selectedFile != null) {
            activateFile(selectedFile);
        }
    }, [webGLReady, selectedFile]);

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

    const hasPackageFile = !!selectedFile?.packageFileUrl;

    return {
        files,
        codeFiles,
        activeFile,
        selectedFile,
        onSelectFile,
        hasPackageFile,
        downloadPackageFile,
    }
}