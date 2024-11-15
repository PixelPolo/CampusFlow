import { IRoute, IRouter } from "@aurelia/router";
import { Login } from "./components/login/login";
import { About } from "./components/about/about";
import { StudentDashboard } from "./components/dashboards/student/student-dashboard";
import { ProfessorDashboard } from "./components/dashboards/professor/professor-dashboard";
import { AdministrativeDashboard } from "./components/dashboards/administrative/administrative-dashboard";
import { InProgress } from "./components/in-progress/in-progress";
import { AuthService } from "./services/auth/auth";
import { resolve } from "aurelia";
import { watch } from "aurelia";

export class MyApp {
  // ********************
  // ***** SERVICES *****
  // ********************
  readonly authService: AuthService = resolve(AuthService);
  readonly router: IRouter = resolve(IRouter);

  // ******************
  // ***** FIELDS *****
  // ******************
  static routes: IRoute[] = [
    {
      path: "",
      title: "/",
      redirectTo: "login",
      data: {
        nav: false,
        public: true,
      },
    },
    {
      component: Login,
      path: "login",
      title: "Login",
      data: {
        nav: false,
        public: true,
      },
    },
    {
      component: About,
      path: "about",
      title: "About",
      data: {
        nav: true,
        public: true,
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
        requiredRoles: ["student"],
      },
    },
    {
      component: ProfessorDashboard,
      path: "professor-dashboard",
      title: "Professor Dashboard",
      data: {
        nav: true,
        requiredRoles: ["professor"],
      },
    },
    {
      component: AdministrativeDashboard,
      path: "administrative-dashboard",
      title: "Administrative Dashboard",
      data: {
        nav: true,
        requiredRoles: ["administrative"],
      },
    },
  ];

  public allowedRoutes: IRoute[] = [];

  // ***********************
  // ***** CONSTRUCTOR *****
  // ***********************
  constructor() {
    this.updateAllowedRoutes();
  }

  // *******************
  // ***** METHODS *****
  // *******************

  // Watch the authService.currentUser observable
  @watch("authService.currentUser")
  public currentUserChanged() {
    this.updateAllowedRoutes();
  }

  // Role based dynamic menu
  private updateAllowedRoutes() {
    const userRoles = this.authService.getUserRoles();
    this.allowedRoutes = MyApp.routes.filter((route) => {
      const routeData = route.data as {
        requiredRoles?: string[];
        nav?: boolean;
        public?: boolean;
      };
      const isPublic = routeData.public;
      const requiredRoles = routeData.requiredRoles;
      const navigable = routeData.nav;
      return (
        // Navigable AND...
        navigable !== false &&
        // Public OR ...
        (isPublic ||
          // Logged in AND required roles
          (this.authService.isAuthenticated() &&
            (!requiredRoles ||
              requiredRoles.some((role) => userRoles.includes(role)))))
      );
    });
  }

  // Credentials
  public openGithubCredentials() {
    window.open("https://github.com/aurelia-mdc-web/new", "_blank");
  }

  // logout
  public logout() {
    this.authService.logout();
    this.home();
  }

  // home
  public home() {
    this.router.load("/");
  }
}
