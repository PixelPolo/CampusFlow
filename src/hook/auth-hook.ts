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
  // ********************
  // ***** SERVICES *****
  // ********************
  readonly authService: AuthService = resolve(AuthService);
  readonly router: IRouter = resolve(IRouter);

  // *******************
  // ***** METHODS *****
  // *******************
  async canLoad(
    viewModel: any,
    params: Parameters,
    instruction: RoutingInstruction,
    navigation: Navigation
  ) {
    // DEV ONLY
    return true

    if (!this.authService.isAuthenticated()) {
      this.router.load("/login");
    }
    return true;
  }
}
