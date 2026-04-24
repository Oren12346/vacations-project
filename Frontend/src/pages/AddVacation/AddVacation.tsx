// Page component responsible for the AddVacation screen.
import { useEffect, useState, ChangeEvent, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { VacationModel } from "../../1-models/vacation-model";
import vacationsService from "../../3-services/vacations-service";
import "./AddVacation.css";

type UserPayload = {
    role: string;
};

// Render the add vacation page for admin users only.
function AddVacation() {

    const [vacation, setVacation] = useState<VacationModel>(new VacationModel());
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();
    const today = new Date().toISOString().slice(0, 10);

    // Redirect unauthorized users when the page opens.
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
            }
        }
        catch {
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

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

    // Validate the form by code only, so all validation messages look consistent.
    function validateForm(): string {
        if (!vacation.destination?.trim()) return "Destination is required.";
        if (!vacation.description?.trim()) return "Description is required.";
        if (!vacation.startDate) return "Start date is required.";
        if (!vacation.endDate) return "End date is required.";
        if (vacation.price === undefined) return "Price is required.";
        if (!imageFile) return "Image is required.";
        if (vacation.price <= 0 || vacation.price > 10000) return "Price must be between 1 and 10000.";
        if (vacation.startDate < today) return "Start date cannot be in the past.";
        if (vacation.endDate < vacation.startDate) return "End date cannot be before start date.";

        return "";
    }

    // Validate the form, create FormData, and send it to the server.
    async function Send(event: SyntheticEvent): Promise<void> {
        event.preventDefault();
        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        const price = vacation.price!;
        const image = imageFile!;

        try {
            const formData = new FormData();

            formData.append("destination", vacation.destination);
            formData.append("description", vacation.description);
            formData.append("startDate", vacation.startDate);
            formData.append("endDate", vacation.endDate);
            formData.append("price", price.toString());
            formData.append("image", image);

            await vacationsService.addVacation(formData);
            navigate("/admin-vacations");
        }
        catch (err: any) {
            setError(err.response?.data || "Failed to add vacation.");
        }
    }

    return (
        <div className="add-vacation">
            <h4>Add Vacation</h4>

            {error && <p>{error}</p>}

            <form onSubmit={Send} noValidate>
                <input type="text" name="destination" placeholder="Destination" onChange={handleChange} />

                <textarea name="description" placeholder="Description" onChange={handleChange} />

                <input type="date" name="startDate" onChange={handleChange} />

                <input type="date" name="endDate" onChange={handleChange} />

                <input type="number" name="price" placeholder="Price" onChange={handleChange} />

                <input type="file" accept="image/*" onChange={handleFileChange} />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddVacation;
