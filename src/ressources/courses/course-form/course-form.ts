import { bindable } from "aurelia";
import { FullCourse } from "../../../services/api/course-api";

export class CourseForm {
  // ******************
  // ***** FIELDS *****
  // ******************
  @bindable() course: FullCourse;

  attached() {
    console.log(this.course);
  }
}
