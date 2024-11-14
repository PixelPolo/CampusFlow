import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";

const latency = 1000;
let id = 0;

function genID() {
  return ++id;
}

export interface User {
  id?: number;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
}

let users: User[] = [
  {
    id: genID(),
    password: "123",
    role: "student",
    firstName: "Jack",
    lastName: "Doe",
    email: "jack.doe@student.com",
  },
  {
    id: genID(),
    password: "123",
    role: "professor",
    firstName: "Fabian",
    lastName: "Smith",
    email: "fabian.smith@university.com",
  },
  {
    id: genID(),
    password: "123",
    role: "administrative",
    firstName: "Jane",
    lastName: "Johnson",
    email: "jane.johnson@university.com",
  },
];

@singleton()
export class UserAPI {
  isRequesting = false;

  // POST /users
  public createUser(newUser: User): Promise<StatusResponse<User>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userExists = users.some((user) => user.email === newUser.email);
        if (userExists) {
          reject({ status: 409, message: "Email already taken" });
        } else {
          newUser.id = genID();
          users.push(newUser);
          resolve({ status: 201, data: newUser });
        }
      }, latency);
    });
  }

  // GET /users
  public getUsers(): Promise<StatusResponse<User[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: users });
      }, latency);
    });
  }

  // GET /users/:id
  public getUserById(id: number): Promise<StatusResponse<User>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find((user) => user.id === id);
        if (user) {
          resolve({ status: 200, data: user });
        } else {
          reject({ status: 404, message: "User not found" });
        }
      }, latency);
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
      }, latency);
    });
  }

  // PATCH /users/:id
  public updateUser(
    id: number,
    updatedUser: Partial<User>
  ): Promise<StatusResponse<User>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = users.findIndex((user) => user.id === id);
        if (index !== -1) {
          users[index] = { ...users[index], ...updatedUser };
          resolve({ status: 200, data: users[index] });
        } else {
          reject({ status: 404, message: "User not found" });
        }
      }, latency);
    });
  }

  // DELETE /users/:id
  public deleteUser(id: number): Promise<StatusResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = users.findIndex((user) => user.id === id);
        if (index !== -1) {
          users.splice(index, 1);
          resolve({ status: 204, message: "User deleted successfully" });
        } else {
          reject({ status: 404, message: "User not found" });
        }
      }, latency);
    });
  }
}
