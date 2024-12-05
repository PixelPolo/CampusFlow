import { observable, resolve, singleton } from "aurelia";
import { User, UsersAPI } from "../api/users-api";

@singleton()
export class AuthService {
  // ********************
  // ***** SERVICES *****
  // ********************
  readonly usersAPI = resolve(UsersAPI);

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

  // Getter for user roles
  public getUserRoles() {
    if (!this.currentUser) return [""];
    else return this.currentUser.roles;
  }

  // Getter for user id
  public getUserID(): number {
    // DEV ONLY
    return 2;
    // return this.currentUser.user_id;
  }
}
