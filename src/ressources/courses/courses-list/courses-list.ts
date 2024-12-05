import { bindable, ICustomElementViewModel } from "aurelia";
import { resolve } from "aurelia";
import { Course, CoursesAPI } from "../../../services/api/course-api";

export class CoursesList implements ICustomElementViewModel {
  // ********************
  // ***** SERVICES *****
  // ********************

  readonly courseAPI = resolve(CoursesAPI);

  // ******************
  // ***** FIELDS *****
  // ******************

  @bindable({ type: Array })
  public courses: Course[];

  public selectedCourse: Course | null = null;

  // *******************
  // ***** METHODS *****
  // *******************
  selectCourse(course: Course) {
    this.selectedCourse = this.selectedCourse === course ? null : course;
  }

  // For debugging
  coursesChanged(newValue: Course[] | null, oldValue: Course[] | null) {
    console.table(newValue);
  }
}
