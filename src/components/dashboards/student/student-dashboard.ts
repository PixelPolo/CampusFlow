import { IRouteableComponent } from "@aurelia/router";
import { AuthHook } from "../../../hook/auth-hook";
import { RolesHook } from "../../../hook/roles-hook";

export class StudentDashboard implements IRouteableComponent {
  // *****************
  // ***** HOOKS *****
  // *****************
  static dependencies = [AuthHook, RolesHook];

  // ******************
  // ***** FIELDS *****
  // ******************
  features = [
    {
      title: "My Courses",
      description: "View and manage your courses",
      route: "in-progress",
    },
    {
      title: "Upcoming Exams",
      description: "Check upcoming exam dates",
      route: "in-progress",
    },
    {
      title: "Grades",
      description: "View your course grades",
      route: "in-progress",
    },
    {
      title: "Schedules",
      description: "Manage your course schedule",
      route: "in-progress",
    },
  ];

  // *******************
  // ***** METHODS *****
  // *******************
  navigateTo(route: string) {
    // window.location.href = `#/${route}`;
  }
}
