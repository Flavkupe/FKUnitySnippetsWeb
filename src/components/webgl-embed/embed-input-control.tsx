
import { Button, Col, Form, Row } from "react-bootstrap";
import { BooleanInputControl, ButtonInputControl, FloatInputControl, InfoInputControl, InputControl, InputFieldControl, Vector3InputControl } from "../../models/unity-message";
import { useState } from "react";
import { MessageControls } from "../../hooks/use-unity-message";

interface Props {
    control: InputControl;
    messageControls: MessageControls;
}

interface ControlProps<T> {
    control: T;
    messageControls: MessageControls;
}

const LabelCol = 7;
const InputCol = 5;

export function EmbedInputControl({control, messageControls }: Props) {
    
    switch (control.inputType) {
        case "field":
            return FieldControl({control, messageControls});
        case "button":
            return ButtonControl({control, messageControls});
        case "info":
            return InfoControl({control, messageControls});
        default:
            return null;
    }
}

function FieldControl({control, messageControls}: ControlProps<InputFieldControl>) {
    switch (control?.fieldType) {
        case "float":
            return FloatControl({
                messageControls,
                control,
            });
        case "bool":
            return BooleanControl({
                messageControls,
                control,
            });
        case "vector3":
            return Vector3Control({
                messageControls,
                control,
            });
        default:
            return null;
    }    
}

function ButtonControl({control, messageControls}: ControlProps<ButtonInputControl>) {
    const onClick = () => {
        messageControls.invokeMethod(control.method);
    }

    return (<div className="embed-input-control">
        <Form.Group as={Row} >
            <Col sm="12">
                <Button onClick={onClick}>{control.buttonName}</Button>
            </Col>
        </Form.Group>
    </div>)
}

function FloatControl({control, messageControls}: ControlProps<FloatInputControl>) {
    const [value, setValue] = useState(control.value);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseFloat(e.target.value));
        messageControls.setFloatValue(control.fieldName, parseFloat(e.target.value));
    }

    return (<div className="embed-input-control">
        <Form.Group as={Row} >
            <Form.Label column sm={LabelCol}>{control.fieldName}</Form.Label>
            <Col sm={InputCol}>
            <Form.Control type="number"    
                value={value}
                onChange={onChange}
                step={control.incrementValue} />
            </Col>
        </Form.Group>
    </div>)
}

function BooleanControl({control, messageControls}: ControlProps<BooleanInputControl>) {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        messageControls.setBoolValue(control.fieldName, e.target.checked);
    }

    return (<div className="embed-input-control">
        <Form.Group as={Row} >
            <Form.Label column sm={LabelCol}>{control.fieldName}</Form.Label>
            <Col sm={InputCol} style={{ alignContent: "center" }}>
            <Form.Check
                style={{ textAlign: "left" }}
                defaultChecked={control.value}
                type="switch"
                onChange={onChange}
            />
            </Col>
        </Form.Group>
    </div>)
}

function Vector3Control({control, messageControls}: ControlProps<Vector3InputControl>) {
    const [x, setX] = useState(control.value.x);
    const [y, setY] = useState(control.value.y);
    const [z, setZ] = useState(control.value.z);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setValue: (value: number) => void) => {
        setValue(parseFloat(e.target.value));
        messageControls.setVector3Value(control.fieldName, { x, y, z });
    }

    return (<div className="embed-input-control">
        <Form.Group as={Row} >
            <Form.Label column sm={LabelCol}>{control.fieldName}</Form.Label>
            <Col sm={InputCol}>
            <Form.Group as={Row} >
            <Col sm="4" style={{ paddingRight: "0px" }}>
                <Form.Control type="number"
                    value={x}
                    onChange={(e) => onChange(e, setX)}
                    step={control.incrementValue} />
            </Col>
            <Col sm="4" style={{ paddingLeft: "6px", paddingRight: "6px" }}>
                <Form.Control type="number"    
                    value={y}
                    onChange={(e) => onChange(e, setY)}
                    step={control.incrementValue} />
            </Col>
            <Col sm="4" style={{ paddingLeft: "0px" }}>
                <Form.Control type="number"    
                    value={z}
                    onChange={(e) => onChange(e, setZ)}
                    step={control.incrementValue} />
            </Col>
                </Form.Group>
            </Col>
        </Form.Group>
    </div>)
}


function InfoControl({control}: ControlProps<InfoInputControl>) {
    return (<div className="embed-input-control">
        <Form.Group as={Row} >
            <Col sm="12">
                {control.description}
            </Col>
        </Form.Group>
    </div>)
}

