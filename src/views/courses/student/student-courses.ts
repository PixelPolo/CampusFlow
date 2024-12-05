import { CoursesAPI } from "./../../../services/api/course-api";
import { resolve } from "aurelia";
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
  readonly coursesAPI = resolve(CoursesAPI);

  // ******************
  // ***** FIELDS *****
  // ******************
  public allCourses = [];

  // *******************
  // ***** METHODS *****
  // *******************
  attached() {
    this.coursesAPI
      .getCourses()
      .then((response) => {
        this.allCourses = response.data;
      })
      .catch((error) => {
        console.error("Error when retrieving courses", error);
      });
  }
}
