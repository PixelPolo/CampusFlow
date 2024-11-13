import { AuthService } from "./../services/auth";
import { lifecycleHooks, resolve } from "aurelia";
import {
  Parameters,
  Navigation,
  RoutingInstruction,
  IRouter,
} from "@aurelia/router";

@lifecycleHooks()
export class RolesHook {
  readonly authService: AuthService = resolve(AuthService);
  readonly router: IRouter = resolve(IRouter);

  constructor() {}

  async canLoad(
    viewModel: any,
    params: Parameters,
    instruction: RoutingInstruction,
    navigation: Navigation
  ) {
    const requiredRoles = instruction.route.match.data.requiredRole;
    const userRoles = this.authService.getUserRoles();
    if (!userRoles.includes(requiredRoles)) {
      this.router.load("/login");
    }
    return true;
  }
}
