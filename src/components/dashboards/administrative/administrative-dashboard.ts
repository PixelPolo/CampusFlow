import { IRouteableComponent } from "@aurelia/router";
import { AuthHook } from "../../../hook/auth-hook";
import { RolesHook } from "../../../hook/roles-hook";

export class AdministrativeDashboard implements IRouteableComponent {
  // *****************
  // ***** HOOKS *****
  // *****************
  static dependencies = [AuthHook, RolesHook];

  // ******************
  // ***** FIELDS *****
  // ******************
  public features = [
    {
      title: "Send Invoices",
      description: "Send invoices via email",
      route: "in-progress",
    },
    {
      title: "Automated Payment Reminders",
      description: "Schedule and send automated payment reminders",
      route: "in-progress",
    },
    {
      title: "Track Payment Statuses",
      description: "Check and manage outstanding payment statuses",
      route: "in-progress",
    },
    {
      title: "Communication",
      description: "Create events and send notifications",
      route: "in-progress",
    },
    {
      title: "Plan Facility Maintenance",
      description:
        "Coordinate facility maintenance schedules with class timetables",
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
