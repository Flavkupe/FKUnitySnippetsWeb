import { useEffect, useRef, useState } from "react";
import { UnityMessageData } from "../models/unity-message";
import { EmbedControls } from "./embed-controls";

interface Props {
    activeFile: string | null;
}

export function WebGLEmbed({activeFile}: Props) {   
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const [controls, setControls] = useState<string[]>([]);

    const handleMessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data) as UnityMessageData;
            if (data.type !== "UNITY_MESSAGE") {
                return;
            }

            setControls(data.controls);
        } catch(err) {
            console.error("error parsing message", err);
        }
        
    }

    useEffect(() => {
        window.addEventListener("message", handleMessage, false);
    }, []);

    useEffect(() => {
        if (!activeFile) {
            return;
        }

        switchToFile(activeFile);
    }, [activeFile])

    const switchToFile = (file: string) => {
        if (!iframeRef.current?.contentWindow) {
            return;
        }

        const messageData = JSON.stringify({
            objectName: "WebInputManager",
            methodName: "SwitchComponent",
            value: file,
        });

        const message = { type: 'UPDATE_IFRAME', data: messageData };
        iframeRef.current?.contentWindow.postMessage(message, '*');
    }

    return <div style={{
        width:"100%",
        display: "flex",
        flexDirection: "row",
    }} >
        <iframe
            scrolling="no"
            ref={iframeRef}
            width="300px"
            height="300px"
            // src="https://flavkupe.github.io/FKUnitySnippets/"
            src="http://localhost:51736/"
        />
        <EmbedControls controls={controls} />
    </div>
}
