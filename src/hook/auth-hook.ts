import { AuthService } from "./../services/auth";
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

  canLoad(
    viewModel: any,
    params: Parameters,
    instruction: RoutingInstruction,
    navigation: Navigation
  ) {
    if (!this.authService.isAuthenticated()) {
      this.router.load("/login");
    }
    return true;
  }
}
