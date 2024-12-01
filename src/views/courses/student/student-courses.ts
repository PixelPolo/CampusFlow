import { resolve } from "aurelia";
import { CourseAPI } from "../../../services/api/course-api";
import { AuthHook } from "../../../hook/auth-hook";
import { RolesHook } from "../../../hook/roles-hook";

export class StudentCourses {
  // *****************
  // ***** HOOKS *****
  // *****************
  static dependencies = [AuthHook, RolesHook];

  // ********************
  // ***** SERVICES *****
  // ********************
  readonly courseAPI: CourseAPI = resolve(CourseAPI);

  // ******************
  // ***** FIELDS *****
  // ******************
  public allCourses = [];

  // *******************
  // ***** METHODS *****
  // *******************
  attached() {
    this.courseAPI
      .getFullCourses()
      .then((response) => {
        this.allCourses = response.data;
      })
      .catch((error) => {
        console.error("Error when retrieving courses", error);
      });
  }
}
