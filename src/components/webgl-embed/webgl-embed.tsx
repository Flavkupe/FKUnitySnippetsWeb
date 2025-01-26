import { useEffect, useRef, useState } from "react";
import { EmbedControls } from "./embed-controls";
import { useLibraryContext } from "../../hooks/use-library-context";
import { LoadingSpinner } from "../utils/loading-spinner";
import { useUnityMessage } from "../../hooks/use-unity-message";

// ms to wait before showing timeout error
const TIMEOUT_DURATION = 10000;

export function WebGLEmbed() {   
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const { webGLReady, controls } = useLibraryContext();
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [loadTimedOut, setLoadTimedOut] = useState(false);

    function sendMessageToUnity(message: any) {
        if (!iframeRef.current?.contentWindow) {
            return;
        }

        iframeRef.current?.contentWindow.postMessage(message, '*');
    }

    const { handleMessage, messageControls } = useUnityMessage({sendMessageToUnity});

    const spinnerMessage = iframeLoaded ? "Loading Unity Demo..." : "Loading Unity Player...";

    useEffect(() => {
        window.addEventListener("message", handleMessage, false);
    }, []);

    useEffect(() => {
        
    }, [webGLReady]);

    useEffect(() => {
        if (webGLReady) {
            setLoadTimedOut(false);
            return;
        }

        if (!webGLReady && !loadTimedOut) {
            setTimeout(() => {
                setLoadTimedOut(true);
            }, 10000);
        }
    }, [webGLReady]);

    const url = window.location.hostname === "localhost" ? 
        "http://localhost:8080/" :
        "https://dube9zr6o416s.cloudfront.net/";

    return <div style={{
        width:"100%",
        display: "flex",
        flexDirection: "row",
    }} >
        <div className="embed-container">
            {!webGLReady && (
                <div className="overlay">
                        {loadTimedOut && <div style={{marginTop: "150px"}}>
                            Could not load x_X. Try refreshing page.
                        </div>}
                        {!loadTimedOut && <LoadingSpinner message={spinnerMessage} />}
                </div>
            )}
            <iframe
                className="embed-frame"
                scrolling="no"
                ref={iframeRef}
                width="300px"
                height="300px"
                src={url}
                onLoad={() => { setIframeLoaded(true) }}
            />
        </div>
        <EmbedControls controls={controls} messageControls={messageControls} />
    </div>
}
