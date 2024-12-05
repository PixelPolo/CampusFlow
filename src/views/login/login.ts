import { IRouteableComponent, IRouter } from "@aurelia/router";
import { resolve } from "aurelia";
import { AuthService } from "../../services/auth/auth";

export class Login implements IRouteableComponent {
  // ********************
  // ***** SERVICES *****
  // ********************
  readonly authService = resolve(AuthService);
  readonly router = resolve(IRouter);

  // ******************
  // ***** FIELDS *****
  // ******************
  email: string = "";
  password: string = "";
  loginMessage: string = "";
  loginError: boolean = false;

  // *******************
  // ***** METHODS *****
  // *******************

  // Form login
  async login() {
    // Auth service login
    this.authService
      .login(this.email, this.password)
      .then((result) => {
        // Successful login
        this.loginMessage = result.message;
        this.loginError = false;
        const user = this.authService.currentUser;
        // Role based redirection
        if (user.roles.includes("student")) {
          this.router.load("/student-dashboard");
        } else if (user.roles.includes("professor")) {
          this.router.load("/professor-dashboard");
        } else if (user.roles.includes("administrative")) {
          this.router.load("/administrative-dashboard");
        } else {
          this.loginMessage = "Unknown role. Cannot redirect.";
          this.loginError = true;
        }
      })
      .catch((error) => {
        // Error login
        this.loginMessage = error.message;
        this.loginError = true;
      });
  }
}
