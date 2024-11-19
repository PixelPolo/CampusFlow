import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";

// *****************
// ***** USERS *****
// *****************

// Interface
export interface User {
  user_id?: number;
  password: string;
  roles: string[];
  firstName: string;
  lastName: string;
  email: string;
}

// ID Generation
let id = 0;
function genID() {
  return ++id;
}

// Mock Data
let users: User[] = [
  {
    user_id: genID(),
    password: "123",
    roles: ["student"],
    firstName: "Jack",
    lastName: "Doe",
    email: "jack.doe@student.com",
  },
  {
    user_id: genID(),
    password: "123",
    roles: ["professor"],
    firstName: "Fabian",
    lastName: "Smith",
    email: "fabian.smith@university.com",
  },
  {
    user_id: genID(),
    password: "123",
    roles: ["administrative"],
    firstName: "Jane",
    lastName: "Johnson",
    email: "jane.johnson@university.com",
  },
];

// ***************************************
// ***** USER API RESTful SIMULATION *****
// ***************************************

@singleton()
export class UsersAPI {
  // ******************
  // ***** FIELDS *****
  // ******************
  private latency = 1000;

  // *******************
  // ***** METHODS *****
  // *******************

  // POST /users
  public createUser(newUser: User): Promise<StatusResponse<User>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userExists = users.some((user) => user.email === newUser.email);
        if (userExists) {
          reject({ status: 409, message: "Email already taken" });
        } else {
          newUser.user_id = genID();
          users.push(newUser);
          resolve({ status: 201, data: newUser });
        }
      }, this.latency);
    });
  }

  // GET /users
  public getUsers(): Promise<StatusResponse<User[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: users });
      }, this.latency);
    });
  }

  // GET /users/:id
  public getUserById(id: number): Promise<StatusResponse<User>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find((user) => user.user_id === id);
        if (user) {
          resolve({ status: 200, data: user });
        } else {
          reject({ status: 404, message: "User not found" });
        }
      }, this.latency);
    });
  }

  // GET /users/email/:email
  public getUserByEmail(email: string): Promise<StatusResponse<User>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find((user) => user.email === email);
        if (user) {
          resolve({ status: 200, data: user });
        } else {
          reject({ status: 404, message: "User not found" });
        }
      }, this.latency);
    });
  }

  // PATCH /users/:id
  public updateUser(
    id: number,
    updatedUser: Partial<User>
  ): Promise<StatusResponse<User>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = users.findIndex((user) => user.user_id === id);
        if (index !== -1) {
          users[index] = { ...users[index], ...updatedUser };
          resolve({ status: 200, data: users[index] });
        } else {
          reject({ status: 404, message: "User not found" });
        }
      }, this.latency);
    });
  }

  // DELETE /users/:id
  public deleteUser(id: number): Promise<StatusResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = users.findIndex((user) => user.user_id === id);
        if (index !== -1) {
          users.splice(index, 1);
          resolve({ status: 204, message: "User deleted successfully" });
        } else {
          reject({ status: 404, message: "User not found" });
        }
      }, this.latency);
    });
  }
}
