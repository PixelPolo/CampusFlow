import { AuthService } from "./../../../services/auth/auth";
import { observable, resolve } from "aurelia";
import { Course, CoursesAPI } from "../../../services/api/course-api";
import { AuthHook } from "../../../hook/auth-hook";
import { RolesHook } from "../../../hook/roles-hook";

export class ProfessorCourses {
  // *****************
  // ***** HOOKS *****
  // *****************
  static dependencies = [AuthHook, RolesHook];

  // ********************
  // ***** SERVICES *****
  // ********************
  readonly coursesAPI = resolve(CoursesAPI);
  readonly authService = resolve(AuthService);

  // ******************
  // ***** FIELDS *****
  // ******************
  @observable
  public myCourses: Course[] = [];

  // *******************
  // ***** METHODS *****
  // *******************
  async attached() {
    const userID = this.authService.getUserID();
    this.coursesAPI
      .getCourses()
      .then((response) => {
        this.myCourses = response.data.filter((course: Course) => {
          return course.user_id === userID;
        });
      })
      .catch((error) => {
        console.error("Error when retrieving courses:", error);
      });
  }
}
