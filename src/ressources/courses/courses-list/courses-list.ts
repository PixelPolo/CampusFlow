import { bindable, ICustomElementViewModel } from "aurelia";
import { CourseAPI, FullCourse } from "../../../services/api/course-api";
import { resolve } from "aurelia";

export class CoursesList implements ICustomElementViewModel {
  // ********************
  // ***** SERVICES *****
  // ********************

  readonly courseAPI: CourseAPI = resolve(CourseAPI);

  // ******************
  // ***** FIELDS *****
  // ******************

  @bindable({ type: Array })
  public courses: FullCourse[];

  public selectedCourse: FullCourse | null = null;

  // *******************
  // ***** METHODS *****
  // *******************
  selectCourse(course: FullCourse) {
    this.selectedCourse = this.selectedCourse === course ? null : course;
  }

  // For debugging
  coursesChanged(newValue: FullCourse[] | null, oldValue: FullCourse[] | null) {
    console.table(newValue);
  }
}
