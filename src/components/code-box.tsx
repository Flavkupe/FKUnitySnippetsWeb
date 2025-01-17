import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
    code?: string | null;
}

export function CodeBox({code}: Props) {
    if (!code) {
        return null;
    }

    return (
        <SyntaxHighlighter language="csharp" style={{
            ...coy,
        }} customStyle={{
            borderRadius: "10px",
        }}>
            {code}
        </SyntaxHighlighter>
    )
}
