import VacationsList from "../../pages/VacactionList/VacactionsList";
import Register from "../../pages/Register/Register";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../../pages/Login/Login";
import AddVacation from "../../pages/AddVacation/AddVacation";
import Reports from "../../pages/Reports/Reports";
import EditVacation from "../../pages/EditVacation/EditVacation";
import AdminVacations from "../../pages/AdminVacations/AdminVacations";
import AiRecommendation from "../../pages/AiRecommendation/AiRecommendation";
import McpQuestion from "../../pages/McpQuestion/McpQuestion";
import PageNotFound from "../../pages/PageNotFound/PageNotFound";




function Routing() {
    return (
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
    );
}

export default Routing;