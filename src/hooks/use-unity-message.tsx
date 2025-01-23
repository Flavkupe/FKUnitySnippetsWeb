import { useEffect } from "react";
import { UnityMessageData } from "../models/unity-message";
import { useLibraryContext } from "./use-library-context";
import { Vector3 } from "../models/vector3";

interface Props{
    sendMessageToUnity: (message: any) => void;
}

export interface MessageControls {
    setFloatValue: (fieldName: string, value: number) => void;
    setBoolValue: (fieldName: string, value: boolean) => void;
    setVector3Value: (fieldName: string, value: Vector3) => void;
    invokeMethod: (methodName: string) => void;
}

interface UseUnityMessageValue {
    handleMessage: (event: MessageEvent) => void;
    messageControls: MessageControls;
}

const INPUT_MANAGER = "WebInputManager";

export function useUnityMessage({sendMessageToUnity}: Props): UseUnityMessageValue {
    const { setWebGLReady, updateControls, activeFile } = useLibraryContext();

    const handleWebGLMessage = (_data: UnityMessageData) => {
        setWebGLReady(true);
    }

    const handleUnityMessage = (data: UnityMessageData) => {
        updateControls(data.inputControls);
    }

    const handleMessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data) as UnityMessageData;
            switch (data.type) {
            case "WEB_GL_READY":
                handleWebGLMessage(data);
                break;
            case "UNITY_MESSAGE":
                handleUnityMessage(data);
                break;
            default:
                console.log("Unknown message", data);
                break;
            }
        } catch (err) {
            console.error("error parsing message", err);
        }
    }

        useEffect(() => {
            if (!activeFile?.demoName) {
                return;
            }
    
            switchToFile(activeFile.demoName);
        }, [activeFile])
    
        const createMessage = (methodName: string, value: string) => {
            const messageData = JSON.stringify({
                objectName: INPUT_MANAGER,
                methodName,
                value,
            });
    
            return { type: 'UPDATE_IFRAME', data: messageData };
        }

        const switchToFile = (file: string) => {
            const message = createMessage("SwitchDemo", file);
            sendMessageToUnity(message);
        }

        const setFloatValue = (fieldName: string, value: number) => {
            const message = createMessage("SetFloatValue", JSON.stringify({
                FieldName: fieldName,
                Value: value,
            }));
            sendMessageToUnity(message);
        }

        const setBoolValue = (fieldName: string, value: boolean) => {
            const message = createMessage("SetBoolValue", JSON.stringify({
                FieldName: fieldName,
                Value: value,
            }));
            sendMessageToUnity(message);
        }

        const setVector3Value = (fieldName: string, value: Vector3) => {
            const message = createMessage("SetFloatValue", JSON.stringify({
                FieldName: fieldName,
                Value: value,
            }));
            sendMessageToUnity(message);
        }

        const invokeMethod = (methodName: string) => {
            const message = createMessage("InvokeMethod", JSON.stringify({
                MethodName: methodName,
            }));
            sendMessageToUnity(message);
        }
    

    return {
        handleMessage,
        messageControls: {
            setFloatValue,
            setBoolValue,
            setVector3Value,
            invokeMethod,
        },
    }
}