import { Button } from "react-bootstrap";
import { Link } from "react-router";

export function HomePage() {
    return <div className="home-page">
        <div className="content">
            <h2 style={{ marginBottom: "20px"}}>Welcome to the Unity Snippet Library</h2>
            <p>This is an unofficial library containing several Unity code snippets and demos. Feel free to use them as you'd like!</p>
            <p>This page is still under construction, and I'll be adding many more snippets over time.</p>
            <Link to="library"><Button>See Library</Button></Link>
        </div>
    </div>;
}
