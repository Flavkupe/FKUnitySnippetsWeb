import { Button } from "react-bootstrap";
import unityIcon from "../../assets/unity-icon.png";
import { useLibraryContext } from "../../hooks/use-library-context";


export function ResourcesBox() {

    const {hasPackageFile, downloadPackageFile} = useLibraryContext();



    return (
        <div className="resources-box">
            <Button 
                onClick={downloadPackageFile}
                hidden={!hasPackageFile}
                variant="light"
                style={{width: "100%"}}
            >
                <img src={unityIcon} width="16px" height="16px" />
                <span style={{marginLeft: "8px" }}>Download as Unity package</span>
            </Button>
        </div>
    )
}
