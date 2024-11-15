import { IRouteableComponent, IRouter } from "@aurelia/router";
import { UserAPI } from "../../services/api/user-api";
import { resolve } from "aurelia";
import { AuthService } from "../../services/auth/auth";

export class Login implements IRouteableComponent {
    readonly userAPI: UserAPI = resolve(UserAPI);
    readonly authService: AuthService = resolve(AuthService);
    readonly router: IRouter = resolve(IRouter);

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

                // Redirection to dashboard
                switch (response.data.role) {
                    case "student":
                      await this.router.load("/student-dashboard");
                      break;
                    case "professor":
                      await this.router.load("/professor-dashboard");
                      break;
                    case "administrative":
                      await this.router.load("/administrative-dashboard");
                      break;
                    default:
                      this.loginMessage = "Unknown role. Cannot redirect.";
                      this.loginError = true;
                  }

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
