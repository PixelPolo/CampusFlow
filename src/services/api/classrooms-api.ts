import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";

// **********************
// ***** CLASSROOMS *****
// **********************

// Interface
export interface Classroom {
  classroom_id: number;
  name: string;
  capacity: number;
}

// ID Generation
let id = 0;
function genID() {
  return ++id;
}

// Mock Data
let classrooms: Classroom[] = [
  { classroom_id: 1, name: "Science Lab", capacity: 30 },
  { classroom_id: 2, name: "Math Room", capacity: 25 },
  { classroom_id: 3, name: "History Room", capacity: 20 },
  { classroom_id: 4, name: "Computer Lab", capacity: 35 },
  { classroom_id: 5, name: "Art Studio", capacity: 15 },
  { classroom_id: 6, name: "Physics Lab", capacity: 40 },
  { classroom_id: 7, name: "Chemistry Lab", capacity: 32 },
  { classroom_id: 8, name: "Music Room", capacity: 20 },
  { classroom_id: 9, name: "English Room", capacity: 28 },
  { classroom_id: 10, name: "Drama Studio", capacity: 25 },
];

// ****************************************
// ***** CLASSROOM API RESTful SIMULATION *****
// ****************************************

@singleton()
export class ClassroomAPI {
  // ******************
  // ***** FIELDS *****
  // ******************
  private latency = 1000;

  // *******************
  // ***** METHODS *****
  // *******************

  // POST /classrooms
  public createClassroom(
    newClassroom: Classroom
  ): Promise<StatusResponse<Classroom>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const classroomExists = classrooms.some(
          (classrooms) => classrooms.name === newClassroom.name
        );
        if (classroomExists) {
          reject({ status: 409, message: "This classroom already exists" });
        } else {
          newClassroom.classroom_id = genID();
          classrooms.push(newClassroom);
          resolve({ status: 201, data: newClassroom });
        }
      }, this.latency);
    });
  }

  // GET /classroom
  public getClassroom(): Promise<StatusResponse<Classroom[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: classrooms });
      }, this.latency);
    });
  }

  // GET /classroom/:id
  public getClassroomById(id: number): Promise<StatusResponse<Classroom>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const classroom = classrooms.find(
          (classroom) => classroom.classroom_id === id
        );
        if (classroom) {
          resolve({ status: 200, data: classroom });
        } else {
          reject({ status: 404, message: "Classroom not found" });
        }
      }, this.latency);
    });
  }

  // GET /classroom?name=:name
  public getClassroomByName(name: string): Promise<StatusResponse<Classroom>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const classroom = classrooms.find(
          (classroom) => classroom.name === name
        );
        if (classroom) {
          resolve({ status: 200, data: classroom });
        } else {
          reject({ status: 404, message: "Classroom not found" });
        }
      }, this.latency);
    });
  }

  // PATCH /classroom/:id
  public updateClassroom(
    id: number,
    updatedClassroom: Partial<Classroom>
  ): Promise<StatusResponse<Classroom>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = classrooms.findIndex(
          (classroom) => classroom.classroom_id === id
        );
        if (index !== -1) {
          classrooms[index] = { ...classrooms[index], ...updatedClassroom };
          resolve({ status: 200, data: classrooms[index] });
        } else {
          reject({ status: 404, message: "Classroom not found" });
        }
      }, this.latency);
    });
  }

  // DELETE /classroom/:id
  public deleteClassroom(id: number): Promise<StatusResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = classrooms.findIndex(
          (classroom) => classroom.classroom_id === id
        );
        if (index !== -1) {
          classrooms.splice(index, 1);
          resolve({ status: 204, message: "Classroom deleted successfully" });
        } else {
          reject({ status: 404, message: "Classroom not found" });
        }
      }, this.latency);
    });
  }
}
