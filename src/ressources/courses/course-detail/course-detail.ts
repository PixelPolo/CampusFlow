import { AuthService } from "./../../../services/auth/auth";
import { bindable, ICustomElementViewModel } from "aurelia";
import { FullCourse } from "../../../services/api/course-api";
import { resolve } from "aurelia";

export class CourseDetail implements ICustomElementViewModel {
  // ********************
  // ***** SERVICES *****
  // ********************

  readonly authService: AuthService = resolve(AuthService);

  // ******************
  // ***** FIELDS *****
  // ******************
  @bindable() course: FullCourse;

  public canEdit: boolean;

  attached() {
    console.log(this.course);
    this.canEdit = this.authService.getUserRoles().includes("professor");
  }
}
