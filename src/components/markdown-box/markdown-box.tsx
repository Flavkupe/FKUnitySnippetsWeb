//import { atelierLakesideLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeFile } from '../../hooks/use-snippet-library';
import SyntaxHighlighter from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import { atelierLakesideLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface Props{
    codeFile: CodeFile | null;
}

export function MarkdownBox({codeFile}: Props) {
    if (!codeFile?.code) {
        return null;
    }
    
    return (
    <div className="markdown-box">
        <ReactMarkdown
            children={codeFile.code}
            components={{
            code({ className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
                <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={atelierLakesideLight}
                PreTag="div"
                language={match[1]}
                />
            ) : (
                <code className={className}>
                    {children}
                </code>
            );
            },
        }}
        />
    </div>);
}
