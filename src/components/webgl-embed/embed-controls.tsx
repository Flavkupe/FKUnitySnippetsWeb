import { Form } from "react-bootstrap";
import { InputControl } from "../../models/unity-message";
import { EmbedInputControl } from "./embed-input-control";
import { useLibraryContext } from "../../hooks/use-library-context";
import { MessageControls } from "../../hooks/use-unity-message";

interface Props {
    controls: InputControl[];
    messageControls: MessageControls;
}

export function EmbedControls({controls, messageControls}: Props) {
    const { activeFile } = useLibraryContext();
    
    if (!controls || controls.length === 0 || !activeFile?.name) {
        return null;
    }

    return (
        <div className="embed-controls">
            <Form>
            {controls.map(control => (
                <div key={`${activeFile.demoName}:${getKey(control)}`}>
                    <EmbedInputControl control={control} messageControls={messageControls} />
                </div>
            ))}
            </Form>
        </div>
    )
}

function getKey(control: InputControl) {
    switch (control.inputType) {
        case "field":
            return control.fieldName;
        case "button":
            return control.method;
        default:
            return control.description;
    }
}
