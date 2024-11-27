import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";
import { CourseClassroomAPI } from "./course-classroom-api";
import { resolve } from "aurelia";
import { Classroom, ClassroomAPI } from "./classrooms-api";
import { CourseProgramAPI } from "./course-program-api";
import { Program, ProgramsAPI } from "./programs-api";
import { Schedule, SchedulesAPI } from "./schedules-api";

// ******************
// ***** COURSE *****
// ******************

// Interface
export interface Course {
  course_id?: number;
  name: string;
  user_id?: number; // Professor
}

// Course with joins
export interface FullCourse extends Course {
  classrooms: Classroom;
  programs: Program;
  schedules: Schedule;
}

// ID Generation
let id = 0;
function genID() {
  return ++id;
}

// Mock Data
let courses: Course[] = [
  {
    course_id: 1,
    name: "Introduction to Computer Science",
    user_id: 101,
  },
  {
    course_id: 2,
    name: "Advanced Data Structures",
    user_id: 102,
  },
  {
    course_id: 3,
    name: "Web Development",
    user_id: 103,
  },
  {
    course_id: 4,
    name: "Machine Learning",
    user_id: 104,
  },
  {
    course_id: 5,
    name: "Database Systems",
    user_id: 105,
  },
  {
    course_id: 6,
    name: "Cloud Computing",
    user_id: 106,
  },
  {
    course_id: 7,
    name: "Operating Systems",
    user_id: 107,
  },
  {
    course_id: 8,
    name: "Artificial Intelligence",
    user_id: 108,
  },
  {
    course_id: 9,
    name: "Software Engineering",
    user_id: 109,
  },
  {
    course_id: 10,
    name: "Computer Networks",
    user_id: 110,
  },
];

// ******************************************
// ***** COURSES API RESTful SIMULATION *****
// ******************************************

@singleton()
export class CourseAPI {
  // ******************
  // ***** FIELDS *****
  // ******************
  private latency = 1000;

  // *******************
  // ***** METHODS *****
  // *******************

  // POST /courses
  public createCourse(newCourse: Course): Promise<StatusResponse<Course>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const courseExists = courses.some(
          (course) => course.name === newCourse.name
        );
        if (courseExists) {
          reject({ status: 409, message: "This course already exists" });
        } else {
          newCourse.course_id = genID();
          courses.push(newCourse);
          resolve({ status: 201, data: newCourse });
        }
      }, this.latency);
    });
  }

  // GET /courses
  public getCourses(): Promise<StatusResponse<Course[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: courses });
      }, this.latency);
    });
  }

  // GET /courses/:id
  public getCoursesById(id: number): Promise<StatusResponse<Course>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const course = courses.find((course) => course.course_id === id);
        if (course) {
          resolve({ status: 200, data: course });
        } else {
          reject({ status: 404, message: "Course not found" });
        }
      }, this.latency);
    });
  }

  // GET /courses?name=:name
  public getCourseByName(name: string): Promise<StatusResponse<Course>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const course = courses.find((course) => course.name === name);
        if (course) {
          resolve({ status: 200, data: course });
        } else {
          reject({ status: 404, message: "Course not found" });
        }
      }, this.latency);
    });
  }

  // PATCH /courses/:id
  public updateCourse(
    id: number,
    updatedCourse: Partial<Course>
  ): Promise<StatusResponse<Course>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = courses.findIndex((course) => course.course_id === id);
        if (index !== -1) {
          courses[index] = { ...courses[index], ...updatedCourse };
          resolve({ status: 200, data: courses[index] });
        } else {
          reject({ status: 404, message: "Course not found" });
        }
      }, this.latency);
    });
  }

  // DELETE /courses/:id
  public deleteCourse(id: number): Promise<StatusResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = courses.findIndex((course) => course.course_id === id);
        if (index !== -1) {
          courses.splice(index, 1);
          resolve({ status: 204, message: "Course deleted successfully" });
        } else {
          reject({ status: 404, message: "Course not found" });
        }
      }, this.latency);
    });
  }

  // ***************************************
  // ***** EXTRA ROUTES WITH SQL JOINS *****
  // ***************************************

  readonly courseClassroomAPI: CourseClassroomAPI = resolve(CourseClassroomAPI);
  readonly classroomAPI: ClassroomAPI = resolve(ClassroomAPI);
  readonly courseProgramAPI: CourseProgramAPI = resolve(CourseProgramAPI);
  readonly programAPI: ProgramsAPI = resolve(ProgramsAPI);
  readonly schedulesAPI: SchedulesAPI = resolve(SchedulesAPI);

  // GET /fullCourses
  public async getFullCourses(): Promise<StatusResponse<any[]>> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Get all courses
          const coursesResponse = await this.getCourses();
          const courses = coursesResponse.data;

          // Do joins with API
          const result = await Promise.all(
            courses.map(async (course) => {
              // Get Classrooms linked to the course
              const classroomsResponse =
                await this.courseClassroomAPI.getClassroomsByCourse(
                  course.course_id!
                );
              const linkedClassrooms = await Promise.all(
                classroomsResponse.data.map(
                  async (rel) =>
                    (
                      await this.classroomAPI.getClassroomById(rel.classroom_id)
                    ).data
                )
              );

              // Get programs linked to the course
              const programsResponse =
                await this.courseProgramAPI.getProgramsByCourse(
                  course.course_id!
                );
              const linkedPrograms = await Promise.all(
                programsResponse.data.map(
                  async (rel) =>
                    (
                      await this.programAPI.getProgramById(rel.program_id)
                    ).data
                )
              );

              // Get schedules linked to the course
              const schedules = (await this.schedulesAPI.getSchedules()).data;
              const linkedSchedules = schedules.filter(
                (schedule) => schedule.course_id === course.course_id
              );

              return {
                ...course,
                classrooms: linkedClassrooms,
                programs: linkedPrograms,
                schedules: linkedSchedules,
              };
            })
          );

          resolve({ status: 200, data: result });
        } catch (error) {
          reject({ status: 500, message: "Error fetching data", error });
        }
      }, this.latency);
    });
  }
}
