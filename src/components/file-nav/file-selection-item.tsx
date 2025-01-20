import { GithubFile } from "../../models/github-files";

interface Props {
    file: GithubFile;
    onClickFile: (file: GithubFile) => void;
    isSelected?: boolean;
}

export function FileSelectionItem({file, onClickFile, isSelected}: Props) {
    return (
        <div className="file-selection-item"
            onClick={() => onClickFile(file)}
            style={{
                backgroundColor: isSelected ? "lightgray" : undefined,
            }}>
            {file.name}
        </div>
    )
}