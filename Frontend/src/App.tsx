
import { useLocation } from "react-router-dom";
import Menu from "./components/Layout/Menu";
import Routing from "./components/Routing/Routing";
import "./App.css";

// Main frontend layout component.
function App() {

    const location = useLocation();

    function getHeaderClassName(): string {
        if (location.pathname === "/vacations-list") return "main-header vacations-header";
        if (location.pathname === "/reports") return "main-header reports-header";
        if (location.pathname === "/ai-recommendation") return "main-header ai-header";
        if (location.pathname === "/mcp-question") return "main-header mcp-header";
        if (location.pathname === "/admin-vacations") return "main-header admin-header";
        if (location.pathname === "/add-vacation") return "main-header add-header";
        if (location.pathname.startsWith("/edit-vacation")) return "main-header edit-header";
        if (location.pathname === "/login") return "main-header login-header";
        if (location.pathname === "/register") return "main-header register-header";

        return "main-header default-header";
    }

    return (
        <div className="Main">
            <header className={getHeaderClassName()}>
                <h1 className="mainHead">Fly High Right to Your Vacation</h1>
                <Menu />
            </header>

            <main>
                <Routing />
            </main>
        </div>
    )
}

export default App;