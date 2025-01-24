import { useEffect, useRef } from "react";
import { EmbedControls } from "./embed-controls";
import { useLibraryContext } from "../../hooks/use-library-context";
import { LoadingSpinner } from "../utils/loading-spinner";
import { useUnityMessage } from "../../hooks/use-unity-message";

export function WebGLEmbed() {   
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const { webGLReady, controls } = useLibraryContext();

    function sendMessageToUnity(message: any) {
        if (!iframeRef.current?.contentWindow) {
            return;
        }

        iframeRef.current?.contentWindow.postMessage(message, '*');
    }

    const { handleMessage, messageControls } = useUnityMessage({sendMessageToUnity});

    useEffect(() => {
        window.addEventListener("message", handleMessage, false);
    }, []);

    const url = window.location.hostname === "localhost" ? 
        "http://localhost:8080/" :
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
        <EmbedControls controls={controls} messageControls={messageControls} />
    </div>
}
