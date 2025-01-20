import { Spinner } from "react-bootstrap";

interface Props {
    message: string;
}

export function LoadingSpinner({message}: Props) {
    return (
        <div 
            style={{display: "flex", width:"100%", flexDirection: "column", alignItems: "center"}}>
            <Spinner animation="border" role="status"/>
            <span>{message}</span>
        </div>
    )
}