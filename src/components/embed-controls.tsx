
interface Props {
    controls: string[];
}

export function EmbedControls({controls}: Props) {
    if (!controls || controls.length === 0) {
        return null;
    }

    return (
        <div className="embed-controls">
            {controls.map(control => (
                <div key={control}>
                    {control}
                </div>
            ))}
        </div>
    )
}