import { bindable, ICustomElementViewModel } from "aurelia";
import { CourseAPI, FullCourse } from "../../services/api/course-api";
import { resolve } from "aurelia";

export class CourseList implements ICustomElementViewModel {
  readonly courseAPI: CourseAPI = resolve(CourseAPI);

  @bindable({ type: Array })
  public fullCourses: FullCourse[] = [];

  async binding(): Promise<void> {
    this.fullCourses = (await this.courseAPI.getFullCourses()).data;
    console.table(this.fullCourses);
  }
}
