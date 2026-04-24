
// Main frontend component that defines the application routes.
import VacationsList from "./pages/VacactionList/VacactionsList";
import Register from "./pages/Register/Register";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Menu from "./components/Layout/Menu";
import AddVacation from "./pages/AddVacation/AddVacation";
import Reports from "./pages/Reports/Reports";
import EditVacation from "./pages/EditVacation/EditVacation";
import AdminVacations from "./pages/AdminVacations/AdminVacations";
import AiRecommendation from "./pages/AiRecommendation/AiRecommendation";
import McpQuestion from "./pages/McpQuestion/McpQuestion";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import "./App.css"

// Define the main application routes.
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

                <Routes>

                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="/vacations-list" element={<VacationsList />} />

                    <Route path="/register" element={<Register />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/add-vacation" element={<AddVacation />} />

                    <Route path="/edit-vacation/:vacationId" element={<EditVacation />} />

                    <Route path="/reports" element={<Reports />} />

                    <Route path="/admin-vacations" element={<AdminVacations />} />

                    <Route path="/ai-recommendation" element={<AiRecommendation />} />

                    <Route path="/mcp-question" element={<McpQuestion />} />

                    <Route path="*" element={<PageNotFound />} />



                </Routes>

            </main>
        </div >
    )
}

export default App;