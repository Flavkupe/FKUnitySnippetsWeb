
interface Props {
    activeFile: string | null;
    controls: string[];
}

export function EmbedControls({activeFile, controls}: Props) {
    if (!controls || controls.length === 0 || !activeFile) {
        return null;
    }

    return (
        <div className="embed-controls">
            {controls.map(control => (
                <div key={`${activeFile}:${control}`}>
                    {control}
                </div>
            ))}
        </div>
    )
}