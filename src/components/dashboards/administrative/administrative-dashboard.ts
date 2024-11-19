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

  public dashboardTitle = "Administrative Dashboard";

  public features = [
    {
      title: "Send Invoices",
      description: "Send invoices via email",
      route: "in-progress",
    },
    {
      title: "Payment Reminders",
      description: "Schedule and send payment reminders",
      route: "in-progress",
    },
    {
      title: "Track Payment",
      description: "Check and manage payments",
      route: "in-progress",
    },
    {
      title: "Communication",
      description: "Create events and send notifications",
      route: "in-progress",
    },
    {
      title: "Facility Management",
      description: "Facility maintenance schedules",
      route: "in-progress",
    },
    {
      title: "Maintenance request",
      description: "Create a maintenance request ticket",
      route: "in-progress",
    },
  ];
}
