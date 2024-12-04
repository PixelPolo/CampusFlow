import { bindable, ICustomElementViewModel } from "aurelia";
import { FullCourse } from "../../../services/api/course-api";

export class CourseForm implements ICustomElementViewModel {
  // ******************
  // ***** FIELDS *****
  // ******************
  @bindable() course: FullCourse;

  public isEditing: boolean = false;


  attached() {
    console.log(this.course);
  }

  edit() {
    this.isEditing = true;
  }
}
