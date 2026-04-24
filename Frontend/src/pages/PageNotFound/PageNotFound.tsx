import { NavLink } from "react-router-dom";
import "./PageNotFound.css";

function PageNotFound() {
    return (
        <div className="PageNotFound">
            <h2>404 - Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <NavLink to="/login">Back to Login</NavLink>
        </div>
    );
}

export default PageNotFound;