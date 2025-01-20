import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeFile } from '../../hooks/use-snippet-library';

interface Props {
    codeFile: CodeFile | null;
}

export function CodeBox({codeFile}: Props) {
    if (!codeFile || !codeFile.code) {
        return null;
    }

    const { filename, code } = codeFile;

    return (
        <div>
            <div className="code-box-title">{filename}</div>
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
