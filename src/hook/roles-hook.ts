import { AuthService } from "../services/auth/auth";
import { lifecycleHooks, resolve } from "aurelia";
import {
  Parameters,
  Navigation,
  RoutingInstruction,
  IRouter,
} from "@aurelia/router";

@lifecycleHooks()
export class RolesHook {
  // ********************
  // ***** SERVICES *****
  // ********************
  readonly authService: AuthService = resolve(AuthService);
  readonly router: IRouter = resolve(IRouter);

  // *******************
  // ***** METHODS *****
  // *******************
  canLoad(
    viewModel: any,
    params: Parameters,
    instruction: RoutingInstruction,
    navigation: Navigation
  ) {
    // // DEV ONLY
    // return true

    const requiredRoles = instruction.route.match.data.requiredRoles;
    const userRoles = this.authService.getUserRoles();
    if (!requiredRoles.some((role: string) => userRoles.includes(role))) {
      this.router.load("/login");
    }
    return true;
  }
}
