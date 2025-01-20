import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
    code?: string | null;
    filename?: string;
}

export function CodeBox({code, filename}: Props) {
    if (!code) {
        return null;
    }

    return (
        <div>
            <div style={{
                display: "flex",
                marginTop: "20px",
                fontFamily: "monospace",
                fontSize: "1.2em",
                fontWeight: "bold",
            }}>{filename}</div>
            <SyntaxHighlighter language="csharp" style={{ ...coy }} customStyle={{
                borderRadius: "10px",
                fontSize: "0.8em",
                paddingTop: "10px",
            }}>
                {code}
            </SyntaxHighlighter>
        </div>
    )
}
