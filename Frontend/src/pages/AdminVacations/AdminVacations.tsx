// Page component responsible for the AdminVacations screen.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import vacationsService from "../../3-services/vacations-service";
import type { RootState } from "../../store/store";
import appConfig from "../../2-utils/app-config";
import { initVacations, deleteVacation as deleteVacationFromRedux } from "../../store/vacationsSlice";
import "./AdminVacations.css";

// Render the vacations management page for admin users.
function AdminVacations() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user);
    const vacations = useSelector((state: RootState) => state.vacations);

    // Redirect unauthorized users and load vacations into Redux.
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "admin") {
            navigate("/vacations-list");
            return;
        }

        if (vacations.length === 0) {
            vacationsService.getAllVacations()
                .then((vacationsFromServer) => {
                    dispatch(initVacations(vacationsFromServer));
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [user, navigate, dispatch, vacations.length]);

    // Confirm and delete the selected vacation from the server and Redux.
    async function handleDelete(vacationId: number): Promise<void> {
        const areYouSure = window.confirm("Are you sure?");
        if (!areYouSure) return;

        try {
            await vacationsService.deleteVacation(vacationId);

            dispatch(deleteVacationFromRedux(vacationId));
        }
        catch (error) {
            console.error(error);
            alert("Failed to delete vacation.");
        }
    }

    return (
        <div className="admin-vacations">
            <h2>Admin Vacations</h2>

            <button onClick={() => navigate("/add-vacation")}>
                Add Vacation
            </button>

            {vacations.map(vacation => (
                <div key={vacation.vacationId}>
                    <h3>{vacation.destination}</h3>

                    <p>{vacation.description}</p>

                    {vacation.imageName && (
                        <img
                            src={appConfig.imageUrl + vacation.imageName}
                            alt={vacation.destination}
                        />
                    )}

                    <button onClick={() => navigate(`/edit-vacation/${vacation.vacationId}`)}>
                        Edit
                    </button>

                    <button onClick={() => handleDelete(vacation.vacationId!)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default AdminVacations;