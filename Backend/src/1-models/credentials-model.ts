// Model definition for credentials model data used in the application.
class CredentialsModel {
    public email!: string;
    public password!: string;

    public validateForLogin(): void {
        if (!this.email?.trim() || !this.password) {
            throw new Error("Email and password are required.");
        }

        this.email = this.email.trim();

        if (!this.email.includes("@") || !this.email.includes(".")) {
            throw new Error("Invalid email.");
        }

        if (this.password.length < 4) {
            throw new Error("Password must be at least 4 characters.");
        }
    }
}

export default CredentialsModel;