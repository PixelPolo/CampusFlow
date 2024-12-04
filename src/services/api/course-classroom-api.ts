import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";

// ****************************
// ***** COURSE-CLASSROOM *****
// ****************************

export interface CourseClassroom {
  course_id: number;
  classroom_id: number;
}

// Mock Data for relation between courses and classrooms
let courseClassrooms: CourseClassroom[] = [
  { course_id: 1, classroom_id: 1 }, // Course 1 with classroom 1
  { course_id: 1, classroom_id: 2 }, // Course 1 with classroom 2
  { course_id: 2, classroom_id: 3 }, // Course 2 with classroom 3
  { course_id: 2, classroom_id: 4 }, // Course 2 with classroom 4
  { course_id: 3, classroom_id: 5 }, // Course 3 with classroom 5
  { course_id: 4, classroom_id: 6 }, // Course 4 with classroom 6
  { course_id: 4, classroom_id: 7 }, // Course 4 with classroom 7
  { course_id: 5, classroom_id: 8 }, // Course 5 with classroom 8
  { course_id: 5, classroom_id: 9 }, // Course 5 with classroom 9
  { course_id: 6, classroom_id: 10 }, // Course 6 with classroom 10
  { course_id: 7, classroom_id: 1 }, // Course 7 with classroom 1
  { course_id: 7, classroom_id: 6 }, // Course 7 with classroom 6
  { course_id: 8, classroom_id: 3 }, // Course 8 with classroom 3
  { course_id: 8, classroom_id: 4 }, // Course 8 with classroom 4
  { course_id: 9, classroom_id: 5 }, // Course 9 with classroom 5
  { course_id: 9, classroom_id: 8 }, // Course 9 with classroom 8
  { course_id: 10, classroom_id: 7 }, // Course 10 with classroom 7
  { course_id: 10, classroom_id: 9 }, // Course 10 with classroom 9
];

// *******************************************
// ***** COURSE-CLASSROOM API SIMULATION *****
// *******************************************

@singleton()
export class CourseClassroomAPI {
  private latency = 100;

  // POST /course-classrooms
  public addClassroomToCourse(
    courseId: number,
    classroomId: number
  ): Promise<StatusResponse<CourseClassroom>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingRelation = courseClassrooms.some(
          (relation) =>
            relation.course_id === courseId &&
            relation.classroom_id === classroomId
        );
        if (existingRelation) {
          reject({
            status: 409,
            message: "This classroom is already assigned to this course",
          });
        } else {
          const newRelation: CourseClassroom = {
            course_id: courseId,
            classroom_id: classroomId,
          };
          courseClassrooms.push(newRelation);
          resolve({ status: 201, data: newRelation });
        }
      }, this.latency);
    });
  }

  // GET /course-classrooms/:course_id
  public getClassroomsByCourse(
    courseId: number
  ): Promise<StatusResponse<CourseClassroom[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const courseClassroomsForCourse = courseClassrooms.filter(
          (relation) => relation.course_id === courseId
        );
        resolve({ status: 200, data: courseClassroomsForCourse });
      }, this.latency);
    });
  }

  // GET /course-classrooms/:classroomId
  public getCourseByClassroom(
    classroomId: number
  ): Promise<StatusResponse<CourseClassroom[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const courseClassroomsForCourse = courseClassrooms.filter(
          (relation) => relation.classroom_id === classroomId
        );
        resolve({ status: 200, data: courseClassroomsForCourse });
      }, this.latency);
    });
  }

  // DELETE /course-classrooms/:course_id/:classroom_id
  public removeClassroomFromCourse(
    courseId: number,
    classroomId: number
  ): Promise<StatusResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = courseClassrooms.findIndex(
          (relation) =>
            relation.course_id === courseId &&
            relation.classroom_id === classroomId
        );
        if (index !== -1) {
          courseClassrooms.splice(index, 1);
          resolve({
            status: 204,
            message: "Classroom removed from course successfully",
          });
        } else {
          reject({ status: 404, message: "Relation not found" });
        }
      }, this.latency);
    });
  }
}
