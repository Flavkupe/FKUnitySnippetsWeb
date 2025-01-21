import { useEffect, useRef } from "react";
import { UnityMessageData } from "../../models/unity-message";
import { EmbedControls } from "./embed-controls";
import { useLibraryContext } from "../../hooks/use-library-context";
import { LoadingSpinner } from "../utils/loading-spinner";

interface Props {
    activeFile: string | null;
}

export function WebGLEmbed({activeFile}: Props) {   
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const { setWebGLReady, webGLReady, controls, updateControls } = useLibraryContext();
    const handleMessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data) as UnityMessageData;
            if (data.type === "WEB_GL_READY") {
                setWebGLReady(true);
            }
            
            if (data.type !== "UNITY_MESSAGE") {
                return;
            }

            updateControls(data.controls);
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
            methodName: "SwitchDemo",
            value: file,
        });

        const message = { type: 'UPDATE_IFRAME', data: messageData };
        iframeRef.current?.contentWindow.postMessage(message, '*');
    }

    const url = window.location.hostname === "localhost" ? 
        "http://localhost:57823/" : 
        "https://flavkupe.github.io/FKUnitySnippets/";

    return <div style={{
        width:"100%",
        display: "flex",
        flexDirection: "row",
    }} >
        { !webGLReady && <LoadingSpinner message="Loading Unity Demo..." />
        }
        <iframe
            style={{display: webGLReady ? "flex" : "none"}}
            scrolling="no"
            ref={iframeRef}
            width="300px"
            height="300px"
            src={url}
        />
        <EmbedControls activeFile={activeFile} controls={controls} />
    </div>
}
