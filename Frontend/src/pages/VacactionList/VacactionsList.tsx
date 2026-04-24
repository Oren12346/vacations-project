// Page component responsible for the VacactionsList screen.
import { useEffect, useState } from "react";
import "./VacationsList.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { VacationModel } from "../../1-models/vacation-model";
import vacationsService from "../../3-services/vacations-service";
import likesService from "../../3-services/likes-service";
import appConfig from "../../2-utils/app-config";

// Render the vacations list for regular users.
function VacationsList() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);

    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const vacationsPerPage = 9;

    // Redirect unauthorized users and load vacations from the server.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (user?.role === "admin") {
            navigate("/admin-vacations");
            return;
        }

        vacationsService.getAllVacations()
            .then((vacationsFromServer) => {
                setVacations(vacationsFromServer);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [user, navigate]);

    // Run side effects such as redirects or initial data loading when the component mounts.
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    // Add a like for the selected vacation and update the local UI.
    async function handleLike(vacationId: number): Promise<void> {
        if (!user) return;

        await likesService.addLike(vacationId);
        setVacations(currentVacations =>
            currentVacations.map(currentVacation =>
                currentVacation.vacationId === vacationId
                    ? {
                        ...currentVacation,
                        isLiked: true,
                        likesCount: (currentVacation.likesCount ?? 0) + 1
                    }
                    : currentVacation
            )
        );
    }

    // Remove a like for the selected vacation and update the local UI.
    async function handleUnlike(vacationId: number): Promise<void> {
        if (!user) return;

        await likesService.removeLike(vacationId);
        setVacations(currentVacations =>
            currentVacations.map(currentVacation =>
                currentVacation.vacationId === vacationId
                    ? {
                        ...currentVacation,
                        isLiked: false,
                        likesCount: Math.max((currentVacation.likesCount ?? 0) - 1, 0)
                    }
                    : currentVacation
            )
        );
    }

    const today = new Date().toISOString().split("T")[0];

    // Filter vacations according to the selected button.
    const filteredVacations = vacations.filter(vacation => {
        if (filter === "all") return true;
        if (filter === "liked") return !!vacation.isLiked;
        if (filter === "active") return vacation.startDate <= today && vacation.endDate >= today;
        if (filter === "upcoming") return vacation.startDate > today;

        return true;
    });
    const filterButtons = [
        { value: "all", label: "All Vacations" },
        { value: "liked", label: "Liked Vacations" },
        { value: "active", label: "Active Vacations" },
        { value: "upcoming", label: "Upcoming Vacations" }
    ];

    const startIndex = (currentPage - 1) * vacationsPerPage;
    const endIndex = startIndex + vacationsPerPage;
    const paginatedVacations = filteredVacations.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredVacations.length / vacationsPerPage);
    const safeTotalPages = Math.max(totalPages, 1);


    return (
        <div className="VacationsList">
            <div className="vacations-content">
                <h2>Vacations List</h2>

                <div className="filters">
                    {filterButtons.map(button => (
                        <button
                            key={button.value}
                            className={filter === button.value ? "active-filter" : ""}
                            onClick={() => setFilter(button.value)}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>

                {paginatedVacations.length === 0 && (
                    <div className="empty-message">No vacations found.</div>
                )}

                {paginatedVacations.length > 0 && (
                    <div className="vacations-grid">
                        {paginatedVacations.map(vacation => (
                            <div key={vacation.vacationId} className="vacation-card">
                                {vacation.imageName && (
                                    <img
                                        className="vacation-image"
                                        src={appConfig.imageUrl + vacation.imageName}
                                        alt={vacation.destination}
                                    />
                                )}

                                <div className="vacation-body">
                                    <div className="vacation-top">
                                        <h3 className="destination">{vacation.destination}</h3>
                                        <div className="price">${vacation.price}</div>
                                    </div>

                                    <div className="dates">
                                        {vacation.startDate} - {vacation.endDate}
                                    </div>

                                    <p className="description">{vacation.description}</p>

                                    <div className="vacation-footer">
                                        <span className="likes-count">
                                            Likes: {vacation.likesCount ?? 0}
                                        </span>

                                        {user?.role === "user" && (
                                            <button
                                                className={`like-button ${vacation.isLiked ? "liked" : ""}`}
                                                onClick={() =>
                                                    vacation.isLiked
                                                        ? handleUnlike(vacation.vacationId!)
                                                        : handleLike(vacation.vacationId!)
                                                }
                                            >
                                                {vacation.isLiked ? "Unlike" : "Like"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pagination">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                        Previous
                    </button>

                    <span>Page {currentPage} of {safeTotalPages}</span>

                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, safeTotalPages))}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VacationsList;