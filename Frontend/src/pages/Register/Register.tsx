// Page component responsible for the Register screen.
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserModel from "../../1-models/user-model";
import authService from "../../3-services/auth-service";
import "./Register.css"


// Render the Register component.
function Register() {


    const [user, setUser] = useState<UserModel>(new UserModel());
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    // Update local component state when the user changes an input field.
    function handleChange(args: ChangeEvent<HTMLInputElement>) {
        const { name, value } = args.target;
        setUser({
            ...user,
            [name]: value
        });


    }

    function validateForm(): string {
        if (!user.firstName?.trim()) return "First name is required.";
        if (!user.lastName?.trim()) return "Last name is required.";
        if (!user.email?.trim()) return "Email is required.";
        if (!user.email.includes("@") || !user.email.includes(".")) return "Invalid email.";
        if (!user.password) return "Password is required.";
        if (user.password.length < 4) return "Password must be at least 4 characters.";

        return "";
    }
    // Validate the form and send the request to the server.
    async function send(event: SyntheticEvent): Promise<void> {
        event.preventDefault();
        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await authService.register(user);
            navigate("/vacations-list");
        }
        catch (err: any) {
            setError(err.response?.data || "Register failed.");
        }
    }
    return (
        <div className="register">
            <h2>Register</h2>
            {error && <p>{error}</p>}
            <form onSubmit={send} noValidate>
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button>Register</button>
            </form>
        </div>
    );
}

export default Register;