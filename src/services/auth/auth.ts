import { observable, resolve } from "aurelia";
import { User, UsersAPI } from "../api/users-api";

export class AuthService {
  // ********************
  // ***** SERVICES *****
  // ********************
  readonly usersAPI: UsersAPI = resolve(UsersAPI);

  // ******************
  // ***** FIELDS *****
  // ******************
  @observable currentUser: User | null = null;

  // *******************
  // ***** METHODS *****
  // *******************

  // Login
  public login(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      this.usersAPI
        .getUserByEmail(email)
        .then((response) => {
          const user = response.data;
          if (user.password === password) {
            this.currentUser = user;
            resolve({ success: true, message: "Login successful." });
          } else {
            reject({ success: false, message: "Incorrect password." });
          }
        })
        .catch(() => {
          reject({ success: false, message: "User not found." });
        });
    });
  }

  // Logout
  public logout() {
    this.currentUser = null;
  }

  // Is authenticated
  public isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Getters for user roles
  public getUserRoles() {
    if (!this.currentUser) return [""];
    else return this.currentUser.roles;
  }
}
