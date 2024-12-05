import { IRouter } from "@aurelia/router";
import { Course } from "../../../services/api/course-api";
import { resolve } from "aurelia";
import { AuthService } from "../../../services/auth/auth";
import { AuthHook } from "../../../hook/auth-hook";
import { RolesHook } from "../../../hook/roles-hook";

export class AddCourse {
  // *****************
  // ***** HOOKS *****
  // *****************
  static dependencies = [AuthHook, RolesHook];

  // ********************
  // ***** SERVICES *****
  // ********************
  private readonly router = resolve(IRouter);
  private readonly authService = resolve(AuthService);

  // ******************
  // ***** FIELDS *****
  // ******************

  public course: Course = {
    name: "",
    user_id: this.authService.getUserID(),
  };

  // *******************
  // ***** METHODS *****
  // *******************

  public handleSave(event: CustomEvent) {
    this.router.load("professor-dashboard");
  }

  public handleCancel() {
    this.router.load("professor-dashboard");
  }
}
