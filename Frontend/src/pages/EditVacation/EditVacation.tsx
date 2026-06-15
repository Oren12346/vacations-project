// Page component responsible for the EditVacation screen.
import { useEffect, useState, ChangeEvent, SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { VacationModel } from "../../1-models/vacation-model";
import vacationsService from "../../3-services/vacations-service";
import appConfig from "../../2-utils/app-config";
import { updateVacation as updateVacationInRedux } from "../../store/vacationsSlice";
import "./EditVacation.css";

type UserPayload = {
    role: string;
};

// Render the edit vacation page for admin users only.
function EditVacation() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { vacationId } = useParams();
    const vacations = useSelector((state: RootState) => state.vacations);

    const [vacation, setVacation] = useState<VacationModel>(new VacationModel());
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");

    // Load the selected vacation when the page opens.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const user = jwtDecode<UserPayload>(token);

            if (user.role !== "admin") {
                navigate("/vacations-list");
                return;
            }
        }
        catch {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        if (!vacationId) return;

        const id = +vacationId;
        const vacationFromRedux = vacations.find(v => v.vacationId === id);

        if (vacationFromRedux) {
            setVacation(vacationFromRedux);
            return;
        }

        vacationsService.getOneVacation(id)
            .then((vacationFromServer) => {
                setVacation(vacationFromServer);
            })
            .catch((err: unknown) => {
                console.error(err);
                setError("Failed to load vacation.");
            });
    }, [vacationId, navigate, vacations]);

    // Update the matching form field in the local vacation state.
    function handleChange(args: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const { name, value } = args.target;

        setVacation({
            ...vacation,
            [name]: name === "price"
                ? value === ""
                    ? undefined
                    : +value
                : value
        });
    }

    // Store the selected image file in local state.
    function handleFileChange(args: ChangeEvent<HTMLInputElement>): void {
        const file = args.target.files?.[0] || null;
        setImageFile(file);
    }

    // Validate the requirements to edit a vacation.
    function validateForm(): string {
        if (!vacation.destination?.trim()) return "Destination is required.";
        if (!vacation.description?.trim()) return "Description is required.";
        if (!vacation.startDate) return "Start date is required.";
        if (!vacation.endDate) return "End date is required.";
        if (vacation.price === undefined) return "Price is required.";
        if (vacation.price <= 0 || vacation.price > 10000) return "Price must be between 1 and 10000.";
        if (vacation.endDate < vacation.startDate) return "End date cannot be before start date.";

        return "";
    }

    // Validate the form, send the data to the server, and update Redux.
    async function Send(event: SyntheticEvent): Promise<void> {
        event.preventDefault();
        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        const destination = vacation.destination!;
        const description = vacation.description!;
        const startDate = vacation.startDate!;
        const endDate = vacation.endDate!;
        const price = vacation.price!;

        try {
            const formData = new FormData();

            formData.append("destination", destination);
            formData.append("description", description);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
            formData.append("price", price.toString());

            if (vacation.imageName) {
                formData.append("imageName", vacation.imageName);
            }

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const updatedVacation = await vacationsService.updateVacation(vacation.vacationId!, formData);

            dispatch(updateVacationInRedux(updatedVacation));

            navigate("/admin-vacations");
        }
        catch (err: unknown) {
            if (axios.isAxiosError<string>(err)) {
                setError(err.response?.data || "Failed to update vacation.");
            }
            else {
                setError("Failed to update vacation.");
            }
        }
    }

    return (
        <div className="edit-vacation">
            <h5>Edit Vacation</h5>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={Send} noValidate>
                <input type="text" name="destination" value={vacation.destination ?? ""} onChange={handleChange} />

                <textarea name="description" value={vacation.description ?? ""} onChange={handleChange} />

                {vacation.imageName && (
                    <img src={appConfig.imageUrl + vacation.imageName} alt={vacation.destination} />
                )}

                <input type="file" accept="image/*" onChange={handleFileChange} />

                <input type="date" name="startDate" value={vacation.startDate ?? ""} onChange={handleChange} />

                <input type="date" name="endDate" value={vacation.endDate ?? ""} onChange={handleChange} />

                <input type="number" name="price" value={vacation.price ?? ""} onChange={handleChange} />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default EditVacation;