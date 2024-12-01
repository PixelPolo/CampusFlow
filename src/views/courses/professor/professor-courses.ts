import { AuthService } from "./../../../services/auth/auth";
import { FullCourse } from "./../../../services/api/course-api";
import { observable, resolve } from "aurelia";
import { CourseAPI } from "../../../services/api/course-api";
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
  readonly courseAPI: CourseAPI = resolve(CourseAPI);
  readonly authService: AuthService = resolve(AuthService);

  // ******************
  // ***** FIELDS *****
  // ******************
  @observable
  public myCourses = [];

  // *******************
  // ***** METHODS *****
  // *******************
  attached() {
    const userID = this.authService.getUserID();
    this.courseAPI
      .getFullCourses()
      .then((response) => {
        this.myCourses = response.data.filter((course: FullCourse) => {
          return course.user_id === userID;
        });
      })
      .catch((error) => {
        console.error("Error when retrieving courses:", error);
      });
  }
}
