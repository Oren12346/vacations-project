// Navigation menu that changes by route and user role.
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import authService from "../../3-services/auth-service";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import "./Menu.css";

// Render the navigation menu according to the current route and user role.
function Menu() {
    const navigate = useNavigate();
    const location = useLocation();

        // Read the current path to apply the matching menu theme.
    const path = location.pathname.toLowerCase();

    let menuClassName = "Menu";

    if (path.includes("/login")) {
        menuClassName += " login-theme";
    }
    else if (path.includes("/register")) {
        menuClassName += " register-theme";
    }
    else if (path.includes("/ai-recommendation")) {
        menuClassName += " ai-theme";
    }
    else if (path.includes("/vacations-list")) {
        menuClassName += " vacations-theme";
    }
    else if (path.includes("/mcp-question")) {
        menuClassName += " mcp-theme";
    }
    else if (path.includes("/admin-vacations")) {
        menuClassName += " admin-theme";
    }
    else if (path.includes("/reports")) {
        menuClassName += " reports-theme";
    }
    else if (path.includes("/add-vacation")) {
        menuClassName += " add-theme";
    }
    else if (path.includes("/edit-vacation")) {
        menuClassName += " edit-theme";
    }

    // Clear the current session and move the user back to the login page.
    function logoutUser(): void {
        authService.logout();
        navigate("/login");
    }

    const user = useSelector((state: RootState) => state.user);

    return (
        <nav className={menuClassName}>
            {user ? (
                <>
                    <div className="user-name">
                        {user.firstName} {user.lastName}
                    </div>

                    {user.role === "admin" ? (
                        <>
                            <NavLink to="/admin-vacations">Manage Vacations</NavLink>
                            <NavLink to="/reports">Reports</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/vacations-list">Vacations List</NavLink>
                            <NavLink to="/ai-recommendation">AI Recommendation</NavLink>
                            <NavLink to="/mcp-question">MCP Question</NavLink>
                        </>
                    )}

                    <button onClick={logoutUser}>Logout</button>
                </>
            ) : (
                <>
                    <NavLink to="/register">Register</NavLink>
                    <NavLink to="/login">Login</NavLink>
                </>
            )}
        </nav>
    );
}

export default Menu;