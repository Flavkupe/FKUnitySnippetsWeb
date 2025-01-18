import { Accordion, Button } from "react-bootstrap";
import { GithubFile } from "../models/github-files";


interface Props {
    files: GithubFile[],
    onClickFile: (file: GithubFile) => void;
}

export function FileNav({files, onClickFile}: Props) {

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
                        <Accordion.Body>
                            {files.map((file) => {
                                return <Button key={file.name} color="white" style={{
                                    padding: "10px",
                                    marginTop: "10px",
                                    backgroundColor: "white",
                                    color: "black",
                                }} onClick={() => onClickFile(file)}>{file.name}</Button>
                            })}
                        </Accordion.Body>
                    </Accordion.Item>
                </div>)
            })}
            </Accordion>
        </div>
    )
}