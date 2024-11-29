import { customElement, inject } from "aurelia";
import { CourseAPI } from "../../services/api/course-api";

@customElement("view-courses")
@inject(CourseAPI)
export class ViewCourses {
  public courses = [];

  constructor(private courseAPI: CourseAPI) {}

  attached() {
    this.courseAPI
      .getFullCourses()
      .then((response) => {
        this.courses = response.data;
      })
      .catch((error) => {
        console.error("Error when retrieving courses", error);
      });
  }
}
