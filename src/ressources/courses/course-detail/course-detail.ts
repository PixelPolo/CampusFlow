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
  public isEditing: boolean = false;

  // *******************
  // ***** METHODS *****
  // *******************

  public attached() {
    // this.canEdit = this.authService.getUserRoles().includes("professor");
    // Dev only
    this.isEditing = false;
    this.canEdit = true;
  }

  public edit() {
    this.isEditing = true;
  }

  public delete() {
    alert("Not implemented 😅");
  }

  public handleSave(event: CustomEvent) {
    const courseDetail = event.detail;
    this.course = courseDetail;
    this.isEditing = false;
  }

  public handleCancel() {
    this.isEditing = false;
  }
}
