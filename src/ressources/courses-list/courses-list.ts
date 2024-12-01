import { bindable, ICustomElementViewModel } from "aurelia";
import { CourseAPI, FullCourse } from "../../services/api/course-api";
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

  @bindable({})
  public selectedCourse: FullCourse | null = null;

  // *******************
  // ***** METHODS *****
  // *******************
  selectCourse(course: FullCourse): void {
    this.selectedCourse = course;
  }

  // For debugging
  coursesChanged(newValue: FullCourse[] | null, oldValue: FullCourse[] | null) {
    console.table(newValue);
  }
}
