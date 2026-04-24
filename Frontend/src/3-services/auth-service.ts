// Frontend service functions for auth service operations.
import appConfig from "../2-utils/app-config";
import axios from "axios";
import CredentialsModel from "../1-models/credentials-model";
import UserModel from "../1-models/user-model";
import store from "../store/store";
import { initUser, logoutUser } from "../store/userSlice";
import { jwtDecode } from "jwt-decode";

class AuthService {

    // Register a new user, save the token, and update the Redux store.
    public async register(user: UserModel): Promise<void> {
        const response = await axios.post(appConfig.registerUrl, user);
        const token = response.data.token;

        localStorage.setItem("token", token);

        const currentUser = jwtDecode<UserModel>(token);
        store.dispatch(initUser(currentUser));
    }

    // Log in an existing user, save the token, and update the Redux store.
    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post(appConfig.loginUrl, credentials);
        const token = response.data.token;

        localStorage.setItem("token", token);

        const currentUser = jwtDecode<UserModel>(token);
        store.dispatch(initUser(currentUser));
    }

    // Clear the token and reset the Redux user state.
    public logout(): void {
        localStorage.removeItem("token");
        store.dispatch(logoutUser());
    }

    // Restore the Redux user state from the saved JWT token.
    public initUserFromToken(): void {
        const token = localStorage.getItem("token");

        if (!token) return;

        const decodedUser = jwtDecode<UserModel>(token);
        store.dispatch(initUser(decodedUser));
    }
}

const authService = new AuthService();
export default authService;