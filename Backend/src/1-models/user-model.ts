// Model definition for user model data used in the application.
import type RoleModel from "./role-model";

class UserModel {
    public userId?: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public role: RoleModel = "user";

    public validateForRegister(): void {
        if (
            !this.firstName?.trim() ||
            !this.lastName?.trim() ||
            !this.email?.trim() ||
            !this.password
        ) {
            throw new Error("All fields are required.");
        }

        this.firstName = this.firstName.trim();
        this.lastName = this.lastName.trim();
        this.email = this.email.trim();

        if (!this.email.includes("@") || !this.email.includes(".")) {
            throw new Error("Invalid email.");
        }

        if (this.password.length < 4) {
            throw new Error("Password must be at least 4 characters.");
        }
    }
}

export default UserModel;