import { Accordion } from "react-bootstrap";
import { GithubFile } from "../models/github-files";
import { FileSelectionItem } from "./file-selection-item";
import { useMemo } from "react";


interface Props {
    files: GithubFile[],
    onClickFile: (file: GithubFile) => void;
    currentSelection: GithubFile | null;
}

export function FileNav({files, onClickFile, currentSelection}: Props) {
    const filesByPath = useMemo<Record<string, GithubFile[]>>(() => {
        const mapping: Record<string, GithubFile[]> = {};
        for (const file of files) {
            const path = file.shortPath;
            if (!mapping[path]) {
                mapping[path] = [];
            }
            mapping[path].push(file);
        }

        return mapping;
    }, [files]);

    const keys = useMemo<string[]>(() => {
        const keys = Object.keys(filesByPath);
        keys.sort();
        return keys;
    }, [filesByPath]);

    return (
        <div style={{
            height: "100%",
            width: "300px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
        }}>
            <Accordion>
            {keys.map((path) => {
                const items = filesByPath[path];
                return (
                <div key={path}>
                    <Accordion.Item eventKey={path}>
                        <Accordion.Header>{path}</Accordion.Header>
                        <Accordion.Body style={{
                            padding: "0px"
                        }}>
                            {items.map((file) => {
                                return <FileSelectionItem
                                    key={file.path}
                                    file={file}
                                    onClickFile={onClickFile}
                                    isSelected={currentSelection?.path === file.path}
                                />
                            })}
                        </Accordion.Body>
                    </Accordion.Item>
                </div>)
            })}
            </Accordion>
        </div>
    )
}