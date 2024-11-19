import { ICustomElementViewModel, bindable } from "aurelia";
import { IRouter } from "@aurelia/router";
import { resolve } from "aurelia";

export class Dashboard implements ICustomElementViewModel {
  // ******************
  // ***** FIELDS *****
  // ******************

  @bindable({ type: String })
  public dashboardTitle: string = "Default title";

  @bindable({ type: Array })
  features: Array<{ title: string; description: string; route: string }> = [];

  // ********************
  // ***** SERVICES *****
  // ********************
  private readonly router: IRouter = resolve(IRouter);

  // *******************
  // ***** METHODS *****
  // *******************
  navigateTo(route: string) {
    this.router.load(route);
  }
}
