import { Accordion } from "react-bootstrap";
import { GithubFile } from "../../models/github-files";
import { FileSelectionItem } from "./file-selection-item";
import { useMemo } from "react";

interface Props {
    files: GithubFile[],
    onClickFile: (file: GithubFile) => void;
    currentSelection: GithubFile | null;
}

export function FileNav({files, onClickFile, currentSelection}: Props) {
    const filesByCategory = useMemo<Record<string, GithubFile[]>>(() => {
        const mapping: Record<string, GithubFile[]> = {};
        for (const file of files) {
            const category = file.category;
            if (!mapping[category]) {
                mapping[category] = [];
            }
            mapping[category].push(file);
        }

        return mapping;
    }, [files]);

    const keys = useMemo<string[]>(() => {
        const keys = Object.keys(filesByCategory);
        keys.sort();
        return keys;
    }, [filesByCategory]);

    return (
        <div style={{
            height: "100%",
            width: "300px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
        }}>
            <Accordion>
            {keys.map((category) => {
                const items = filesByCategory[category];
                return (
                <div key={category}>
                    <Accordion.Item eventKey={category}>
                        <Accordion.Header>{category}</Accordion.Header>
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