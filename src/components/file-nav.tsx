import { Accordion, Button } from "react-bootstrap";
import { GithubFile } from "../models/github-files";
import { FileSelectionItem } from "./file-selection-item";


interface Props {
    files: GithubFile[],
    onClickFile: (file: GithubFile) => void;
    currentSelection: GithubFile | null;
}

export function FileNav({files, onClickFile, currentSelection}: Props) {
    const filesByPath: Record<string, GithubFile[]> = {};
    for (const file of files) {
        const path = file.shortPath;
        if (!filesByPath[path]) {
            filesByPath[path] = [];
        }
        filesByPath[path].push(file);
    }

    return (
        <div style={{
            height: "100%",
            width: "300px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
        }}>
            <Accordion>
            {Object.keys(filesByPath).map((path) => {
                const files = filesByPath[path];
                return (
                <div key={path}>
                    <Accordion.Item eventKey={path}>
                        <Accordion.Header>{path}</Accordion.Header>
                        <Accordion.Body style={{
                            padding: "0px"
                        }}>
                            {files.map((file) => {
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