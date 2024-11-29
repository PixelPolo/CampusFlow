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
  public fullCourses: FullCourse[] = [];

  @bindable({})
  public selectedCourse: FullCourse | null = null;

  // *******************
  // ***** METHODS *****
  // *******************

  async binding(): Promise<void> {
    this.fullCourses = (await this.courseAPI.getFullCourses()).data;
    console.table(this.fullCourses);
  }

  selectCourse(course: FullCourse): void {
    this.selectedCourse = course;
  }
}
