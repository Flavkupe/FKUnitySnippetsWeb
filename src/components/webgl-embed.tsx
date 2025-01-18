import { useEffect, useRef } from "react";

interface Props {
    activeFile: string | null;
}

export function WebGLEmbed({activeFile}: Props) {   
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

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
        width:"100%"
    }} >
        <iframe
            scrolling="no"
            ref={iframeRef}
            width="300px"
            height="300px"
            src="https://flavkupe.github.io/FKUnitySnippets/"
        />
    </div>
}