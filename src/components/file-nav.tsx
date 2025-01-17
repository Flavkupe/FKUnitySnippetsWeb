import { Button } from "react-bootstrap";
import { GithubAccessibleFile } from "../models/github-files";


interface Props {
    files: GithubAccessibleFile[],
    onClickFile: (file: GithubAccessibleFile) => void;
}

export function FileNav({files, onClickFile}: Props) {
    return (
        <div style={{
            height: "100%",
            width: "300px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
        }}>
            {files.map((file) => (
                <Button key={file.displayName} color="white" style={{
                    padding: "10px",
                    marginTop: "10px",
                    backgroundColor: "white",
                    color: "black",
                }} onClick={() => onClickFile(file)}>{file.displayName}</Button>
            ))}
        </div>
    )
}