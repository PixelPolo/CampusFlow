import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";

// ****************************
// ****** COURSE-PROGRAM ******
// ****************************

export interface CourseProgram {
  course_id: number;
  program_id: number;
}

// Mock Data for relation between courses and programs
let courseProgramRels: CourseProgram[] = [
  { course_id: 1, program_id: 1 },
  { course_id: 1, program_id: 2 },
  { course_id: 2, program_id: 2 },
  { course_id: 3, program_id: 3 },
  { course_id: 4, program_id: 4 },
  { course_id: 5, program_id: 5 },
  { course_id: 6, program_id: 1 },
  { course_id: 7, program_id: 2 },
  { course_id: 8, program_id: 3 },
  { course_id: 9, program_id: 4 },
  { course_id: 10, program_id: 5 },
];

// *******************************************
// ****** COURSE-PROGRAM API SIMULATION ******
// *******************************************

@singleton()
export class CourseProgramAPI {
  private latency = 100;

  // POST /course-program { "courseId": number, "programId": number }
  public addRelation(
    courseId: number,
    programId: number
  ): Promise<StatusResponse<CourseProgram>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingRelation = courseProgramRels.some(
          (relation) =>
            relation.course_id === courseId && relation.program_id === programId
        );
        if (existingRelation) {
          reject({
            status: 409,
            message: "This course is already assigned to this program",
          });
        } else {
          const newRelation: CourseProgram = {
            course_id: courseId,
            program_id: programId,
          };
          courseProgramRels.push(newRelation);
          resolve({ status: 201, data: newRelation });
        }
      }, this.latency);
    });
  }

  // GET /course-program/:course_id
  public getRelsByCourseID(
    courseId: number
  ): Promise<StatusResponse<CourseProgram[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const relations = courseProgramRels.filter(
          (relation) => relation.course_id === courseId
        );
        resolve({ status: 200, data: relations });
      }, this.latency);
    });
  }

  // GET /course-program/:program_id
  public getRelsByProgramID(
    programId: number
  ): Promise<StatusResponse<CourseProgram[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const relations = courseProgramRels.filter(
          (relation) => relation.program_id === programId
        );
        resolve({ status: 200, data: relations });
      }, this.latency);
    });
  }

  // DELETE /course-program { "courseId": number, "programId": number }
  public removeRelation(
    courseId: number,
    programId: number
  ): Promise<StatusResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = courseProgramRels.findIndex(
          (relation) =>
            relation.course_id === courseId && relation.program_id === programId
        );
        if (index !== -1) {
          courseProgramRels.splice(index, 1);
          resolve({
            status: 204,
            message: "Course-Program relation removed successfully",
          });
        } else {
          reject({
            status: 404,
            message: "Course-Program relation not found",
          });
        }
      }, this.latency);
    });
  }
}
