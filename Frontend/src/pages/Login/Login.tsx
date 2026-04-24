// Page component responsible for the Login screen.
import { useState, ChangeEvent, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import CredentialsModel from "../../1-models/credentials-model";
import authService from "../../3-services/auth-service";
import "./Login.css"

// Render the Login component.
function Login() {

    const [credentials, setCredentials] = useState<CredentialsModel>(new CredentialsModel());
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    // Update local component state when the user changes an input field.
    function handleChange(args: ChangeEvent<HTMLInputElement>) {
        const { name, value } = args.target;

        setCredentials({
            ...credentials,
            [name]: value
        });

    }
    //validate the information needed to login.
    function validateForm(): string {
        if (!credentials.email?.trim()) return "Email is required.";
        if (!credentials.email.includes("@") || !credentials.email.includes(".")) return "Invalid email.";
        if (!credentials.password) return "Password is required.";
        if (credentials.password.length < 4) return "Password must be at least 4 characters.";

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
            await authService.login(credentials);
            navigate("/vacations-list");
        }
        catch (err: any) {
            setError(err.response?.data || "Login failed.");
        }
    }

    return (
        <div className="login">
            <div className="login-box">
                <h4>Login</h4>

                {error && <p>{error}</p>}

                <form onSubmit={send} noValidate>

                    <input type="email" name="email" placeholder="Email" value={credentials.email ?? ""} onChange={handleChange} />

                    <input type="password" name="password" placeholder="Password" value={credentials.password ?? ""} onChange={handleChange} />

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;