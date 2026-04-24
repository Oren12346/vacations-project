// Model definition for user model data used in the application.
import  type RoleModel from "./role-model";

class UserModel {
    public userId?: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password?: string;
    public role: RoleModel = "user";
}

export default UserModel;