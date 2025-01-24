import { Form } from "react-bootstrap";
import { InputControl } from "../../models/unity-message";
import { EmbedInputControl } from "./embed-input-control";
import { useLibraryContext } from "../../hooks/use-library-context";
import { MessageControls } from "../../hooks/use-unity-message";
import { useMemo } from "react";

interface Props {
    controls: InputControl[];
    messageControls: MessageControls;
}

export function EmbedControls({controls, messageControls}: Props) {
    const { activeFile } = useLibraryContext();
    
    const sortedEmbedControls = useMemo(() => {
        return controls.sort((a, b) => {
            return getInputControlSortValue(a) - getInputControlSortValue(b);
        });
    }, [controls]);

    const buttonControls = sortedEmbedControls.filter(control => control.inputType === 'button');
    const otherControls = sortedEmbedControls.filter(control => control.inputType !== 'button');

    if (!controls || controls.length === 0 || !activeFile?.name) {
        return null;
    }

    return (
        <div className="embed-controls">
            <Form>
            {otherControls.map(control => (
                <div key={`${activeFile.demoName}:${getKey(control)}`}>
                    <EmbedInputControl control={control} messageControls={messageControls} />
                </div>
            ))}
            {buttonControls.length > 0 && (
                    <div className="button-controls-row">
                        {buttonControls.map(control => (
                            <EmbedInputControl key={`${activeFile.demoName}:${getKey(control)}`} control={control} messageControls={messageControls} />
                        ))}
                    </div>
                )}
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

function getInputControlSortValue(control: InputControl) {
    switch (control.inputType) {
        case "field":
            switch (control.fieldType) {
                case "float":
                    return 0;
                case "vector3":
                    return 1;
                case "bool":
                    return 2;
                default:
                    return 3;
            }
            case "info":
                return 4;
        case "button":
            return 5;
        default:
            return 6;
    }
}