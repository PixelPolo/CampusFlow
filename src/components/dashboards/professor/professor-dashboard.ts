import { IRouteableComponent } from "@aurelia/router";
import { AuthHook } from "../../../hook/auth-hook";
import { RolesHook } from "../../../hook/roles-hook";

export class ProfessorDashboard implements IRouteableComponent {
  // *****************
  // ***** HOOKS *****
  // *****************
  static dependencies = [AuthHook, RolesHook];

  // ******************
  // ***** FIELDS *****
  // ******************
  features = [
    {
      title: "Create Course",
      description: "Add new courses",
      route: "in-progress",
    },
    {
      title: "View Courses",
      description: "Manage and modify courses",
      route: "in-progress",
    },
    {
      title: "View Attendees",
      description: "See enrolled students",
      route: "in-progress",
    },
    {
      title: "Upload Course Slides",
      description: "Add slides and materials",
      route: "in-progress",
    },
    {
      title: "Upload Course Grades",
      description: "Publish student grades",
      route: "in-progress",
    },
    {
      title: "Modify Course",
      description: "Edit course content",
      route: "in-progress",
    },
    {
      title: "Communication",
      description: "Create events and send notifications",
      route: "in-progress",
    },
    {
      title: "Maintenance request",
      description: "Create a maintenance request ticket",
      route: "in-progress",
    },
  ];

  // *******************
  // ***** METHODS *****
  // *******************
  navigateTo(route: string) {
    window.location.href = `#/${route}`;
  }
}
