import { IRouter } from "@aurelia/router";
import { Course } from "../../../services/api/course-api";
import { resolve } from "aurelia";

export class AddCourse {
  // ********************
  // ***** SERVICES *****
  // ********************
  private readonly router: IRouter = resolve(IRouter);

  // ******************
  // ***** FIELDS *****
  // ******************

  public course: Course = null;

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
