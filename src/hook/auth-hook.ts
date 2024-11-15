import { AuthService } from "../services/auth/auth";
import { lifecycleHooks, resolve } from "aurelia";
import {
  Parameters,
  Navigation,
  RoutingInstruction,
  IRouter,
} from "@aurelia/router";

@lifecycleHooks()
export class AuthHook {
  readonly authService: AuthService = resolve(AuthService);
  readonly router: IRouter = resolve(IRouter);

  constructor() {}

  async canLoad(
    viewModel: any,
    params: Parameters,
    instruction: RoutingInstruction,
    navigation: Navigation
  ) {
    if (!this.authService.isAuthenticated()) {
      this.router.load("/login");
    }

    const requiredRole = instruction.route?.data?.requiredRole;
    if (requiredRole && !this.authService.getUserRoles().includes(requiredRole)) {
      await this.router.load("/in-progress"); // Redirection vers une page générique
      return false;
    }
    
    return true;
  }
}
