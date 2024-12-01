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
let coursePrograms: CourseProgram[] = [
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
  private latency = 1000;

  // POST /course-program
  public addCourseProgramRelation(
    courseId: number,
    programId: number
  ): Promise<StatusResponse<CourseProgram>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingRelation = coursePrograms.some(
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
          coursePrograms.push(newRelation);
          resolve({ status: 201, data: newRelation });
        }
      }, this.latency);
    });
  }

  // GET /course-programs/:course_id
  public getProgramsByCourse(
    courseId: number
  ): Promise<StatusResponse<CourseProgram[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const courseProgramsForCourse = coursePrograms.filter(
          (relation) => relation.course_id === courseId
        );
        resolve({ status: 200, data: courseProgramsForCourse });
      }, this.latency);
    });
  }

  // GET /program-course/:program_id
  public getCoursesByProgram(
    programId: number
  ): Promise<StatusResponse<CourseProgram[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const courseProgramsForProgram = coursePrograms.filter(
          (relation) => relation.program_id === programId
        );
        resolve({ status: 200, data: courseProgramsForProgram });
      }, this.latency);
    });
  }

  // DELETE /course-programs/:course_id/:program_id
  public removeCourseProgramRelation(
    courseId: number,
    programId: number
  ): Promise<StatusResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = coursePrograms.findIndex(
          (relation) =>
            relation.course_id === courseId && relation.program_id === programId
        );
        if (index !== -1) {
          coursePrograms.splice(index, 1);
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
