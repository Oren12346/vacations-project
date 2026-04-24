// Page component responsible for the AdminVacations screen.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { VacationModel } from "../../1-models/vacation-model";
import vacationsService from "../../3-services/vacations-service";
import type { RootState } from "../../store/store";
import appConfig from "../../2-utils/app-config";
import "./AdminVacations.css"


// Render the vacations management page for admin users.
function AdminVacations() {
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.user);
    const [vacations, setVacations] = useState<VacationModel[]>([]);

    // Redirect unauthorized users and load vacations for management.
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "admin") {
            navigate("/vacations-list");
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

    // Confirm and delete the selected vacation from the server and UI.
    async function handleDelete(vacationId: number): Promise<void> {
        const areYouSure = window.confirm("Are you sure?");
        if (!areYouSure) return;

        try {
            await vacationsService.deleteVacation(vacationId);

            setVacations(currentVacations =>
                currentVacations.filter(v => v.vacationId !== vacationId)
            );
        }
        catch (error) {
            console.error(error);
            alert("Failed to delete vacation.");
        }
    }
    
    return (
        <div className="admin-vacations">
            <h2>Admin Vacations</h2>
            <button onClick={() => navigate("/add-vacation")}>Add Vacation</button>

            {vacations.map(vacation => (
                <div key={vacation.vacationId}>
                    <h3>{vacation.destination}</h3>
                    <p>{vacation.description}</p>
                    {vacation.imageName && (
                        <img
                            src={appConfig.imageUrl + vacation.imageName} alt={vacation.destination} />)}


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