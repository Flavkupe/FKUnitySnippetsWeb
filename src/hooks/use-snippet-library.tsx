import { useEffect, useState } from "react";
import { GithubFile } from "../models/github-files";

import allContents from "../library-content/library-content.json";
import { useNavigate } from "react-router";
import { ROOT_PATH } from "../constants/constants";



export interface CodeFile {
    filename?: string;
    code: string;
    type: 'cs' | 'md';
}

export interface SnippetLibraryValues {
    files: GithubFile[];
    codeFiles: CodeFile[] ;
    docFile: CodeFile | null;
    activeFile: GithubFile | null;
    selectedFile: GithubFile | null;
    onSelectFile: (file: GithubFile) => void;
    hasPackageFile: boolean;
    downloadPackageFile: () => void;
    updateControls: (newControls: string[]) => void;
    controls: string[];
    selectLibraryPage: (pageName: string) => void;
}

interface Props {
    webGLReady: boolean;
}

export function useSnippetLibrary({webGLReady}: Props): SnippetLibraryValues {
    const [files, setFiles] = useState<GithubFile[]>([]);
    const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
    const [activeFile, setActiveFile] = useState<GithubFile | null>(null);
    const [selectedFile, setSelectedFile] = useState<GithubFile | null>(null);
    const [docFile, setDocFile] = useState<CodeFile | null>(null);
    const [controls, setControls] = useState<string[]>([]);
    const [route, setRoute] = useState<string | null>(null);
    const navigate = useNavigate();

    const selectLibraryPage = (pageName: string) => {
        if (!pageName) {
            return;
        }

        setRoute(pageName);
        const file = files.find(f => f.name.localeCompare(pageName, undefined, { sensitivity: 'base' }) === 0);
        if (file != null) {
            onSelectFile(file);
        }
    };

    useEffect(() => {
        if (!route || !files || files.length === 0 || selectedFile) {
            return;
        }

        selectLibraryPage(route);
    }, [route, files, selectedFile]);

    const onSelectFile = (file: GithubFile) => {
        
        navigate(`${ROOT_PATH}/library/${file.name}`, { replace: true });
        
        setSelectedFile(file);
        const newCodeFiles: CodeFile[] = [{ filename: file.filename, code: file.fileContent, type: "cs" }];
        for (const supportingFile of file.supportingFiles ?? []) {
            newCodeFiles.push({ 
                filename: supportingFile.filename,
                code: supportingFile.fileContent,
                type: "cs",
            });
        }

        // controls are updated from the WebGL embed; this ensures
        // they are cleared out when the content does not have controls
        setControls([]);

        setDocFile(!file.docFileContent ? null : {
            code: file.docFileContent,
            type: "md",
        });

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

    const updateControls = (newControls: string[]) => {
        setControls(newControls);
    }

    return {
        files,
        codeFiles,
        activeFile,
        selectedFile,
        onSelectFile,
        hasPackageFile,
        downloadPackageFile,
        docFile: docFile,
        controls,
        updateControls,
        selectLibraryPage,
    }
}