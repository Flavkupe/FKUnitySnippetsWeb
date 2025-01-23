import { Vector3 } from "./vector3";

export interface UnityMessageData {
    type: string;
    inputControls: InputControl[];
}

export type InputControl = InputFieldControl |
    ButtonInputControl |
    InfoInputControl;

export type InputFieldControl = FloatInputControl |
    BooleanInputControl |
    Vector3InputControl;

interface InputControlBase {
    inputType: string;
    description: string;
}

interface InputFieldControlBase extends InputControlBase {
    inputType: "field";
}

export interface ButtonInputControl extends InputControlBase{
    inputType: "button";
    method: string;
    buttonName: string;
}

export interface InfoInputControl extends InputControlBase{
    inputType: "info";
}

export interface FloatInputControl extends InputFieldControlBase{
    fieldType: "float";
    value: number;
    incrementValue: number;
    fieldName: string;
}

export interface BooleanInputControl extends InputFieldControlBase{
    fieldType: "bool";
    value: boolean;
    fieldName: string;
}

export interface Vector3InputControl extends InputFieldControlBase{
    fieldType: "vector3";
    value: Vector3;
    incrementValue: number;
    fieldName: string;
}
