// import { Dashboard } from './components/dashboard/dashboard';

// export class MyApp {
//     static routes = [{ component: Dashboard, title: 'Dashboard', path: 'dashboard' }];
//     routes = MyApp.routes;
// }

import { IRoute } from "@aurelia/router";
import { Login } from "./components/login/login";
import { About } from "./components/about/about";
import { StudentDashboard } from "./components/dashboards/student/student-dashboard";
import { ProfessorDashboard } from "./components/dashboards/professor/professor-dashboard";
import { AdministrativeDashboard } from "./components/dashboards/administrative/administrative-dashboard";
import { InProgress } from "./components/in-progress/in-progress";
import { AuthService } from "./services/auth";
import { resolve } from "aurelia";

export class MyApp {
  readonly authService: AuthService = resolve(AuthService);

  static routes: IRoute[] = [
    {
      path: "",
      title: "/",
      redirectTo: "login",
      data: {
        nav: false,
      },
    },
    {
      component: Login,
      path: "login",
      title: "Login",
      data: {
        nav: false,
      },
    },
    {
      component: About,
      path: "about",
      title: "About",
      data: {
        nav: true,
      },
    },
    {
      component: InProgress,
      path: "in-progress",
      title: "In Progress",
      data: {
        nav: false,
      },
    },
    {
      component: StudentDashboard,
      path: "student-dashboard",
      title: "Student Dashboard",
      data: {
        nav: true,
        requiredRole: "student",
      },
    },
    {
      component: ProfessorDashboard,
      path: "professor-dashboard",
      title: "Professor Dashboard",
      data: {
        nav: true,
        requiredRole: "professor",
      },
    },
    {
      component: AdministrativeDashboard,
      path: "administrative-dashboard",
      title: "Administrative Dashboard",
      data: {
        nav: true,
        requiredRole: "administrative",
      },
    },
  ];
  routes = MyApp.routes;

  // Menu based on roles
  userRoles = this.authService.getUserRoles();
  allowedRoutes = this.routes.filter((route) => {
    const routeData = route.data as { requiredRole?: string; nav?: boolean };
    const requiredRole = routeData.requiredRole;
    const navigable = routeData.nav;
    return (
      navigable !== false && this.authService.isAuthenticated() &&
      (!requiredRole || this.userRoles.includes(requiredRole))
    );
  });
}
