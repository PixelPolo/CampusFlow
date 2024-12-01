import { bindable, ICustomElementViewModel } from "aurelia";
import { FullCourse } from "../../../services/api/course-api";

export class CourseDetail implements ICustomElementViewModel {
  // ******************
  // ***** FIELDS *****
  // ******************
  @bindable() course: FullCourse;

  attached() {
    console.log(this.course);
  }
}