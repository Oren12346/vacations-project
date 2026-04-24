// Backend service functions for auth service operations.
import CredentialsModel from "../1-models/credentials-model";
import UserModel from "../1-models/user-model";
import dal from "../2-utils/dal";
import appConfig from "../2-utils/app-config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResultSetHeader } from "mysql2";

class AuthService {

    // Register a new user and return a signed JWT token.
    public async register(user: UserModel): Promise<{ token: string }> {
        user.validateForRegister();

        const sql = `SELECT * FROM users WHERE email = ?`;
        const existingUsers = await dal.execute(sql, [user.email]) as UserModel[];

        if (existingUsers.length > 0) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const insertUserSql = `INSERT INTO users(
            firstName,
            lastName,
            email,
            password,
            role
        ) VALUES (?, ?, ?, ?, ?)`;

        const info = await dal.execute(insertUserSql, [
            user.firstName,
            user.lastName,
            user.email,
            hashedPassword,
            "user"
        ]) as ResultSetHeader;

        // Build the token payload from the newly created user data.
        const payload = {
            userId: info.insertId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: "user"
        };

        const token = jwt.sign(payload, appConfig.jwtSecret, { expiresIn: "2h" });

        return { token };
    }

    // Validate login credentials and return a signed JWT token.
    public async login(credentials: CredentialsModel): Promise<{ token: string }> {
        credentials.validateForLogin();

        // Load the matching user by email from the database.
        const sql = `SELECT * FROM users WHERE email = ?`;
        const users = await dal.execute(sql, [credentials.email]) as UserModel[];

        if (users.length === 0) {
            throw new Error("Invalid email or password");
        }

        const user = users[0]!;

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordCorrect) {
            throw new Error("Invalid email or password");
        }

        const payload = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, appConfig.jwtSecret, { expiresIn: "2h" });

        return { token };
    }
}

const authService = new AuthService();
export default authService;