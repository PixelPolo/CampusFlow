import { IRouteableComponent } from "@aurelia/router";
import { UserAPI } from "../../services/api/user-api";
import { resolve } from "aurelia";

export class Login implements IRouteableComponent {
    readonly userAPI: UserAPI = resolve(UserAPI);

    email: string = '';
    password: string = '';
    loginMessage: string = '';
    loginError: boolean = false;

    async login() {
        try {
            const response = await this.userAPI.getUserByEmail(this.email);

            if (response.data && response.data.password === this.password) {
                // Login successful
                this.loginMessage = "Login successful!";
                this.loginError = false;

                // Redirection to dashboard here

            } else {
                // Password incorrect
                this.loginMessage = "Invalid email or password.";
                this.loginError = true;
            }
        } catch (error) {
            // User not found or other error
            this.loginMessage = "Invalid User.";
            this.loginError = true;
        }
    }
}
