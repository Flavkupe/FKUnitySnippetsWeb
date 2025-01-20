import { useState } from "react";

export interface WebGLState {
    webGLReady: boolean;
    setWebGLReady: (ready: boolean) => void;
}

export function useWebGLState(): WebGLState {
    const [webGLReady, setWebGLReady] = useState(false);

    return {
        webGLReady,
        setWebGLReady
    }
}
